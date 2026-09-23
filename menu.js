const firebaseConfig = {
  apiKey: "AIzaSyCOceNGRA6w7Sjh_fZiENd6HSnp0Sr_-Wg",
  authDomain: "://firebaseapp.com",
  projectId: "apple-tap-tap-2df34",
  storageBucket: "apple-tap-tap-2df34.firebasestorage.app",
  messagingSenderId: "566834170805",
  appId: "1:566834170805:web:6e6e54c48c96fbba74a7fc",
  measurementId: "G-K3PL0CM2L7"
};

let isFirebaseInitialized = false;

function ensureFirebase() {
    if (!window.firebase || !window.firebase.auth) return false;
    if (!isFirebaseInitialized) {
        window.firebase.initializeApp(firebaseConfig);
        isFirebaseInitialized = true;
    }
    return true;
}

window.login = function() {
    if (ensureFirebase()) {
        const firebaseAuth = window.firebase.auth;
        const provider = new firebaseAuth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        window.firebase.auth().signInWithPopup(provider)
            .then((result) => {
                console.log("Success login:", result.user);
            })
            .catch(e => { 
                alert("Login failed! " + e.message); 
            });
    } else {
        alert("Loading... Please tap again in a second!");
    }
};

window.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('menu-play-btn');
    const googleBtn = document.getElementById('menu-google-btn');
    const statusText = document.getElementById('menu-status-text');

    let checkInterval = setInterval(() => {
        if (ensureFirebase()) {
            clearInterval(checkInterval);
            const auth = window.firebase.auth();

            auth.onAuthStateChanged((user) => {
                if (user) {
                    if (playBtn) {
                        playBtn.disabled = false;
                        playBtn.textContent = "Play 🍏";
                    }
                    if (statusText) {
                        statusText.style.color = "#00ff88";
                        statusText.textContent = `Welcome, ${user.displayName || "Player"}! Click 'Play' to start the beta.`;
                    }
                    if (googleBtn) googleBtn.style.display = "none";
                } else {
                    if (playBtn) {
                        playBtn.disabled = true;
                        playBtn.textContent = "Play 🍏 (Login first)";
                    }
                    if (statusText) {
                        statusText.style.color = "#bdc3c7";
                        statusText.textContent = "Please log in with Google to play the beta!";
                    }
                    if (googleBtn) googleBtn.style.display = "block";
                }
            });
        }
    }, 100);

    if (playBtn) {
        playBtn.addEventListener('click', () => { 
            window.location.href = "game.html"; 
        });
    }
});

ensureFirebase();
