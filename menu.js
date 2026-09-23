const firebaseConfig = {
  apiKey: "AIzaSyCOceNGRA6w7Sjh_fZiENd6HSnp0Sr_-Wg",
  authDomain: "apple-tap-tap-2df34.firebaseapp.com",
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

    const userInput = document.getElementById('menu-username');
    const passwordInput = document.getElementById('menu-password');
    const loginBtn = document.getElementById('menu-login-btn');
    const playBtn = document.getElementById('menu-play-btn');
    const statusText = document.getElementById('menu-status-text');

    auth.onAuthStateChanged((user) => {
        if (user) {
            if (playBtn) playBtn.disabled = false;
            if (statusText) {
                statusText.style.color = "#00ff88";
                statusText.textContent = `Logged in as: ${user.email.split('@')[0]}! Ready to play.`;
            }
            if (loginBtn) loginBtn.textContent = "Log Out ❌";
        } else {
            if (playBtn) playBtn.disabled = true;
            if (statusText) {
                statusText.style.color = "#bdc3c7";
                statusText.textContent = "Enter your username and password to play!";
            }
            if (loginBtn) loginBtn.textContent = "Login / Sign Up 🍏";
        }
    });

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (auth.currentUser) {
                auth.signOut();
                if (userInput) userInput.value = "";
                if (passwordInput) passwordInput.value = "";
                return;
            }

            const rawUser = userInput ? userInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value.trim() : "";

            if (!rawUser || !password) {
                alert("Please fill in all fields!");
                return;
            }
            if (password.length < 6) {
                alert("Password must be at least 6 characters!");
                return;
            }

            const cleanUser = rawUser.replace(/[^a-zA-Z0-9]/g, "");
            if (cleanUser.length < 3) {
                alert("Username must be at least 3 characters (letters/numbers only)!");
                return;
            }

            const fakeEmail = `${cleanUser.toLowerCase()}@game.com`;

            if (statusText) statusText.textContent = "Connecting...";

            auth.signInWithEmailAndPassword(fakeEmail, password)
                .catch((error) => {
                    if (error.code === 'auth/user-not-found') {
                        return auth.createUserWithEmailAndPassword(fakeEmail, password);
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
