const firebaseConfig = {
  apiKey: "AIzaSyCOceNGRA6w7Sjh_fZiENd6HSnp0Sr_-Wg",
  authDomain: "://firebaseapp.com",
  projectId: "apple-tap-tap-2df34",
  storageBucket: "apple-tap-tap-2df34.firebasestorage.app",
  messagingSenderId: "566834170805",
  appId: "1:566834170805:web:6e6e54c48c96fbba74a7fc",
  measurementId: "G-K3PL0CM2L7"
};

window.onload = function() { if(!window.firebase) { console.error("Firebase missing!"); } };

const firebaseApp = window.firebase ? window.firebase.initializeApp(firebaseConfig) : null;
const db = window.firebase ? window.firebase.database() : null;
const auth = window.firebase ? window.firebase.auth() : null;

if (localStorage.getItem('apple_version_game') !== 'v14') {
    localStorage.clear();
    localStorage.setItem('apple_version_game', 'v14');
}

const casesConfig = {
    cc: { price: 100,  moneyChance: 0.4, minMoney: 20,  maxMoney: 150 },  
    ce: { price: 500,  moneyChance: 0.3, minMoney: 100, maxMoney: 600 },  
    cp: { price: 1000, moneyChance: 0.2, minMoney: 300, maxMoney: 1500 } 
};

const skinsConfig = [
    { id: 'default', name: 'Apple', col: 'gray', img: 'images/apple-standr.png', cc: 1.0, ce: 1.0, cp: 1.0, chance: 1.0, mult: 1.00, desc: 'Fresh apple. x1.00' },
    { id: 'green', name: 'Green Apple', col: 'gray', img: 'images/Apple-green.png', cc: 0.15, ce: 0.4, cp: 0.6, chance: 0.01, mult: 1.05, desc: 'Green apple. x1.05' },
    { id: 'eaten', name: 'Eaten Apple', col: 'gray', img: 'images/Apple-eaten.png', cc: 0.25, ce: 0.40, cp: 0.70, chance: 0.0015, mult: 1.15, desc: 'Eaten apple. x1.15' },
    { id: 'diamond', name: 'Diamond', col: 'red', img: 'images/apple-standr.png', cc: 0.01, ce: 0.05, cp: 0.2, chance: 0, mult: 1.30, desc: 'Diamond apple. x1.30' },
    { id: 'emerald', name: 'Emerald', col: 'blue', img: 'images/apple-standr.png', cc: 0.008, ce: 0.10, cp: 0.30, chance: 0, mult: 1.50, desc: 'Emerald apple. x1.50' }
];
const perksPool = [
    { id: 'big_lucky', name: 'Big Lucky', img: 'images/lucky-p.png', levels: { 1: { dropChance: 15, clickBonus: 0.10, boxBonus: 0.05, desc: 'Skins +10%, boxes +5%.' }, 2: { dropChance: 8, clickBonus: 0.15, boxBonus: 0.09, desc: 'Skins +15%, boxes +9%.' }, 3: { dropChance: 4, clickBonus: 0.20, boxBonus: 0.15, desc: 'Skins +20%, boxes +15%.' } } },
    { id: 'more_perks', name: 'More Perks', img: 'images/nice-p.png', levels: { 1: { dropChance: 100, perkLvlBonus: 0.30, incomeReduce: 0.25, desc: 'Lvl 2/3 perks +30%. Income -25%.' } } },
    { id: 'flash', name: 'Flash Speed', img: 'images/flash-p.png', levels: { 1: { dropChance: 20, cdReduce: 0.05, desc: 'Cooldown delay -0.05s.' }, 2: { dropChance: 14, cdReduce: 0.07, desc: 'Cooldown delay -0.07s.' }, 3: { dropChance: 9, cdReduce: 0.10, desc: 'Cooldown delay -0.10s.' } } },
    { id: 'cash_back', name: 'Cash Back', img: 'images/cash-back-p.png', levels: { 1: { dropChance: 15, triggerChance: 0.05, returnPercent: 0.35, desc: '5% chance to refund 35%.' }, 2: { dropChance: 10, triggerChance: 0.10, returnPercent: 0.40, desc: '10% chance to refund 40%.' }, 3: { dropChance: 5, triggerChance: 0.18, returnPercent: 0.50, desc: '18% chance to refund 50%.' } } },
    { id: 'big_pig', name: 'Big Pig', img: 'images/big-pig-p.png', levels: { 1: { dropChance: 20, procChance: 0.07, multiplier: 5, desc: '7% chance to get x5.' }, 2: { dropChance: 15, procChance: 0.09, multiplier: 5, desc: '9% chance to get x5.' }, 3: { dropChance: 10, procChance: 0.11, multiplier: 5, desc: '11% chance to get x5.' } } },
    { id: 'piece_apple', name: 'Piece Apple', img: 'images/apply-p.png', levels: { 1: { dropChance: 20, flatBonus: 1, desc: 'Adds permanent +1 apple.' }, 2: { dropChance: 15, flatBonus: 3, desc: 'Adds permanent +3 apples.' }, 3: { dropChance: 10, flatBonus: 5, desc: 'Adds permanent +5 apples.' } } }
];

const slotsConfig = [ { id: 0, price: 0 }, { id: 1, price: 500 }, { id: 2, price: 2000 }, { id: 3, price: 5000 }, { id: 4, price: 10000 } ];

let money = parseFloat(localStorage.getItem('apple_money')) || 0;
let activeSkin = localStorage.getItem('apple_active_skin') || 'default';
let isMusicPlaying = false;
let unlockedSkins = JSON.parse(localStorage.getItem('apple_unlocked_skins')) || { default: true };
let anySkinsActive = localStorage.getItem('apple_any_skins_active') === 'true';
let diceCost = parseInt(localStorage.getItem('apple_dice_cost')) || 100;
let unlockedSlotsCount = parseInt(localStorage.getItem('apple_unlocked_slots')) || 1;
let equippedPerks = JSON.parse(localStorage.getItem('apple_equipped_perks')) || [null, null, null, null, null];
let currentRolledPerk = JSON.parse(localStorage.getItem('apple_current_rolled_perk')) || null;
let lastClickTime = 0;
let currentUserId = null;
let currentPlayerName = "Player";
const mainApple = document.getElementById('main-apple');
const moneyDisplay = document.getElementById('money-count');
const audio = document.getElementById('bg-audio');
const soundButton = document.getElementById('sound-button');
const modal = document.getElementById('inventory-modal');
const openInvBtn = document.getElementById('open-inv-btn');
const closeInvBtn = document.getElementById('close-inv-btn');
const inventoryGrid = document.getElementById('inventory-grid');
const caseC = document.getElementById('case-c');
const caseE = document.getElementById('case-e');
const caseP = document.getElementById('case-p');
const rollDiceBtn = document.getElementById('roll-dice-btn');
const rolledPerkZone = document.getElementById('rolled-perk-zone');
const dicePriceDisplay = document.getElementById('dice-price-display');
const slotsList = document.getElementById('slots-list');
const leaderboardModal = document.getElementById('leaderboard-modal');
const openLeaderboardBtn = document.getElementById('open-leaderboard-btn');
const closeLeaderboardBtn = document.getElementById('close-leaderboard-btn');
const googleLoginBtn = document.getElementById('google-login-btn');
const playerStatusText = document.getElementById('player-status-text');
const leaderboardPlayersList = document.getElementById('leaderboard-players-list');

function updateMoneyDisplay() { if (moneyDisplay) moneyDisplay.textContent = Math.floor(money); }
updateMoneyDisplay();

// Скрываем кнопку Google-входа в самой игре, так как вход теперь происходит в меню index.html
if (googleLoginBtn) googleLoginBtn.style.display = 'none';

function updateMainApple() { const cur = skinsConfig.find(s => s.id === activeSkin); if (cur && mainApple) mainApple.src = cur.img; }
updateMainApple();

function saveUserDataToCloud() {
    if (!db || !currentUserId) return;
    db.ref('users/' + currentUserId).set({
        username: currentPlayerName, money: money, activeSkin: activeSkin, anySkinsActive: anySkinsActive,
        unlockedSkins: unlockedSkins, equippedPerks: equippedPerks, unlockedSlotsCount: unlockedSlotsCount, diceCost: diceCost
    });
}
function getPerkStats() {
    let stats = { clickLucky: 0, boxLucky: 0, perkLvlBonus: 1, incomeReduce: 1, cdReduce: 0, cashbackChance: 0, cashbackPercent: 0, flatClickBonus: 0, pigChance: 0 };
    equippedPerks.forEach(perk => {
        if (!perk) return;
        if (perk.id === 'big_lucky') { stats.clickLucky += perk.effect.clickBonus; stats.boxLucky += perk.effect.boxBonus; }
        else if (perk.id === 'more_perks') { stats.perkLvlBonus += perk.effect.perkLvlBonus; stats.incomeReduce -= perk.effect.incomeReduce; }
        else if (perk.id === 'flash') { stats.cdReduce += perk.effect.cdReduce; }
        else if (perk.id === 'cash_back') { if (perk.effect.triggerChance > stats.cashbackChance) { stats.cashbackChance = perk.effect.triggerChance; stats.cashbackPercent = perk.effect.returnPercent; } }
        else if (perk.id === 'big_pig') { stats.pigChance += perk.effect.procChance; }
        else if (perk.id === 'piece_apple') { stats.flatClickBonus += perk.effect.flatBonus; }
    });
    return stats;
}

if (mainApple) {
    mainApple.addEventListener('click', (event) => {
        const pStats = getPerkStats();
        let currentCooldown = 0.25 - pStats.cdReduce;
        if (currentCooldown < 0.02) currentCooldown = 0.02;
        let currentTime = Date.now();
        if (currentTime - lastClickTime < currentCooldown * 1000) return;
        lastClickTime = currentTime;
        let baseIncome = 1;
        if (anySkinsActive) {
            let maxUnlockedMult = 1;
            skinsConfig.forEach(skin => { if (unlockedSkins[skin.id] === true && skin.mult > maxUnlockedMult) { maxUnlockedMult = skin.mult; } });
            baseIncome = maxUnlockedMult;
        } else {
            const curSkin = skinsConfig.find(s => s.id === activeSkin);
            baseIncome = curSkin ? curSkin.mult : 1;
        }
        let finalIncome = baseIncome + pStats.flatClickBonus;
        let isPigTriggered = false;
        if (Math.random() <= pStats.pigChance) { finalIncome = finalIncome * 5; isPigTriggered = true; }
        finalIncome = finalIncome * pStats.incomeReduce; money = money + finalIncome;
        localStorage.setItem('apple_money', money); updateMoneyDisplay(); saveUserDataToCloud();
        skinsConfig.forEach(skin => {
            if (skin.id !== 'default' && !unlockedSkins[skin.id]) {
                let finalClickChance = skin.chance * (1 + pStats.clickLucky);
                if (Math.random() <= finalClickChance) { unlockedSkins[skin.id] = true; localStorage.setItem('apple_unlocked_skins', JSON.stringify(unlockedSkins)); alert(`Unlocked: ${skin.name}!`); if (modal && modal.style.display === 'flex') renderInventory(); }
            }
        });
        const particle = document.createElement('div'); particle.classList.add('click-particle');
        if (isPigTriggered) { particle.style.color = '#ff6b81'; particle.style.fontSize = '40px'; particle.textContent = `x5! +${finalIncome.toFixed(2)}`; }
        else { particle.textContent = `+${finalIncome.toFixed(2)}`; }
        particle.style.left = event.pageX + 'px'; particle.style.top = event.pageY + 'px';
        document.body.appendChild(particle); setTimeout(() => particle.remove(), 600);
    });
}

function openBox(caseType, wrapperId) {
    const wrapper = document.getElementById(wrapperId); if (!wrapper) return;
    const currentCase = casesConfig[caseType]; const pStats = getPerkStats();
    if (money < currentCase.price) { const noMoneyParticle = document.createElement('div'); noMoneyParticle.classList.add('drop-particle'); noMoneyParticle.style.color = '#e74c3c'; noMoneyParticle.textContent = 'No Apples!'; wrapper.appendChild(noMoneyParticle); setTimeout(() => noMoneyParticle.remove(), 1000); return; }
    let spentAmount = currentCase.price; money = money - spentAmount;
    if (Math.random() <= pStats.cashbackChance) { money = money + (spentAmount * pStats.cashbackPercent); }
    localStorage.setItem('apple_money', money); updateMoneyDisplay(); saveUserDataToCloud();
    const dropParticle = document.createElement('div'); dropParticle.classList.add('drop-particle');
    if (Math.random() <= currentCase.moneyChance) {
        let wonMoney = Math.floor(Math.random() * (currentCase.maxMoney - currentCase.minMoney + 1)) + currentCase.minMoney;
        wonMoney = wonMoney * pStats.incomeReduce; money = money + wonMoney; localStorage.setItem('apple_money', money); updateMoneyDisplay(); saveUserDataToCloud();
        dropParticle.style.color = '#FFD700'; dropParticle.textContent = `+${wonMoney.toFixed(0)} 🍎`; 
    } else {
        let availableSkins = skinsConfig.filter(skin => !unlockedSkins[skin.id] && skin[caseType] !== undefined);
        if (availableSkins.length === 0) { dropParticle.style.color = '#e74c3c'; dropParticle.textContent = 'Maxed!'; } else {
            let wonSkin = null; availableSkins.sort((a, b) => a[caseType] - b[caseType]);
            for (let skin of availableSkins) { let finalBoxChance = skin[caseType] * (1 + pStats.boxLucky); if (Math.random() <= finalBoxChance) { wonSkin = skin; break; } }
            if (wonSkin) { unlockedSkins[wonSkin.id] = true; localStorage.setItem('apple_unlocked_skins', JSON.stringify(unlockedSkins)); dropParticle.innerHTML = `<img src="${wonSkin.img}">`; if (modal && modal.style.display === 'flex') renderInventory(); } 
            else { dropParticle.style.color = '#fff'; dropParticle.textContent = 'Empty...'; }
        }
    }
    wrapper.appendChild(dropParticle); setTimeout(() => dropParticle.remove(), 1000);
}
if (caseC) caseC.addEventListener('click', () => openBox('cc', 'wrapper-case-c'));
if (caseE) caseE.addEventListener('click', () => openBox('ce', 'wrapper-case-e'));
if (caseP) caseP.addEventListener('click', () => openBox('cp', 'wrapper-case-p'));
function updateDiceUI() {
    if (dicePriceDisplay) dicePriceDisplay.textContent = `${diceCost} 🍎`; 
    if (currentRolledPerk) { rollDiceBtn.classList.add('disabled'); rolledPerkZone.classList.add('visible'); rolledPerkZone.innerHTML = `<img src="${currentRolledPerk.img}" style="width:55px;height:55px;object-fit:contain;">${createTooltipHTML(currentRolledPerk)}`; } 
    else { rollDiceBtn.classList.remove('disabled'); rolledPerkZone.classList.remove('visible'); rolledPerkZone.innerHTML = ''; }
}

function createTooltipHTML(perk) { let maxLvlText = perk.id === 'more_perks' ? '1' : '3'; return `<div class="perk-tooltip"><h4>${perk.name}</h4><div class="perk-lvl-text">Level: ${perk.lvl} / ${maxLvlText}</div><p>${perk.desc}</p></div>`; }

if (rollDiceBtn) {
    rollDiceBtn.addEventListener('click', () => {
        if (currentRolledPerk) return; 
        const pStats = getPerkStats(); if (money < diceCost) { alert("Not enough apples!"); return; }
        let spentAmount = diceCost; money = money - spentAmount;
        if (Math.random() <= pStats.cashbackChance) { money = money + (spentAmount * pStats.cashbackPercent); }
        updateMoneyDisplay(); localStorage.setItem('apple_money', money); saveUserDataToCloud();
        const randomTemplate = perksPool[Math.floor(Math.random() * perksPool.length)];
        let wonLvl = 1; 
        if (randomTemplate.id === 'more_perks') { wonLvl = 1; } else {
            let w3 = randomTemplate.levels.dropChance * pStats.perkLvlBonus; let w2 = randomTemplate.levels.dropChance * pStats.perkLvlBonus; let w1 = randomTemplate.levels.dropChance;
            let totalWeight = w3 + w2 + w1; let rollVal = Math.random() * totalWeight;
            if (rollVal <= w3) wonLvl = 3; else if (rollVal <= w3 + w2) wonLvl = 2; else wonLvl = 1;
        }
        let lvlDetails = randomTemplate.levels[wonLvl];
        currentRolledPerk = { id: randomTemplate.id, name: randomTemplate.name, img: randomTemplate.img, lvl: wonLvl, desc: lvlDetails.desc, effect: lvlDetails };
        localStorage.setItem('apple_current_rolled_perk', JSON.stringify(currentRolledPerk));
        if (diceCost < 2500) { diceCost = diceCost + 100; if (diceCost > 2500) diceCost = 2500; localStorage.setItem('apple_dice_cost', diceCost); }
        updateDiceUI();
    });
}

function renderSlots() {
    if (!slotsList) return; slotsList.innerHTML = '';
    slotsConfig.forEach((slot, index) => {
        const slotEl = document.createElement('div');
        if (index < unlockedSlotsCount) {
            slotEl.classList.add('perk-slot'); const perk = equippedPerks[index];
            if (perk) { slotEl.classList.add(`lvl-${perk.lvl}`); slotEl.innerHTML = `<img src="${perk.img}" style="width:50px;height:55px;object-fit:contain;">${createTooltipHTML(perk)}`; } else { slotEl.innerHTML = ''; }
            slotEl.addEventListener('click', () => {
                if (currentRolledPerk) { equippedPerks[index] = currentRolledPerk; currentRolledPerk = null; localStorage.setItem('apple_current_rolled_perk', null); localStorage.setItem('apple_equipped_perks', JSON.stringify(equippedPerks)); updateDiceUI(); renderSlots(); saveUserDataToCloud(); }
            });
        } else {
            slotEl.classList.add('perk-slot', 'locked'); slotEl.innerHTML = `<img src="images/lock.png"><span>${slot.price}🍎</span>`; 
            slotEl.addEventListener('click', () => {
                if (index === unlockedSlotsCount) {
                    if (money >= slot.price) { money = money - slot.price; unlockedSlotsCount = unlockedSlotsCount + 1; updateMoneyDisplay(); localStorage.setItem('apple_money', money); localStorage.setItem('apple_unlocked_slots', unlockedSlotsCount); renderSlots(); saveUserDataToCloud(); } else { alert("Not enough apples!"); }
                }
            });
        } slotsList.appendChild(slotEl);
    });
}
updateDiceUI(); renderSlots();

function renderInventory() {
    if (!inventoryGrid) return; inventoryGrid.innerHTML = '';
    const anyItem = document.createElement('div'); anyItem.classList.add('inv-item', 'unlocked'); anyItem.style.borderColor = '#FFD700'; if (anySkinsActive) anyItem.classList.add('active-skin');
    anyItem.innerHTML = `<div class="inv-mult-badge" style="color:#00ff88;">${anySkinsActive ? '✅' : '❌'}</div><div style="font-size:32px;">👑</div><span>Any skins</span><div class="perk-tooltip" style="left:90px; right:auto;"><h4>Any skins</h4><div class="perk-lvl-text" style="color:#00ff88;">Toggle: ACTIVE</div><p>Uses best multiplier!</p></div>`;
    anyItem.addEventListener('click', () => { anySkinsActive = !anySkinsActive; localStorage.setItem('apple_any_skins_active', anySkinsActive); renderInventory(); saveUserDataToCloud(); });
    inventoryGrid.appendChild(anyItem);
    skinsConfig.forEach(skin => {
        const item = document.createElement('div'); item.classList.add('inv-item');
        if (unlockedSkins[skin.id] === true) {
            item.classList.add('unlocked', skin.col); if (skin.id === activeSkin && !anySkinsActive) item.classList.add('active-skin');
            item.innerHTML = `<div class="inv-mult-badge">x${skin.mult.toFixed(2)}</div><img src="${skin.img}"><span>${skin.name}</span><div class="perk-tooltip" style="left:90px; right:auto;"><h4>${skin.name}</h4><div class="perk-lvl-text">Multiplier: x${skin.mult.toFixed(2)}</div><p>${skin.desc}</p></div>`;
            item.addEventListener('click', () => { activeSkin = skin.id; localStorage.setItem('apple_active_skin', activeSkin); updateMainApple(); renderInventory(); saveUserDataToCloud(); });
        } else { item.innerHTML = `<img src="images/lock.png"><span>???</span>`; }
        inventoryGrid.appendChild(item);
    });
}
if (openInvBtn && modal) openInvBtn.addEventListener('click', () => { modal.style.display = 'flex'; renderInventory(); });
if (closeInvBtn && modal) closeInvBtn.addEventListener('click', () => { modal.style.display = 'none'; });

function loadLeaderboard() {
    if (!db || !leaderboardPlayersList) return;
    db.ref('users').orderByChild('money').limitToLast(10).on('value', (snapshot) => {
        leaderboardPlayersList.innerHTML = ''; let players = [];
        snapshot.forEach((child) => { players.push(child.val()); });
        players.reverse(); 
        players.forEach((player, i) => {
            const el = document.createElement('div'); el.classList.add('leaderboard-player');
            if (player.username === currentPlayerName) el.classList.add('top-owner');
            el.innerHTML = `<span>#${i+1} ${player.username}</span><span>${Math.floor(player.money)} 🍎</span>`;
            leaderboardPlayersList.appendChild(el);
        });
    });
}

if (auth) {
    auth.onAuthStateChanged((user) => {
        if (user && !user.isAnonymous) {
            currentUserId = user.uid;
            currentPlayerName = user.displayName || "Player";
            if (playerStatusText) playerStatusText.textContent = `Signed in as: ${currentPlayerName}`;
            db.ref('users/' + currentUserId).once('value').then((snap) => {
                let snapVal = snap.val();
                if (snapVal) {
                    money = snapVal.money || money; activeSkin = snapVal.activeSkin || activeSkin; unlockedSkins = snapVal.unlockedSkins || unlockedSkins; equippedPerks = snapVal.equippedPerks || equippedPerks; unlockedSlotsCount = snapVal.unlockedSlotsCount || unlockedSlotsCount; diceCost = snapVal.diceCost || diceCost;
                    updateMoneyDisplay(); updateMainApple(); renderSlots();
                } else { saveUserDataToCloud(); }
            });
        } else { 
            window.location.href = "index.html"; 
        }
    });
}

if (openLeaderboardBtn && leaderboardModal) openLeaderboardBtn.addEventListener('click', () => { leaderboardModal.style.display = 'flex'; loadLeaderboard(); });
if (closeLeaderboardBtn && leaderboardModal) leaderboardModal.addEventListener('click', () => { leaderboardModal.style.display = 'none'; });

if (soundButton && audio) {
    soundButton.addEventListener('click', () => {
        if (!isMusicPlaying) { audio.volume = 0.3; audio.play().then(() => { isMusicPlaying = true; soundButton.src = "images/AUDIO-TYT.png"; }); } 
        else { audio.pause(); isMusicPlaying = false; soundButton.src = "images/AUDIO-NET.png"; }
    });
}

