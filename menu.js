const firebaseConfig = {
  apiKey: "AIzaSyCOceNGRA6w7Sjh_fZiENd6HSnp0Sr_-Wg",
  authDomain: "://firebaseapp.com",
  projectId: "apple-tap-tap-2df34",
  storageBucket: "apple-tap-tap-2df34.firebasestorage.app",
  messagingSenderId: "566834170805",
  appId: "1:566834170805:web:6e6e54c48c96fbba74a7fc",
  measurementId: "G-K3PL0CM2L7"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const playBtn = document.getElementById('menu-play-btn');
const googleBtn = document.getElementById('menu-google-btn');
const statusText = document.getElementById('menu-status-text');

auth.onAuthStateChanged((user) => {
    if (user && !user.isAnonymous) {
        playBtn.disabled = false;
        playBtn.textContent = "Play 🍏";
        statusText.style.color = "#00ff88";
        statusText.textContent = `Welcome, ${user.displayName || "Player"}! Click 'Play' to start the beta.`;
        if (googleBtn) googleBtn.style.display = "none";
    } else {
        playBtn.disabled = true;
        playBtn.textContent = "Play 🍏 (Login first)";
        statusText.style.color = "#bdc3c7";
        statusText.textContent = "Please log in with Google to play the beta!";
        if (googleBtn) googleBtn.style.display = "block";
    }
});

if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .catch(e => {
                console.error(e);
                alert("Login failed! " + e.message);
            });
    });
}

if (playBtn) {
    playBtn.addEventListener('click', () => {
        if (!playBtn.disabled) {
            window.location.href = "game.html";
        }
    });
}
