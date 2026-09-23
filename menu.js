const firebaseConfig = {
  apiKey: "AIzaSyCOceNGRA6w7Sjh_fZiENd6HSnp0Sr_-Wg",
  authDomain: "://firebaseapp.com",
  projectId: "apple-tap-tap-2df34",
  storageBucket: "apple-tap-tap-2df34.firebasestorage.app",
  messagingSenderId: "566834170805",
  appId: "1:566834170805:web:6e6e54c48c96fbba74a7fc",
  measurementId: "G-K3PL0CM2L7"
};

window.addEventListener('DOMContentLoaded', () => {
    if (!window.firebase) return;

    window.firebase.initializeApp(firebaseConfig);
    const auth = window.firebase.auth();

    const userInput = document.getElementById('menu-username');
    const passwordInput = document.getElementById('menu-password');
    const authBtn = document.getElementById('menu-auth-btn');
    const playBtn = document.getElementById('menu-play-btn');
    const statusText = document.getElementById('menu-status-text');
    
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const labelUser = document.getElementById('label-user');

    let currentMode = "login";

    function switchMode(mode) {
        currentMode = mode;
        if (mode === "login") {
            if (tabLogin) tabLogin.classList.add('active');
            if (tabRegister) tabRegister.classList.remove('active');
            if (labelUser) labelUser.textContent = "Username";
            if (authBtn && !auth.currentUser) authBtn.textContent = "Sign in";
        } else {
            if (tabRegister) tabRegister.classList.add('active');
            if (tabLogin) tabLogin.classList.remove('active');
            if (labelUser) labelUser.textContent = "Create Username";
            if (authBtn && !auth.currentUser) authBtn.textContent = "Create account";
        }
    }

    if (tabLogin) tabLogin.addEventListener('click', () => switchMode("login"));
    if (tabRegister) tabRegister.addEventListener('click', () => switchMode("register"));

    auth.onAuthStateChanged((user) => {
        if (user) {
            if (playBtn) playBtn.style.display = "block";
            if (statusText) {
                statusText.style.color = "#58a6ff";
                let parts = user.email ? user.email.split('@')[0] : "Player";
                statusText.textContent = `Signed in as: ${parts}. Launch the game below!`;
            }
            if (authBtn) authBtn.textContent = "Sign out of account";
        } else {
            if (playBtn) playBtn.style.display = "none";
            switchMode(currentMode);
        }
    });

    if (authBtn) {
        authBtn.addEventListener('click', () => {
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
                alert("Username must be at least 3 characters!");
                return;
            }

            const fakeEmail = `${cleanUser.toLowerCase()}@game.com`;

            if (currentMode === "login") {
                auth.signInWithEmailAndPassword(fakeEmail, password).catch((err) => {
                    alert("Sign in failed! Check username or password.");
                });
            } else {
                auth.createUserWithEmailAndPassword(fakeEmail, password).catch((err) => {
                    alert("Sign up failed! This username might be already taken.");
                });
            }
        });
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            window.location.href = "game.html";
        });
    }
});
