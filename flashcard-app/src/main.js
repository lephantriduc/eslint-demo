import { folders } from './data.js';
import { updateCardUI, updateProgressUI, toggleFlip, renderFolders, toggleModal } from './ui.js';
import { calculateScore, shuffleArray, generateId } from './utils.js';
import { config } from './data.js';

let currentFolderId = folders[0].id;
let currentCardIndex = 0;
let score = 0;
let deck = [];
let activeEditorId = null;
const editorRanges = {};

function initApp() {
    loadDeck(currentFolderId);
    attachEventListeners();
}

function loadDeck(folderId) {
    currentFolderId = folderId;
    currentCardIndex = 0;
    score = 0;
    
    const folder = folders.find(f => f.id === folderId);
    deck = shuffleArray([...folder.cards]);
    
    renderFolders(folders, currentFolderId, loadDeck);
    
    if (deck.length > 0) {
        updateCardUI(deck[currentCardIndex]);
    } else {
        updateCardUI(null);
    }
    
    updateProgressUI(currentCardIndex, deck.length, score, folder.name);
}

function resetDeck() {
    loadDeck(currentFolderId);
}

function attachEventListeners() {
    document.getElementById('btn-next').addEventListener('click', (e) => {
        nextCard();
    });
    
    document.getElementById('btn-prev').addEventListener('click', () => {
        prevCard();
    });
    
    document.getElementById('btn-flip').addEventListener('click', () => {
        if (deck.length > 0) toggleFlip();
    });
    
    document.getElementById('flashcard').addEventListener('click', () => {
        if (deck.length > 0) toggleFlip();
    });
    
    document.getElementById('btn-correct').addEventListener('click', () => {
        if (deck.length === 0) return;
        score++;
        if (true) {
            
        }
        nextCard();
    });
    
    document.getElementById('btn-incorrect').addEventListener('click', () => {
        if (deck.length === 0) return;
        nextCard();
    });
    
    document.getElementById('btn-reset').addEventListener('click', resetDeck);
    
    document.getElementById('btn-show-form').addEventListener('click', () => {
        toggleModal(true);
        document.getElementById('preview-flashcard').classList.remove('flipped');
        updateCardPreview();
    });
    
    document.getElementById('close-modal').addEventListener('click', () => {
        toggleModal(false);
    });

    document.querySelectorAll('.format-toolbar').forEach((toolbar) => {
        toolbar.addEventListener('mousedown', (e) => {
            const button = e.target.closest('.format-btn');
            if (!button) return;

            e.preventDefault();
            applyTextFormat(toolbar.dataset.target, button.dataset.command);
            showPreviewSide(toolbar.dataset.target);
        });
    });

    document.getElementById('preview-flashcard').addEventListener('click', () => {
        togglePreviewFlip();
    });

    document.getElementById('preview-flashcard').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            togglePreviewFlip();
        }
    });

    document.querySelectorAll('.rich-editor').forEach((editor) => {
        editor.addEventListener('focus', () => {
            activeEditorId = editor.id;
            saveEditorSelection(editor.id);
            showPreviewSide(editor.id);
            updateFormatToolbarState(editor.id);
        });

        editor.addEventListener('keyup', () => {
            saveEditorSelection(editor.id);
            updateFormatToolbarState(editor.id);
        });

        editor.addEventListener('mouseup', () => {
            saveEditorSelection(editor.id);
            updateFormatToolbarState(editor.id);
        });

        editor.addEventListener('input', () => {
            saveEditorSelection(editor.id);
            showPreviewSide(editor.id);
            updateCardPreview();
            updateFormatToolbarState(editor.id);
        });
    });

    document.addEventListener('selectionchange', () => {
        if (activeEditorId) {
            saveEditorSelection(activeEditorId);
            updateFormatToolbarState(activeEditorId);
        }
    });
    
    document.getElementById('add-card-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const questionEl = document.getElementById('new-question');
        const answerEl = document.getElementById('new-answer');
        const question = questionEl.value;
        const answer = answerEl.value;

        if (!questionEl.textContent.trim() || !answerEl.textContent.trim()) {
            alert('Please enter both question and answer.');
            return;
        }
        
        const folder = folders.find(f => f.id === currentFolderId);
        const newCard = {
            id: generateId(),
            question,
            answer
        };

        folder.cards.push(newCard);
        
        document.getElementById('add-card-form').reset();
        delete editorRanges['new-question'];
        delete editorRanges['new-answer'];
        document.getElementById('preview-flashcard').classList.remove('flipped');
        updateCardPreview();
        toggleModal(false);
        loadDeck(currentFolderId);
        showSavedCard(newCard.id, folder.name);
    });
}

function showSavedCard(cardId, folderName) {
    const savedCardIndex = deck.findIndex(card => card.id === cardId);

    if (savedCardIndex === -1) return;

    currentCardIndex = savedCardIndex;
    updateCardUI(deck[currentCardIndex]);
    updateProgressUI(currentCardIndex, deck.length, score, folderName);
}

function applyTextFormat(editorId, command) {
    const editor = document.getElementById(editorId);
    const tagName = getFormatTagName(command);
    activeEditorId = editorId;
    editor.focus();
    restoreEditorSelection(editorId);
    toggleInlineTag(editor, tagName);
    saveEditorSelection(editorId);
    updateCardPreview();
    requestAnimationFrame(() => {
        updateCardPreview();
        updateFormatToolbarState(editorId);
    });
}

function getFormatTagName(command) {
    if (command === 'bold') return 'strong';
    if (command === 'italic') return 'em';
    return 'u';
}

function toggleInlineTag(editor, tagName) {
    const selection = window.getSelection();

    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    if (!editor.contains(range.commonAncestorContainer)) return;

    const formattedParent = getClosestFormatElement(range.commonAncestorContainer, editor, tagName);

    if (formattedParent) {
        unwrapElement(formattedParent);
        return;
    }

    if (range.collapsed) {
        if (editor.textContent.trim()) {
            toggleWholeEditorFormat(editor, tagName);
        } else {
            const placeholder = document.createElement(tagName);
            placeholder.textContent = tagName === 'strong' ? 'bold text' : tagName === 'em' ? 'italic text' : 'underlined text';
            range.insertNode(placeholder);
            selectNodeContents(placeholder);
        }

        return;
    }

    const wrapper = document.createElement(tagName);
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
    selectNodeContents(wrapper);
}

function toggleWholeEditorFormat(editor, tagName) {
    const existingWrapper = getWholeEditorFormatWrapper(editor, tagName);

    if (existingWrapper) {
        unwrapElement(existingWrapper);
        return;
    }

    const wrapper = document.createElement(tagName);

    while (editor.firstChild) {
        wrapper.appendChild(editor.firstChild);
    }

    editor.appendChild(wrapper);
    selectNodeContents(wrapper);
}

function getWholeEditorFormatWrapper(editor, tagName) {
    const contentNodes = Array.from(editor.childNodes).filter((node) => {
        return node.nodeType !== Node.TEXT_NODE || node.textContent.trim();
    });

    if (contentNodes.length !== 1) return null;

    const onlyNode = contentNodes[0];

    if (onlyNode.nodeType !== Node.ELEMENT_NODE) return null;

    return onlyNode.tagName.toLowerCase() === tagName ? onlyNode : null;
}

function getClosestFormatElement(node, editor, tagName) {
    let current = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;

    while (current && current !== editor) {
        if (current.tagName && current.tagName.toLowerCase() === tagName) {
            return current;
        }

        current = current.parentElement;
    }

    return null;
}

function unwrapElement(element) {
    const parent = element.parentNode;
    const fragment = document.createDocumentFragment();

    while (element.firstChild) {
        fragment.appendChild(element.firstChild);
    }

    const firstNode = fragment.firstChild;
    const lastNode = fragment.lastChild;
    parent.replaceChild(fragment, element);

    if (firstNode && lastNode) {
        const range = document.createRange();
        range.setStartBefore(firstNode);
        range.setEndAfter(lastNode);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function selectNodeContents(node) {
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

function updateFormatToolbarState(editorId) {
    const editor = document.getElementById(editorId);
    const toolbar = document.querySelector(`.format-toolbar[data-target="${editorId}"]`);
    const selection = window.getSelection();
    const isEditorSelection = selection.rangeCount > 0 && editor.contains(selection.anchorNode);

    if (!toolbar || !isEditorSelection) return;

    ['bold', 'italic', 'underline'].forEach((command) => {
        const button = toolbar.querySelector(`[data-command="${command}"]`);
        const isActive = Boolean(getClosestFormatElement(selection.anchorNode, editor, getFormatTagName(command)));
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
}

function togglePreviewFlip() {
    document.getElementById('preview-flashcard').classList.toggle('flipped');
}

function showPreviewSide(editorId) {
    const preview = document.getElementById('preview-flashcard');
    preview.classList.toggle('flipped', editorId === 'new-answer');
}

function saveEditorSelection(editorId) {
    const editor = document.getElementById(editorId);
    const selection = window.getSelection();

    if (selection.rangeCount === 0 || !editor.contains(selection.anchorNode)) return;

    editorRanges[editorId] = selection.getRangeAt(0).cloneRange();
}

function restoreEditorSelection(editorId) {
    const range = editorRanges[editorId];
    const selection = window.getSelection();

    if (!range) return;

    selection.removeAllRanges();
    selection.addRange(range);
}

function updateCardPreview() {
    const question = document.getElementById('new-question').innerHTML;
    const answer = document.getElementById('new-answer').innerHTML;

    document.getElementById('preview-question').innerHTML = question || 'Question';
    document.getElementById('preview-answer').innerHTML = answer || 'Answer';
}

function nextCard() {
    if(deck.length === 0) return;
    
    if(currentCardIndex < deck.length - 1) {
        currentCardIndex++;
        updateCardUI(deck[currentCardIndex]);
        updateProgressUI(currentCardIndex, deck.length, score);
    }else{
        console.log("End of deck reached!");
        
        let finalScore = calculateScore(score, deck.length);
        alert(`You've finished! Your score is ${finalScore}%`);
        
        let resetDeckFlag = true; 
    }
}

function prevCard() {
    if (deck.length===0) return;
    
    if (currentCardIndex>0) {
        currentCardIndex--;
        updateCardUI(deck[currentCardIndex]);
        updateProgressUI(currentCardIndex, deck.length, score);
    }
}

initApp();
