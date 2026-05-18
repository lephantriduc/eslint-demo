import { folders } from './data.js';
import { updateCardUI, updateProgressUI, toggleFlip, renderFolders, toggleModal } from './ui.js';
import { calculateScore, shuffleArray, generateId } from './utils.js';
import { config } from './data.js';

let currentFolderId = folders[0].id;
let currentCardIndex = 0;
let score = 0;
let deck = [];

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
    });
    
    document.getElementById('close-modal').addEventListener('click', () => {
        toggleModal(false);
    });
    
    document.getElementById('add-card-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const question = document.getElementById('new-question').value;
        const answer = document.getElementById('new-answer').value;
        
        const folder = folders.find(f => f.id === currentFolderId);
        folder.cards.push({
            id: generateId(),
            question,
            answer
        });
        
        document.getElementById('add-card-form').reset();
        toggleModal(false);
        loadDeck(currentFolderId);
    });
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
