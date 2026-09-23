const firebaseConfig = {
  apiKey: "AIzaSyCOceNGRA6w7Sjh_fZiENd6HSnp0Sr_-Wg",
  authDomain: "://firebaseapp.com",
  projectId: "apple-tap-tap-2df34",
  storageBucket: "apple-tap-tap-2df34.firebasestorage.app",
  messagingSenderId: "566834170805",
  appId: "1:566834170805:web:6e6e54c48c96fbba74a7fc",
  measurementId: "G-K3PL0CM2L7"
};

if (window.firebase) {
    window.firebase.initializeApp(firebaseConfig);
    const auth = window.firebase.auth();

    const playBtn = document.getElementById('menu-play-btn');
    const googleBtn = document.getElementById('menu-google-btn');
    const statusText = document.getElementById('menu-status-text');

    auth.getRedirectResult().catch((e) => { 
        console.error("Redirect error:", e); 
    });

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

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            const provider = new window.firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            
            auth.signInWithPopup(provider).catch(e => { 
                alert("Login failed! " + e.message); 
            });
        });
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => { 
            window.location.href = "game.html"; 
        });
    }
} else {
    console.error("Firebase object not found in window.");
}
