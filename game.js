// === 1. ПЕРЕМЕННЫЕ И НАСТРОЙКИ (СПИСОК СКИНОВ И ШАНСЫ) ===
let money = parseInt(localStorage.getItem('apple_money')) || 0;
let activeSkin = localStorage.getItem('apple_active_skin') || 'default';
let isMusicPlaying = false;


const skinsConfig = [
    { id: 'default', name: 'red Apple', chance: 1.0, img: 'images/apple-standr.png' },
    { id: 'Green', name: 'green Apple', chance: 0.015, img: 'images/Apple-green.png' },
    { id: 'eaten', name: 'eaten Apple', chance: 0.005, img: 'images/Apple-eaten.png' },
];

// Хранилище открытых скинов (система true / false)
let unlockedSkins = JSON.parse(localStorage.getItem('apple_unlocked_skins')) || { default: true };

// Находим элементы на странице
const mainApple = document.getElementById('main-apple');
const moneyDisplay = document.getElementById('money-count');
const audio = document.getElementById('bg-audio');
const soundButton = document.getElementById('sound-button');
const modal = document.getElementById('inventory-modal');
const openInvBtn = document.getElementById('open-inv-btn');
const closeInvBtn = document.getElementById('close-inv-btn');
const inventoryGrid = document.getElementById('inventory-grid');

// Отображаем баланс и текущий скин при старте страницы
if (moneyDisplay) moneyDisplay.textContent = money;
const current = skinsConfig.find(s => s.id === activeSkin);
if (current && mainApple) mainApple.src = current.img;


// === 2. КЛИКЕР И ВЫПАДЕНИЕ СКИНОВ ===
if (mainApple) {
    mainApple.addEventListener('click', (event) => {
        // Начисляем монету за клик
        money = money + 1;
        localStorage.setItem('apple_money', money);
        if (moneyDisplay) moneyDisplay.textContent = money;

        // Проверяем шансы на выпадение новых скинов
        skinsConfig.forEach(skin => {
            if (skin.id !== 'default' && !unlockedSkins[skin.id]) {
                if (Math.random() <= skin.chance) {
                    unlockedSkins[skin.id] = true;
                    localStorage.setItem('apple_unlocked_skins', JSON.stringify(unlockedSkins));
                    alert(`You unlocked a new skin: ${skin.name}!`);
                    
                    // Перерисовываем инвентарь, чтобы замок сразу исчез, если окно открыто
                    if (modal && modal.style.display === 'flex') {
                        renderInventory();
                    }
                }
            }
        });

        // Эффект вылетающей цифры +1
        const particle = document.createElement('div');
        particle.classList.add('click-particle');
        particle.textContent = '+1';
        particle.style.left = event.pageX + 'px';
        particle.style.top = event.pageY + 'px';
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 600);
    });
}


// === 3. ИНВЕНТАРЬ (АВТОМАТИЧЕСКАЯ СБОРКА ЯЧЕЕК И ЗАМКОВ) ===
function renderInventory() {
    if (!inventoryGrid) return;
    inventoryGrid.innerHTML = ''; // Полностью очищаем сетку перед сборкой

    skinsConfig.forEach(skin => {
        // Создаем основу ячейки (прямоугольник)
        const item = document.createElement('div');
        item.classList.add('inv-item');

        // Проверяем по системе true/false, открыта ли эта ячейка
        if (unlockedSkins[skin.id] === true) {
            item.classList.add('unlocked');
            
            // Если этот скин сейчас выбран — красим ему рамку в зеленый
            if (skin.id === activeSkin) item.classList.add('active-skin');
            
            // Создаем картинку открытого яблока
            const img = document.createElement('img');
            img.src = skin.img;
            item.appendChild(img);

            // Создаем текст с названием скина
            const name = document.createElement('span');
            name.textContent = skin.name;
            item.appendChild(name);
            
            // Делаем ячейку кликабельной, чтобы можно было сменить скин
            item.addEventListener('click', () => {
                activeSkin = skin.id;
                localStorage.setItem('apple_active_skin', activeSkin);
                if (mainApple) mainApple.src = skin.img;
                renderInventory(); // Перерисовываем рамки активного скина
            });
            
        } else {
            // Если скин закрыт — создаем картинку замка
            const lockImg = document.createElement('img');
            lockImg.src = 'images/lock.png';
            item.appendChild(lockImg);

            // Скрываем название под вопросами
            const name = document.createElement('span');
            name.textContent = '???';
            item.appendChild(name);
        }
        
        // Физически выводим готовую собранную ячейку на экран в инвентарь
        inventoryGrid.appendChild(item);
    });
}

// Открытие и закрытие модального окна инвентаря
if (openInvBtn && modal) openInvBtn.addEventListener('click', () => { modal.style.display = 'flex'; renderInventory(); });
if (closeInvBtn && modal) closeInvBtn.addEventListener('click', () => { modal.style.display = 'none'; });


// === 4. МУЗЫКА И ЗВУК ===
if (soundButton && audio) {
    soundButton.addEventListener('click', () => {
        if (!isMusicPlaying) {
            audio.volume = 0.3;
            audio.play().then(() => { isMusicPlaying = true; soundButton.src = "images/AUDIO-TYT.png"; }).catch(e => console.log(e));
        } else {
            audio.pause();
            isMusicPlaying = false;
            soundButton.src = "images/AUDIO-NET.png";
        }
    });
}
