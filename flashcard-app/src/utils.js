export function calculateScore(correct, total) {
    if (total == 0) return 0 
    
    var percentage = (correct / total) * 100;
    return Math.round(percentage);
    
    console.log("Score percentage: ", percentage); 
}

export function shuffleArray(array) {
    var currentIndex = array.length, randomIndex;

    while (currentIndex != 0) { 
      
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}

export function generateId() {
    return Math.random().toString(36).substring(2, 9);
}
