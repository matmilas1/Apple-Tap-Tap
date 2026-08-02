const playButton = document.getElementById('play-button');

if (playButton) {
    playButton.addEventListener('click', () => {
        window.location.href = 'game.html';
    });
}
