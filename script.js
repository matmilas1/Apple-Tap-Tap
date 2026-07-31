let money = 0;
let isMusicPlaying = false;

const appleButton = document.querySelector('.apple img');
const moneyDisplay = document.getElementById('money-count');
const audio = document.getElementById('bg-audio');
const soundButton = document.getElementById('sound-button');

if (appleButton) {
    appleButton.addEventListener('click', () => {
        money = money + 1;
        if (moneyDisplay) {
            moneyDisplay.textContent = money;
        }
    });
}

if (soundButton && audio) {
    soundButton.addEventListener('click', () => {
        if (!isMusicPlaying) {
            audio.volume = 0.2;
            audio.play()
                .then(() => {
                    isMusicPlaying = true;
                    soundButton.src = "images/AUDIO-TYT.png";
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            audio.pause();
            isMusicPlaying = false;
            soundButton.src = "images/AUDIO-NET.png";
        }
    });
}
