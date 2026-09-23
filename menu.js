const firebaseConfig = {
  apiKey: "AIzaSyCOceNGRA6w7Sjh_fZiENd6HSnp0Sr_-Wg",
  authDomain: "://firebaseapp.com",
  projectId: "apple-tap-tap-2df34",
  storageBucket: "apple-tap-tap-2df34.firebasestorage.app",
  messagingSenderId: "566834170805",
  appId: "1:566834170805:web:6e6e54c48c96fbba74a7fc",
  measurementId: "G-K3PL0CM2L7"
};

window.onload = function() {
    if (!window.firebase) return;

    window.firebase.initializeApp(firebaseConfig);
    const auth = window.firebase.auth();

    const emailInput = document.getElementById('menu-email');
    const passwordInput = document.getElementById('menu-password');
    const loginBtn = document.getElementById('menu-login-btn');
    const playBtn = document.getElementById('menu-play-btn');
    const statusText = document.getElementById('menu-status-text');

    auth.onAuthStateChanged((user) => {
        if (user) {
            if (playBtn) {
                playBtn.disabled = false;
                playBtn.style.backgroundColor = "#5B932C";
            }
            if (statusText) {
                statusText.style.color = "#00ff88";
                statusText.textContent = `Logged in successfully! Ready to play.`;
            }
            if (loginBtn) loginBtn.textContent = "Log Out ❌";
        } else {
            if (playBtn) {
                playBtn.disabled = true;
                playBtn.style.backgroundColor = "#7f8c8d";
            }
            if (statusText) {
                statusText.style.color = "#bdc3c7";
                statusText.textContent = "Please log in or register to play the beta!";
            }
            if (loginBtn) loginBtn.textContent = "Login / Sign Up 🍏";
        }
    });

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (auth.currentUser) {
                auth.signOut();
                if (emailInput) emailInput.value = "";
                if (passwordInput) passwordInput.value = "";
                return;
            }

            const email = emailInput ? emailInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value.trim() : "";

            if (!email || !password) {
                alert("Please fill in both fields!");
                return;
            }
            if (password.length < 6) {
                alert("Password must be at least 6 characters long!");
                return;
            }

            if (statusText) statusText.textContent = "Processing...";

            auth.signInWithEmailAndPassword(email, password)
                .catch((error) => {
                    if (error.code === 'auth/user-not-found') {
                        return auth.createUserWithEmailAndPassword(email, password);
                    } else {
                        throw error;
                    }
                })
                .catch((err) => {
                    alert(err.message);
                    if (statusText) {
                        statusText.style.color = "#e74c3c";
                        statusText.textContent = "Authentication failed!";
                    }
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
};
