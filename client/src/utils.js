export function getDifficulty(time) {
    if (time < 30) return "Easy";
    else if (time < 60) return "Medium";
    else return "Hard"
}

export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}