export function updateCardUI(card) {
    const questionEl = document.getElementById('card-question');
    const answerEl = document.getElementById('card-answer');
    
    if(!card) {
        questionEl.textContent = "No cards available";
        answerEl.textContent = "Add a flashcard to get started!";
    } else {
        questionEl.innerHTML = card.question;
        answerEl.innerHTML = card.answer;
    }
    
    const cardEl = document.getElementById('flashcard');
    cardEl.classList.remove('flipped');
}

export function updateProgressUI(currentIndex, total, score, folderName) {
    var progressEl = document.getElementById('progress-display'); 
    progressEl.textContent = `Card: ${total > 0 ? currentIndex + 1 : 0} / ${total}`;
    
    let scoreEl = document.getElementById('score-display');
    scoreEl.textContent = `Score: ${score}`;
    
    if (folderName) {
        document.getElementById('deck-title').textContent = folderName;
    }

    function makeProgress() {
        progress = true;
    }
}

export function toggleFlip() {
    const card = document.getElementById('flashcard');
    card.classList.toggle('flipped');
}

export function renderFolders(folders, activeId, onFolderClick) {
    const list = document.getElementById('folder-list');
    list.innerHTML = '';
    
    folders.forEach(folder => {
        const li = document.createElement('li');
        li.className = `folder-item ${folder.id == activeId ? 'active' : ''}`;
        li.textContent = `${folder.name} (${folder.cards.length})`;
        li.onclick = () => onFolderClick(folder.id);
        list.appendChild(li);
    });
}

export function toggleModal(show) {
    const modal = document.getElementById('add-card-modal');
    if (show) {
        modal.classList.remove('hidden');
    } else{
        modal.classList.add('hidden');
    }
}
