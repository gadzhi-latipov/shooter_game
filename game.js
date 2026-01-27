// Система оружия
const weapons = {
    pistol: { 
        name: "Пистолет", 
        damage: 10, 
        fireRate: 300, 
        ammo: Infinity, 
        bulletSpeed: 12, 
        bulletSize: 5, 
        color: "#4cc9f0",
        sound: 'pistolSound',
        icon: '🔫'
    },
    rifle: { 
        name: "Винтовка", 
        damage: 25, 
        fireRate: 500, 
        ammo: 30, 
        maxAmmo: 30, 
        bulletSpeed: 15, 
        bulletSize: 6, 
        color: "#4361ee",
        sound: 'rifleSound',
        icon: '🎯'
    },
    shotgun: { 
        name: "Дробовик", 
        damage: 15, 
        fireRate: 800, 
        ammo: 8, 
        maxAmmo: 8, 
        bulletSpeed: 8, 
        bulletSize: 8, 
        spread: 0.3, 
        pellets: 5, 
        color: "#f72585",
        sound: 'shotgunSound',
        icon: '💥'
    }
};
const weaponOrder = ['pistol', 'rifle', 'shotgun'];
let weaponIndex = 0;

// Система локаций
const locations = {
    forest: {
        id: 'forest',
        name: 'Темный лес',
        background: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        music: 'audio/forest_music.mp3',
        enemies: 3,
        colorScheme: '#2d5016',
        objects: ['tree', 'rock', 'chest', 'tree', 'rock'],
        nextLocation: 'city',
        ambientSound: 'birds',
        difficultyMultiplier: 1.0
    },
    city: {
        id: 'city',
        name: 'Заброшенный город',
        background: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        music: 'audio/city_music.mp3',
        enemies: 4,
        colorScheme: '#4a4a4a',
        objects: ['building', 'car', 'vendor', 'building', 'car'],
        nextLocation: 'desert',
        ambientSound: 'city',
        difficultyMultiplier: 1.2
    },
    desert: {
        id: 'desert',
        name: 'Смертельная пустыня',
        background: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        music: 'audio/desert_music.mp3',
        enemies: 5,
        colorScheme: '#d4a574',
        objects: ['cactus', 'pyramid', 'oasis', 'cactus', 'rock'],
        nextLocation: 'forest',
        ambientSound: 'wind',
        difficultyMultiplier: 1.5
    }
};

// Система диалогов
const dialogs = {
    vendor: {
        id: 'vendor',
        name: 'Старый торговец',
        portrait: '👨‍💼',
        lines: [
            "Приветствую, путник! В этих краях опасно бродить без оружия.",
            "У меня есть кое-что особенное для храбрецов вроде тебя.",
            "Заглядывай, если нужны припасы. Цены справедливые!"
        ],
        options: [
            { text: "Показать товары", action: "showShop" },
            { text: "Расскажи о местности", action: "askLocation" },
            { text: "Мне нужно идти", action: "exit" }
        ]
    },
    chest: {
        id: 'chest',
        name: 'Загадочный сундук',
        portrait: '📦',
        lines: [
            "Сундук выглядит старым, но прочным...",
            "Замок покрыт ржавчиной, но все еще держится."
        ],
        options: [
            { text: "Попробовать открыть", action: "openChest" },
            { text: "Оставить", action: "exit" }
        ]
    },
    oasis: {
        id: 'oasis',
        name: 'Чистый источник',
        portrait: '💧',
        lines: [
            "Вода выглядит кристально чистой...",
            "Ощущается прохлада и свежесть."
        ],
        options: [
            { text: "Выпить воды", action: "drinkWater" },
            { text: "Отдохнуть здесь", action: "rest" }
        ]
    }
};

// Система персонажей
const characterSkins = {
    default: {
        id: 'default',
        name: "Стандарт",
        bodyColor: '#4cc9f0',
        headColor: '#f0f0f0',
        weaponOffset: 15,
        size: 15,
        speed: 2.0,
        icon: '👤'
    },
    soldier: {
        id: 'soldier',
        name: "Солдат",
        bodyColor: '#2a9d8f',
        headColor: '#264653',
        weaponOffset: 18,
        size: 16,
        speed: 1.8,
        helmet: true,
        icon: '💂'
    },
    ninja: {
        id: 'ninja',
        name: "Ниндзя",
        bodyColor: '#222222',
        headColor: '#333333',
        weaponOffset: 14,
        size: 14,
        speed: 2.2,
        mask: true,
        icon: '🥷'
    },
    robot: {
        id: 'robot',
        name: "Робот",
        bodyColor: '#8d99ae',
        headColor: '#2b2d42',
        weaponOffset: 20,
        size: 17,
        speed: 1.9,
        metallic: true,
        icon: '🤖'
    }
};

// Конфигурация медиа
const mediaConfig = {
    sounds: {
        backgroundMusic: 'audio/background.mp3',
        shoot: 'audio/shoot.mp3',
        reload: 'audio/reload.mp3',
        hit: 'audio/hit.mp3',
        death: 'audio/death.mp3',
        kill: 'audio/kill.mp3',
        pistol: 'audio/pistol.mp3',
        rifle: 'audio/rifle.mp3',
        shotgun: 'audio/shotgun.mp3',
        weaponSwitch: 'audio/weapon_switch.mp3',
        itemPickup: 'audio/item_pickup.mp3',
        heal: 'audio/heal.mp3',
        levelUp: 'audio/level_up.mp3',
        transition: 'audio/transition.mp3'
    }
};

// Глобальные переменные
let player = null;
let bullets = [];
let enemyBullets = [];
let enemies = [];
let particles = [];
let gameObjects = [];
let gameRunning = false;
let startTime = 0;
let kills = 0;
let playerId = null;
let currentWeapon = 'pistol';
let isReloading = false;
let gameLoopId = null;
let isMobile = true;
let soundEnabled = true;
let musicEnabled = true;
let currentLocation = 'forest';
let activeDialog = null;
let playerSkin = 'default';
let locationTransition = false;
let locationTimer = 0;
let collectedItems = [];
let playerKeys = 0;
let locationsCleared = 0;
let gamePaused = false;
let autoShoot = true;
let difficulty = 'normal';

// Джойстики
let joystickActive = false;
let aimJoystickActive = false;
let joystickX = 0;
let joystickY = 0;
let aimJoystickX = 0;
let aimJoystickY = 0;

// DOM элементы
let startScreen, gameScreen, settingsScreen, startButton;
let playerHealthFill, playerHealthText, playersList, deathScreen;
let survivalTimeSpan, killsCountSpan, locationsClearedSpan, keysCollectedSpan;
let restartButton, ammoCount, currentWeaponSpan, weaponIcon;
let gameCanvas, ctx, backgroundOverlay, animationContainer, textMessages;
let mobileControls, soundToggle, musicToggle, settingsButton;
let movementJoystick, aimJoystick, joystickHandle, aimJoystickHandle;
let weaponSwitchButton, interactButton, pauseButton, resumeButton;
let pauseMenu, mainMenuButton, deathMenuButton;
let locationUI, currentLocationName, enemiesCount, totalEnemies;
let missionInfo, keysInfo, keysCount;
let skinGrid, difficultyButtons;

// Аудио элементы
let backgroundMusic, shootSound, reloadSound, hitSound, deathSound, killSound;
let pistolSound, rifleSound, shotgunSound, weaponSwitchSound;
let itemPickupSound, healSound, levelUpSound, transitionSound;

// Инициализация DOM элементов
function initDOMElements() {
    // Основные экраны
    startScreen = document.getElementById('startScreen');
    gameScreen = document.getElementById('gameScreen');
    settingsScreen = document.getElementById('settingsScreen');
    startButton = document.getElementById('startButton');
    
    // Игровой UI
    playerHealthFill = document.getElementById('playerHealth');
    playerHealthText = document.getElementById('playerHealthText');
    playersList = document.getElementById('playersList');
    deathScreen = document.getElementById('deathScreen');
    
    // Статистика
    survivalTimeSpan = document.getElementById('survivalTime');
    killsCountSpan = document.getElementById('killsCount');
    locationsClearedSpan = document.getElementById('locationsCleared');
    keysCollectedSpan = document.getElementById('keysCollected');
    
    // Оружие и аммуниция
    restartButton = document.getElementById('restartButton');
    ammoCount = document.getElementById('ammoCount');
    currentWeaponSpan = document.getElementById('currentWeapon');
    weaponIcon = document.getElementById('weaponIcon');
    
    // Canvas и графика
    gameCanvas = document.getElementById('gameCanvas');
    backgroundOverlay = document.getElementById('backgroundOverlay');
    animationContainer = document.getElementById('animationContainer');
    textMessages = document.getElementById('textMessages');
    
    // Управление
    mobileControls = document.getElementById('mobileControls');
    soundToggle = document.getElementById('soundToggle');
    musicToggle = document.getElementById('musicToggle');
    settingsButton = document.getElementById('settingsButton');
    
    // Джойстики
    movementJoystick = document.getElementById('movementJoystick');
    aimJoystick = document.getElementById('aimJoystick');
    if (movementJoystick) {
        joystickHandle = movementJoystick.querySelector('.joystick-handle');
    }
    if (aimJoystick) {
        aimJoystickHandle = aimJoystick.querySelector('.joystick-handle');
    }
    
    // Кнопки действий
    weaponSwitchButton = document.getElementById('weaponSwitchButton');
    interactButton = document.getElementById('interactButton');
    pauseButton = document.getElementById('pauseButton');
    resumeButton = document.getElementById('resumeButton');
    
    // Меню
    pauseMenu = document.getElementById('pauseMenu');
    mainMenuButton = document.getElementById('mainMenuButton');
    deathMenuButton = document.getElementById('deathMenuButton');
    
    // Локации
    locationUI = document.getElementById('locationUI');
    currentLocationName = document.getElementById('currentLocationName');
    enemiesCount = document.getElementById('enemiesCount');
    totalEnemies = document.getElementById('totalEnemies');
    
    // Миссии
    missionInfo = document.getElementById('missionInfo');
    keysInfo = document.getElementById('keysInfo');
    keysCount = document.getElementById('keysCount');
    
    // Меню выбора
    skinGrid = document.getElementById('skinGrid');
    difficultyButtons = document.querySelectorAll('.difficulty-btn');
    
    // Аудио элементы
    backgroundMusic = document.getElementById('backgroundMusic');
    shootSound = document.getElementById('shootSound');
    reloadSound = document.getElementById('reloadSound');
    hitSound = document.getElementById('hitSound');
    deathSound = document.getElementById('deathSound');
    killSound = document.getElementById('killSound');
    pistolSound = document.getElementById('pistolSound');
    rifleSound = document.getElementById('rifleSound');
    shotgunSound = document.getElementById('shotgunSound');
    weaponSwitchSound = document.getElementById('weaponSwitchSound');
    itemPickupSound = document.getElementById('itemPickupSound');
    healSound = document.getElementById('healSound');
    levelUpSound = document.getElementById('levelUpSound');
    transitionSound = document.getElementById('transitionSound');
    
    // Получаем контекст canvas
    if (gameCanvas) {
        ctx = gameCanvas.getContext('2d');
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
    }
    
    // Загружаем настройки
    loadGameSettings();
    initSkinMenu();
    initSounds();
    preloadAllSounds();
}

// Определение устройства
function detectDevice() {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log(`Мобильный режим: ${isMobile}`);
    
    if (mobileControls && isMobile) {
        mobileControls.classList.add('active');
    }
}

// Инициализация звуков
function initSounds() {
    // Звуки оружия
    if (mediaConfig.sounds.pistol && pistolSound) {
        pistolSound.src = mediaConfig.sounds.pistol;
    }
    if (mediaConfig.sounds.rifle && rifleSound) {
        rifleSound.src = mediaConfig.sounds.rifle;
    }
    if (mediaConfig.sounds.shotgun && shotgunSound) {
        shotgunSound.src = mediaConfig.sounds.shotgun;
    }
    
    // Общие звуки
    if (mediaConfig.sounds.weaponSwitch && weaponSwitchSound) {
        weaponSwitchSound.src = mediaConfig.sounds.weaponSwitch;
    }
    if (mediaConfig.sounds.itemPickup && itemPickupSound) {
        itemPickupSound.src = mediaConfig.sounds.itemPickup;
    }
    if (mediaConfig.sounds.heal && healSound) {
        healSound.src = mediaConfig.sounds.heal;
    }
    if (mediaConfig.sounds.levelUp && levelUpSound) {
        levelUpSound.src = mediaConfig.sounds.levelUp;
    }
    if (mediaConfig.sounds.transition && transitionSound) {
        transitionSound.src = mediaConfig.sounds.transition;
    }
    
    // Настройка громкости
    backgroundMusic.volume = 0.3;
    pistolSound.volume = 0.4;
    rifleSound.volume = 0.5;
    shotgunSound.volume = 0.6;
    reloadSound.volume = 0.3;
    hitSound.volume = 0.4;
    deathSound.volume = 0.6;
    killSound.volume = 0.5;
    weaponSwitchSound.volume = 0.5;
    itemPickupSound.volume = 0.4;
    healSound.volume = 0.3;
    levelUpSound.volume = 0.5;
    transitionSound.volume = 0.4;
}

// Предзагрузка звуков
function preloadAllSounds() {
    const soundElements = [
        pistolSound, rifleSound, shotgunSound,
        reloadSound, hitSound, deathSound, killSound,
        weaponSwitchSound, itemPickupSound, healSound,
        levelUpSound, transitionSound
    ];
    
    soundElements.forEach(sound => {
        if (sound) {
            sound.load();
        }
    });
}

// Инициализация меню скинов
function initSkinMenu() {
    if (!skinGrid) return;
    
    skinGrid.innerHTML = '';
    
    Object.keys(characterSkins).forEach(skinId => {
        const skin = characterSkins[skinId];
        const card = document.createElement('div');
        card.className = `skin-card ${skinId === playerSkin ? 'selected' : ''}`;
        card.dataset.skin = skinId;
        
        card.innerHTML = `
            <div class="skin-preview" style="background: ${skin.bodyColor}">
                <div style="width: 30px; height: 30px; background: ${skin.headColor}; border-radius: 50%;"></div>
            </div>
            <div class="skin-name">${skin.name}</div>
        `;
        
        card.addEventListener('click', () => selectSkin(skinId));
        skinGrid.appendChild(card);
    });
    
    // Инициализация кнопок сложности
    if (difficultyButtons) {
        difficultyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                difficultyButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                difficulty = btn.dataset.difficulty;
                showMessage(`Сложность: ${getDifficultyName(difficulty)}`, '#ffaa00');
            });
        });
    }
}

function selectSkin(skinId) {
    if (!characterSkins[skinId]) return;
    
    playerSkin = skinId;
    
    // Обновляем визуальный выбор
    document.querySelectorAll('.skin-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`.skin-card[data-skin="${skinId}"]`).classList.add('selected');
    
    // Обновляем игрока, если он существует
    if (player) {
        player.radius = characterSkins[skinId].size;
        player.color = characterSkins[skinId].bodyColor;
        player.skin = skinId;
        player.speed = characterSkins[skinId].speed;
    }
    
    showMessage(`Выбран персонаж: ${characterSkins[skinId].name}`, '#7209b7');
    saveGameSettings();
}

function getDifficultyName(diff) {
    const names = {
        easy: 'Легкая',
        normal: 'Нормальная',
        hard: 'Сложная'
    };
    return names[diff] || 'Нормальная';
}

// Сохранение настроек
function saveGameSettings() {
    const settings = {
        skin: playerSkin,
        difficulty: difficulty,
        soundEnabled: soundEnabled,
        musicEnabled: musicEnabled,
        autoShoot: autoShoot
    };
    localStorage.setItem('shooterGameSettings', JSON.stringify(settings));
}

// Загрузка настроек
function loadGameSettings() {
    const saved = localStorage.getItem('shooterGameSettings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            playerSkin = settings.skin || 'default';
            difficulty = settings.difficulty || 'normal';
            soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true;
            musicEnabled = settings.musicEnabled !== undefined ? settings.musicEnabled : true;
            autoShoot = settings.autoShoot !== undefined ? settings.autoShoot : true;
            
            // Обновляем UI настроек
            if (soundToggle) {
                soundToggle.textContent = soundEnabled ? '🔊 Вкл звук' : '🔇 Выкл звук';
            }
            if (musicToggle) {
                musicToggle.textContent = musicEnabled ? '🎵 Вкл музыку' : '🎵 Выкл музыку';
            }
            
            // Устанавливаем сложность
            if (difficultyButtons) {
                difficultyButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.difficulty === difficulty) {
                        btn.classList.add('active');
                    }
                });
            }
        } catch (e) {
            console.log('Ошибка загрузки настроек:', e);
        }
    }
}

// Начало игры
function startGame() {
    if (!gameScreen || !startScreen) return;
    
    playerId = 'player_' + Date.now() + Math.random();
    
    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    settingsScreen.style.display = 'none';
    
    initGame();
    
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    gameLoopId = requestAnimationFrame(gameLoop);
    
    if (musicEnabled && backgroundMusic) {
        backgroundMusic.play().catch(e => console.log("Автовоспроизведение заблокировано"));
    }
}

// Перезапуск игры
function restartGame() {
    if (!deathScreen) return;
    
    deathScreen.style.display = 'none';
    pauseMenu.style.display = 'none';
    
    // Сброс всех массивов
    bullets = [];
    enemyBullets = [];
    enemies = [];
    particles = [];
    gameObjects = [];
    collectedItems = [];
    
    // Очистка контейнеров
    if (animationContainer) animationContainer.innerHTML = '';
    if (textMessages) textMessages.innerHTML = '';
    
    // Сброс оружия
    weapons.rifle.ammo = weapons.rifle.maxAmmo;
    weapons.shotgun.ammo = weapons.shotgun.maxAmmo;
    currentWeapon = 'pistol';
    weaponIndex = 0;
    isReloading = false;
    
    // Сброс статистики
    kills = 0;
    locationsCleared = 0;
    playerKeys = 0;
    startTime = Date.now();
    currentLocation = 'forest';
    locationTransition = false;
    activeDialog = null;
    
    // Инициализация игры
    initGame();
    
    // Обновление UI
    updateWeaponUI();
    updateLocationUI();
    updateKeysUI();
    
    gameRunning = true;
    gamePaused = false;
    
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    gameLoopId = requestAnimationFrame(gameLoop);
}

// Инициализация игры
function initGame() {
    if (!gameCanvas) return;
    
    const skin = characterSkins[playerSkin];
    
    player = {
        id: playerId,
        x: gameCanvas.width / 2,
        y: gameCanvas.height / 2,
        radius: skin.size,
        color: skin.bodyColor,
        speed: skin.speed,
        health: 100,
        maxHealth: 100,
        lastShot: 0,
        lastDamageTime: 0,
        rotation: 0,
        skin: playerSkin,
        keys: 0,
        score: 0
    };
    
    // Загружаем начальную локацию
    loadLocation(currentLocation);
    
    // Создаем начальных врагов
    createBots();
    
    startTime = Date.now();
    gameRunning = true;
    gamePaused = false;
    
    setupMobileControls();
    updateWeaponUI();
    updateLocationUI();
    updateKeysUI();
    showMessage("Игра началась! Уничтожьте всех врагов!", '#4cc9f0');
}

// Загрузка локации
function loadLocation(locationId) {
    const location = locations[locationId];
    if (!location) return;
    
    currentLocation = locationId;
    locationTransition = false;
    
    // Устанавливаем фон
    if (backgroundOverlay && location.background) {
        backgroundOverlay.style.backgroundImage = `url('${location.background}')`;
        backgroundOverlay.style.backgroundSize = 'cover';
        backgroundOverlay.style.backgroundPosition = 'center';
    }
    
    // Создаем объекты локации
    createLocationObjects(location);
    
    // Обновляем UI
    updateLocationUI();
    
    // Эффект перехода
    showLocationTransition(location.name);
    
    // Играем звук перехода
    if (soundEnabled && transitionSound) {
        transitionSound.currentTime = 0;
        transitionSound.play().catch(e => console.log("Ошибка звука перехода:", e));
    }
}

// Создание объектов локации
function createLocationObjects(location) {
    gameObjects = [];
    
    location.objects.forEach((objType, index) => {
        const x = 100 + (index * 200) % (gameCanvas.width - 200);
        const y = 150 + Math.floor(index / 3) * 150;
        
        let object;
        switch(objType) {
            case 'tree':
                object = {
                    type: 'tree',
                    x: x,
                    y: y,
                    width: 50,
                    height: 100,
                    interactable: false,
                    color: '#2d5016',
                    solid: true
                };
                break;
            case 'rock':
                object = {
                    type: 'rock',
                    x: x,
                    y: y,
                    width: 40,
                    height: 30,
                    interactable: false,
                    color: '#666666',
                    solid: true
                };
                break;
            case 'chest':
                object = {
                    type: 'chest',
                    x: x,
                    y: y,
                    width: 40,
                    height: 30,
                    interactable: true,
                    color: '#8b4513',
                    opened: false,
                    contains: getRandomChestItem(),
                    dialog: 'chest'
                };
                break;
            case 'vendor':
                object = {
                    type: 'vendor',
                    x: x,
                    y: y,
                    width: 35,
                    height: 60,
                    interactable: true,
                    color: '#4a4a4a',
                    dialog: 'vendor'
                };
                break;
            case 'building':
                object = {
                    type: 'building',
                    x: x,
                    y: y,
                    width: 100,
                    height: 150,
                    interactable: false,
                    color: '#666666',
                    solid: true
                };
                break;
            case 'car':
                object = {
                    type: 'car',
                    x: x,
                    y: y,
                    width: 80,
                    height: 40,
                    interactable: false,
                    color: '#ff4444',
                    solid: true
                };
                break;
            case 'cactus':
                object = {
                    type: 'cactus',
                    x: x,
                    y: y,
                    width: 25,
                    height: 80,
                    interactable: false,
                    color: '#2d5016',
                    solid: true
                };
                break;
            case 'oasis':
                object = {
                    type: 'oasis',
                    x: x,
                    y: y,
                    width: 70,
                    height: 50,
                    interactable: true,
                    color: '#4361ee',
                    healAmount: 30,
                    dialog: 'oasis',
                    healed: false
                };
                break;
            case 'pyramid':
                object = {
                    type: 'pyramid',
                    x: x,
                    y: y,
                    width: 120,
                    height: 80,
                    interactable: false,
                    color: '#d4a574',
                    solid: true
                };
                break;
        }
        
        if (object) {
            gameObjects.push(object);
        }
    });
}

function getRandomChestItem() {
    const items = ['ammo', 'health', 'key', 'weapon'];
    return items[Math.floor(Math.random() * items.length)];
}

// Настройка мобильного управления
function setupMobileControls() {
    if (!movementJoystick || !aimJoystick) return;
    
    // Левое управление (движение)
    let movementJoystickStartX = 0;
    let movementJoystickStartY = 0;
    let movementJoystickRadius = 40;
    
    movementJoystick.addEventListener('touchstart', (e) => {
        e.preventDefault();
        joystickActive = true;
        const rect = movementJoystick.getBoundingClientRect();
        movementJoystickStartX = rect.left + rect.width / 2;
        movementJoystickStartY = rect.top + rect.height / 2;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!joystickActive) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        
        let deltaX = touch.clientX - movementJoystickStartX;
        let deltaY = touch.clientY - movementJoystickStartY;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > movementJoystickRadius) {
            deltaX = (deltaX / distance) * movementJoystickRadius;
            deltaY = (deltaY / distance) * movementJoystickRadius;
        }
        
        if (joystickHandle) {
            joystickHandle.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
        }
        
        joystickX = deltaX / movementJoystickRadius;
        joystickY = deltaY / movementJoystickRadius;
    });
    
    document.addEventListener('touchend', (e) => {
        if (!joystickActive) return;
        
        joystickActive = false;
        joystickX = 0;
        joystickY = 0;
        if (joystickHandle) {
            joystickHandle.style.transform = 'translate(-50%, -50%)';
        }
    });
    
    // Правое управление (прицеливание)
    let aimJoystickStartX = 0;
    let aimJoystickStartY = 0;
    let aimJoystickRadius = 60;
    let autoShootInterval;
    
    aimJoystick.addEventListener('touchstart', (e) => {
        e.preventDefault();
        aimJoystickActive = true;
        const rect = aimJoystick.getBoundingClientRect();
        aimJoystickStartX = rect.left + rect.width / 2;
        aimJoystickStartY = rect.top + rect.height / 2;
        
        // Автострельба
        if (autoShoot && !autoShootInterval) {
            autoShootInterval = setInterval(() => {
                if (aimJoystickActive && (Math.abs(aimJoystickX) > 0.1 || Math.abs(aimJoystickY) > 0.1)) {
                    shoot();
                }
            }, weapons[currentWeapon].fireRate);
        }
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!aimJoystickActive) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        
        let deltaX = touch.clientX - aimJoystickStartX;
        let deltaY = touch.clientY - aimJoystickStartY;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > aimJoystickRadius) {
            deltaX = (deltaX / distance) * aimJoystickRadius;
            deltaY = (deltaY / distance) * aimJoystickRadius;
        }
        
        if (aimJoystickHandle) {
            aimJoystickHandle.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
        }
        
        aimJoystickX = deltaX / aimJoystickRadius;
        aimJoystickY = deltaY / aimJoystickRadius;
        
        if (player) {
            player.rotation = Math.atan2(aimJoystickY, aimJoystickX);
        }
    });
    
    document.addEventListener('touchend', (e) => {
        if (!aimJoystickActive) return;
        
        aimJoystickActive = false;
        aimJoystickX = 0;
        aimJoystickY = 0;
        if (aimJoystickHandle) {
            aimJoystickHandle.style.transform = 'translate(-50%, -50%)';
        }
        
        if (autoShootInterval) {
            clearInterval(autoShootInterval);
            autoShootInterval = null;
        }
    });
    
    // Кнопка смены оружия
    if (weaponSwitchButton) {
        weaponSwitchButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            switchWeapon();
        });
    }
    
    // Кнопка взаимодействия
    if (interactButton) {
        interactButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            interactWithNearestObject();
        });
    }
    
    // Кнопка паузы
    if (pauseButton) {
        pauseButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            togglePause();
        });
    }
}

// Смена оружия
function switchWeapon() {
    if (isReloading || gamePaused) return;
    
    weaponIndex = (weaponIndex + 1) % weaponOrder.length;
    currentWeapon = weaponOrder[weaponIndex];
    
    // Проверяем, есть ли оружие
    if (currentWeapon === 'shotgun' && !collectedItems.includes('shotgun')) {
        weaponIndex = (weaponIndex + 1) % weaponOrder.length;
        currentWeapon = weaponOrder[weaponIndex];
    }
    
    updateWeaponUI();
    
    // Звук смены оружия
    if (soundEnabled && weaponSwitchSound) {
        weaponSwitchSound.currentTime = 0;
        weaponSwitchSound.play().catch(e => console.log("Ошибка звука смены оружия:", e));
    }
    
    // Визуальная обратная связь
    if (weaponSwitchButton) {
        weaponSwitchButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            if (weaponSwitchButton) weaponSwitchButton.style.transform = 'scale(1)';
        }, 100);
    }
}

// Стрельба
function shoot() {
    if (isReloading || gamePaused || !player || !gameRunning) return;
    
    const weapon = weapons[currentWeapon];
    
    if (weapon.ammo <= 0 && currentWeapon !== 'pistol') {
        isReloading = true;
        playSound(reloadSound);
        setTimeout(() => {
            weapons[currentWeapon].ammo = weapons[currentWeapon].maxAmmo;
            isReloading = false;
            updateWeaponUI();
        }, 1500);
        return;
    }
    
    if (Date.now() - player.lastShot < weapon.fireRate) return;
    
    if (currentWeapon !== 'pistol') {
        weapon.ammo--;
        updateWeaponUI();
    }
    
    const angle = player.rotation;
    
    // Создание пуль
    if (currentWeapon === 'shotgun') {
        for (let i = 0; i < weapon.pellets; i++) {
            const spread = (Math.random() - 0.5) * weapon.spread;
            const pelletAngle = angle + spread;
            
            bullets.push({
                x: player.x,
                y: player.y,
                radius: weapon.bulletSize,
                color: weapon.color,
                speed: weapon.bulletSpeed,
                angle: pelletAngle,
                damage: weapon.damage,
                owner: player.id
            });
        }
    } else {
        bullets.push({
            x: player.x,
            y: player.y,
            radius: weapon.bulletSize,
            color: weapon.color,
            speed: weapon.bulletSpeed,
            angle: angle,
            damage: weapon.damage,
            owner: player.id
        });
    }
    
    player.lastShot = Date.now();
    
    // Звук выстрела
    playWeaponSound(currentWeapon);
    
    // Эффект отдачи
    createRecoilEffect();
}

function playWeaponSound(weaponType) {
    if (!soundEnabled) return;
    
    let soundElement;
    switch(weaponType) {
        case 'pistol': soundElement = pistolSound; break;
        case 'rifle': soundElement = rifleSound; break;
        case 'shotgun': soundElement = shotgunSound; break;
        default: soundElement = shootSound;
    }
    
    if (soundElement) {
        try {
            soundElement.currentTime = 0;
            soundElement.play().catch(e => console.log(`Ошибка звука оружия:`, e));
        } catch (error) {
            console.log(`Ошибка доступа к звуку:`, error);
        }
    }
}

function playSound(soundElement) {
    if (soundEnabled && soundElement) {
        soundElement.currentTime = 0;
        soundElement.play().catch(e => console.log("Ошибка воспроизведения звука:", e));
    }
}

// Обновление UI оружия
function updateWeaponUI() {
    const weapon = weapons[currentWeapon];
    if (currentWeaponSpan) {
        currentWeaponSpan.textContent = weapon.name;
    }
    if (ammoCount) {
        ammoCount.textContent = weapon.ammo === Infinity ? '∞' : weapon.ammo;
    }
    if (weaponIcon) {
        weaponIcon.textContent = weapon.icon;
    }
    
    if (isReloading && currentWeaponSpan) {
        currentWeaponSpan.textContent = weapon.name + ' (Перезарядка...)';
        if (ammoCount) ammoCount.textContent = '...';
    }
}

// Создание ботов
function createBots() {
    const location = locations[currentLocation];
    if (!location) return;
    
    const botCount = location.enemies;
    const difficultyMultiplier = location.difficultyMultiplier * getDifficultyMultiplier();
    
    for (let i = 0; i < botCount; i++) {
        createBot(difficultyMultiplier);
    }
}

function createBot(difficultyMultiplier = 1.0) {
    if (!gameCanvas) return;
    
    const names = ['Охотник', 'Страж', 'Налетчик', 'Варвар', 'Мародер'];
    const botTypes = ['pistol', 'rifle'];
    const botType = botTypes[Math.floor(Math.random() * botTypes.length)];
    
    enemies.push({
        id: 'bot_' + Date.now() + Math.random(),
        name: names[Math.floor(Math.random() * names.length)],
        type: botType,
        x: Math.random() * gameCanvas.width,
        y: Math.random() * gameCanvas.height,
        radius: 14,
        color: getRandomColor(),
        speed: (0.8 + Math.random() * 1.5) * difficultyMultiplier,
        health: 100 * difficultyMultiplier,
        maxHealth: 100 * difficultyMultiplier,
        lastShot: 0,
        fireRate: (1200 + Math.random() * 1000) / difficultyMultiplier,
        detectionRange: 200,
        attackRange: 250,
        damageMultiplier: difficultyMultiplier
    });
}

function getDifficultyMultiplier() {
    switch(difficulty) {
        case 'easy': return 0.8;
        case 'hard': return 1.5;
        default: return 1.0;
    }
}

// Стрельба ботов
function botShoot(bot) {
    if (!player || gamePaused) return;
    
    const dx = player.x - bot.x;
    const dy = player.y - bot.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > bot.attackRange) return;
    
    const angle = Math.atan2(dy, dx);
    const spread = (Math.random() - 0.5) * 0.15;
    
    enemyBullets.push({
        x: bot.x,
        y: bot.y,
        radius: 4,
        color: '#ff4444',
        speed: 7,
        angle: angle + spread,
        damage: (bot.type === 'rifle' ? 12 : 6) * bot.damageMultiplier,
        owner: bot.id
    });
    
    bot.lastShot = Date.now();
}

// Обновление игрока
function updatePlayer() {
    if (!player || !gameCanvas || gamePaused) return;
    
    let speed = player.speed;
    
    // Движение через джойстик
    if (joystickActive) {
        player.x += joystickX * speed * 1.5;
        player.y += joystickY * speed * 1.5;
    }
    
    // Поворот через прицельный джойстик
    if (aimJoystickActive) {
        player.rotation = Math.atan2(aimJoystickY, aimJoystickX);
    }
    
    // Проверка столкновений с объектами
    checkObjectCollisions();
    
    // Ограничение движения
    player.x = Math.max(player.radius, Math.min(gameCanvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(gameCanvas.height - player.radius, player.y));
    
    // Обновление UI здоровья
    if (playerHealthFill) {
        const healthPercent = (player.health / player.maxHealth) * 100;
        playerHealthFill.style.width = `${healthPercent}%`;
    }
    if (playerHealthText) {
        playerHealthText.textContent = Math.round(player.health);
    }
    
    // Эффект получения урона
    if (Date.now() - player.lastDamageTime < 200) {
        player.color = '#ff4444';
    } else {
        player.color = characterSkins[player.skin].bodyColor;
    }
    
    // Проверка смерти
    if (player.health <= 0 && gameRunning) {
        gameOver();
    }
}

// Проверка столкновений с объектами
function checkObjectCollisions() {
    if (!player) return;
    
    for (let obj of gameObjects) {
        if (!obj.solid) continue;
        
        const dx = player.x - obj.x;
        const dy = player.y - obj.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = player.radius + Math.max(obj.width, obj.height) / 2;
        
        if (distance < minDistance) {
            const angle = Math.atan2(dy, dx);
            const pushDistance = minDistance - distance;
            player.x += Math.cos(angle) * pushDistance * 0.5;
            player.y += Math.sin(angle) * pushDistance * 0.5;
        }
    }
}

// Игровая логика
function gameLoop() {
    if (!gameRunning) return;
    
    updatePlayer();
    updateBullets();
    updateEnemies();
    updateParticles();
    checkObjectInteraction();
    checkLocationTransition();
    updateUI();
    updateWeaponUI();
    
    drawBackground();
    drawObjects();
    drawEnemies();
    drawBullets();
    drawPlayer();
    drawParticles();
    
    gameLoopId = requestAnimationFrame(gameLoop);
}

// Обновление пуль
function updateBullets() {
    // Пули игрока
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        bullet.x += Math.cos(bullet.angle) * bullet.speed;
        bullet.y += Math.sin(bullet.angle) * bullet.speed;
        
        // Проверка выхода за границы
        if (!gameCanvas || bullet.x < -50 || bullet.x > gameCanvas.width + 50 || 
            bullet.y < -50 || bullet.y > gameCanvas.height + 50) {
            bullets.splice(i, 1);
            continue;
        }
        
        // Проверка попадания во врагов
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < bullet.radius + enemy.radius) {
                enemy.health -= bullet.damage;
                bullets.splice(i, 1);
                
                // Эффект попадания
                createHitEffect(bullet.x, bullet.y, bullet.color);
                playSound(hitSound);
                
                if (enemy.health <= 0) {
                    // Уничтожение врага
                    enemies.splice(j, 1);
                    kills++;
                    player.score += 100;
                    
                    // Эффект смерти
                    createDeathEffect(enemy.x, enemy.y, enemy.color);
                    playSound(killSound);
                    
                    // Создаем нового врага через некоторое время
                    setTimeout(() => {
                        if (gameRunning && enemies.length < locations[currentLocation].enemies * 2) {
                            createBot(locations[currentLocation].difficultyMultiplier);
                        }
                    }, 2000);
                }
                break;
            }
        }
    }
    
    // Пули врагов
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const bullet = enemyBullets[i];
        
        bullet.x += Math.cos(bullet.angle) * bullet.speed;
        bullet.y += Math.sin(bullet.angle) * bullet.speed;
        
        // Проверка выхода за границы
        if (!gameCanvas || bullet.x < -50 || bullet.x > gameCanvas.width + 50 || 
            bullet.y < -50 || bullet.y > gameCanvas.height + 50) {
            enemyBullets.splice(i, 1);
            continue;
        }
        
        // Проверка попадания в игрока
        const dx = bullet.x - player.x;
        const dy = bullet.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < bullet.radius + player.radius) {
            player.health -= bullet.damage;
            player.lastDamageTime = Date.now();
            enemyBullets.splice(i, 1);
            
            // Эффект получения урона
            createDamageEffect();
            playSound(hitSound);
        }
    }
}

// Обновление врагов
function updateEnemies() {
    if (!player || gamePaused) return;
    
    enemies.forEach(enemy => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < enemy.detectionRange) {
            // Движение к игроку
            if (distance > 80) {
                enemy.x += (dx / distance) * enemy.speed;
                enemy.y += (dy / distance) * enemy.speed;
            }
            
            // Стрельба
            if (distance < enemy.attackRange && Date.now() - enemy.lastShot > enemy.fireRate) {
                botShoot(enemy);
            }
        } else {
            // Случайное блуждание
            if (Math.random() < 0.02) {
                enemy.randomAngle = Math.random() * Math.PI * 2;
            }
            
            if (enemy.randomAngle !== undefined) {
                enemy.x += Math.cos(enemy.randomAngle) * enemy.speed * 0.3;
                enemy.y += Math.sin(enemy.randomAngle) * enemy.speed * 0.3;
                
                if (gameCanvas) {
                    enemy.x = Math.max(enemy.radius, Math.min(gameCanvas.width - enemy.radius, enemy.x));
                    enemy.y = Math.max(enemy.radius, Math.min(gameCanvas.height - enemy.radius, enemy.y));
                }
            }
        }
        
        // Проверка столкновения с игроком
        const collisionDist = Math.sqrt(
            Math.pow(player.x - enemy.x, 2) + 
            Math.pow(player.y - enemy.y, 2)
        );
        
        if (collisionDist < player.radius + enemy.radius) {
            player.health -= 0.5 * enemy.damageMultiplier;
            player.lastDamageTime = Date.now();
        }
    });
}

// Обновление частиц
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        
        p.vx *= 0.95;
        p.vy *= 0.95;
        
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Проверка взаимодействия с объектами
function checkObjectInteraction() {
    if (!player || activeDialog || gamePaused) return;
    
    let nearestObject = null;
    let minDistance = Infinity;
    
    for (let obj of gameObjects) {
        if (!obj.interactable) continue;
        
        const dx = player.x - obj.x;
        const dy = player.y - obj.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRange = Math.max(obj.width, obj.height) + player.radius + 30;
        
        if (distance < interactionRange && distance < minDistance) {
            minDistance = distance;
            nearestObject = obj;
        }
    }
    
    // Показываем подсказку
    if (nearestObject && minDistance < 100) {
        showInteractionHint(nearestObject);
    } else {
        hideInteractionHint();
    }
}

function interactWithNearestObject() {
    if (!player || activeDialog || gamePaused) return;
    
    let nearestObject = null;
    let minDistance = Infinity;
    
    for (let obj of gameObjects) {
        if (!obj.interactable) continue;
        
        const dx = player.x - obj.x;
        const dy = player.y - obj.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const interactionRange = Math.max(obj.width, obj.height) + player.radius + 30;
        
        if (distance < interactionRange && distance < minDistance) {
            minDistance = distance;
            nearestObject = obj;
        }
    }
    
    if (nearestObject) {
        interactWithObject(nearestObject);
    }
}

function interactWithObject(obj) {
    switch(obj.type) {
        case 'chest':
            if (!obj.opened) {
                openChest(obj);
            }
            break;
        case 'vendor':
        case 'oasis':
            if (obj.dialog) {
                startDialog(obj.dialog);
            }
            break;
    }
}

function openChest(chest) {
    if (chest.opened) return;
    
    chest.opened = true;
    playSound(itemPickupSound);
    
    // Награда из сундука
    switch(chest.contains) {
        case 'ammo':
            weapons[currentWeapon].ammo = weapons[currentWeapon].maxAmmo;
            showMessage("Найдены патроны!", '#4cc9f0');
            break;
        case 'health':
            player.health = Math.min(player.maxHealth, player.health + 50);
            showMessage("Найдена аптечка! +50 HP", '#4CAF50');
            createHealEffect();
            playSound(healSound);
            break;
        case 'key':
            player.keys++;
            showMessage("Найден ключ!", '#FFD700');
            updateKeysUI();
            break;
        case 'weapon':
            if (!collectedItems.includes('shotgun')) {
                collectedItems.push('shotgun');
                showMessage("Найден дробовик!", '#f72585');
            }
            break;
    }
    
    updateWeaponUI();
}

// Диалоговая система
function startDialog(dialogId) {
    const dialog = dialogs[dialogId];
    if (!dialog) return;
    
    activeDialog = dialog;
    
    const dialogElement = document.createElement('div');
    dialogElement.className = 'dialog-window';
    dialogElement.innerHTML = `
        <div class="dialog-header">
            <span class="dialog-portrait">${dialog.portrait}</span>
            <span class="dialog-name">${dialog.name}</span>
        </div>
        <div class="dialog-content">
            <p>${dialog.lines[0]}</p>
        </div>
        <div class="dialog-options">
            ${dialog.options.map((opt, i) => 
                `<button class="dialog-option" data-action="${opt.action}">${opt.text}</button>`
            ).join('')}
        </div>
    `;
    
    if (animationContainer) {
        animationContainer.appendChild(dialogElement);
    }
    
    // Обработчики для кнопок
    setTimeout(() => {
        document.querySelectorAll('.dialog-option').forEach(button => {
            button.addEventListener('click', handleDialogChoice);
        });
    }, 100);
}

function handleDialogChoice(e) {
    const action = e.target.dataset.action;
    const dialog = activeDialog;
    
    switch(action) {
        case 'showShop':
            showShop();
            break;
        case 'askLocation':
            showMessage("Эта местность опасна. Будь осторожен!", '#ffaa00');
            break;
        case 'openChest':
            if (player.keys > 0) {
                player.keys--;
                showMessage("Сундук открыт ключом!", '#FFD700');
                updateKeysUI();
            } else {
                showMessage("Нужен ключ для открытия!", '#ff4444');
            }
            break;
        case 'drinkWater':
            player.health = Math.min(player.maxHealth, player.health + 30);
            showMessage("Выпито воды! +30 HP", '#4361ee');
            createHealEffect();
            playSound(healSound);
            break;
        case 'rest':
            player.health = Math.min(player.maxHealth, player.health + 10);
            showMessage("Отдых восстановил силы! +10 HP", '#4CAF50');
            createHealEffect();
            playSound(healSound);
            break;
        case 'exit':
            // Выход из диалога
            break;
    }
    
    closeDialog();
}

function closeDialog() {
    activeDialog = null;
    const dialog = document.querySelector('.dialog-window');
    if (dialog) dialog.remove();
}

// Магазин
function showShop() {
    closeDialog();
    
    const shopElement = document.createElement('div');
    shopElement.className = 'shop-window';
    shopElement.innerHTML = `
        <div class="shop-header">
            <h3>🛒 Магазин торговца</h3>
        </div>
        <div class="shop-items">
            <div class="shop-item" data-item="health">
                <span class="item-icon">❤️</span>
                <span class="item-name">Аптечка</span>
                <span class="item-price">100 очков</span>
            </div>
            <div class="shop-item" data-item="ammo">
                <span class="item-icon">🔫</span>
                <span class="item-name">Патроны</span>
                <span class="item-price">50 очков</span>
            </div>
            <div class="shop-item" data-item="key">
                <span class="item-icon">🔑</span>
                <span class="item-name">Ключ</span>
                <span class="item-price">200 очков</span>
            </div>
        </div>
        <button class="shop-close">Закрыть</button>
    `;
    
    if (animationContainer) {
        animationContainer.appendChild(shopElement);
    }
    
    setTimeout(() => {
        document.querySelectorAll('.shop-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const itemType = e.currentTarget.dataset.item;
                handleShopPurchase(itemType);
            });
        });
        document.querySelector('.shop-close').addEventListener('click', () => {
            shopElement.remove();
        });
    }, 100);
}

function handleShopPurchase(itemType) {
    switch(itemType) {
        case 'health':
            if (player.score >= 100) {
                player.score -= 100;
                player.health = Math.min(player.maxHealth, player.health + 50);
                showMessage("Куплена аптечка! +50 HP", '#4CAF50');
                createHealEffect();
                playSound(healSound);
            } else {
                showMessage("Недостаточно очков!", '#ff4444');
            }
            break;
        case 'ammo':
            if (player.score >= 50) {
                player.score -= 50;
                weapons[currentWeapon].ammo = weapons[currentWeapon].maxAmmo;
                showMessage("Куплены патроны!", '#4cc9f0');
                playSound(itemPickupSound);
            } else {
                showMessage("Недостаточно очков!", '#ff4444');
            }
            break;
        case 'key':
            if (player.score >= 200) {
                player.score -= 200;
                player.keys++;
                showMessage("Куплен ключ!", '#FFD700');
                updateKeysUI();
                playSound(itemPickupSound);
            } else {
                showMessage("Недостаточно очков!", '#ff4444');
            }
            break;
    }
}

// Проверка перехода между локациями
function checkLocationTransition() {
    const location = locations[currentLocation];
    
    if (enemies.length === 0 && !locationTransition && gameRunning) {
        locationTransition = true;
        locationTimer = 180; // 3 секунды
        
        showMessage(`Все враги побеждены! Переход в ${locations[location.nextLocation].name} через 3...`, '#4cc9f0');
        locationsCleared++;
    }
    
    if (locationTransition) {
        locationTimer--;
        
        if (locationTimer <= 0) {
            loadLocation(location.nextLocation);
            locationTransition = false;
            
            // Награда за очистку локации
            player.health = Math.min(player.maxHealth, player.health + 20);
            player.score += 500;
            showMessage("Локация очищена! +20 HP, +500 очков", '#4CAF50');
            createHealEffect();
            playSound(levelUpSound);
        }
    }
}

// Обновление UI
function updateUI() {
    if (!playersList || !player) return;
    
    // Список игроков
    playersList.innerHTML = `
        <div class="player-item">
            <div class="player-color" style="background-color: ${player.color}"></div>
            <span>Вы (${Math.round(player.health)} HP)</span>
        </div>
    `;
    
    enemies.forEach(enemy => {
        playersList.innerHTML += `
            <div class="player-item">
                <div class="player-color" style="background-color: ${enemy.color}"></div>
                <span>${enemy.name} (${Math.round(enemy.health)} HP)</span>
            </div>
        `;
    });
    
    // Счетчик врагов
    if (enemiesCount) enemiesCount.textContent = enemies.length;
    if (totalEnemies) {
        const location = locations[currentLocation];
        totalEnemies.textContent = location ? location.enemies : 0;
    }
}

// Обновление UI локации
function updateLocationUI() {
    const location = locations[currentLocation];
    if (!location) return;
    
    if (currentLocationName) {
        currentLocationName.textContent = location.name;
    }
    
    if (locationUI) {
        locationUI.innerHTML = `📍 ${location.name} | Врагов: ${enemies.length}/${location.enemies}`;
    }
}

// Обновление UI ключей
function updateKeysUI() {
    if (keysCount) {
        keysCount.textContent = playerKeys;
    }
    if (keysInfo) {
        keysInfo.style.display = playerKeys > 0 ? 'block' : 'none';
    }
}

// Подсказка взаимодействия
function showInteractionHint(obj) {
    let hint = document.querySelector('.interaction-hint');
    if (!hint) {
        hint = document.createElement('div');
        hint.className = 'interaction-hint';
        if (animationContainer) animationContainer.appendChild(hint);
    }
    
    hint.textContent = getInteractionText(obj);
    hint.style.left = `${obj.x}px`;
    hint.style.top = `${obj.y - 60}px`;
}

function hideInteractionHint() {
    const hint = document.querySelector('.interaction-hint');
    if (hint) hint.remove();
}

function getInteractionText(obj) {
    switch(obj.type) {
        case 'chest': return obj.opened ? 'Пустой' : 'Нажмите чтобы открыть';
        case 'vendor': return 'Поговорить';
        case 'oasis': return 'Выпить воды';
        default: return 'Взаимодействовать';
    }
}

// Эффект перехода локации
function showLocationTransition(locationName) {
    const transition = document.createElement('div');
    transition.className = 'location-transition';
    transition.innerHTML = `
        <div class="location-transition-text">
            📍 ${locationName}
        </div>
        <div class="location-transition-progress">
            <div class="location-transition-fill" id="transitionFill"></div>
        </div>
    `;
    
    if (animationContainer) {
        animationContainer.appendChild(transition);
        
        // Анимация прогресса
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            const fill = document.getElementById('transitionFill');
            if (fill) fill.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    transition.remove();
                }, 500);
            }
        }, 20);
    }
}

// Создание эффектов
function createHitEffect(x, y, color) {
    for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        particles.push({
            x: x,
            y: y,
            radius: 2 + Math.random() * 3,
            color: color,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 20 + Math.random() * 20
        });
    }
}

function createDeathEffect(x, y, color) {
    for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 4;
        particles.push({
            x: x,
            y: y,
            radius: 3 + Math.random() * 4,
            color: color,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 30 + Math.random() * 30
        });
    }
}

function createDamageEffect() {
    const effect = document.createElement('div');
    effect.className = 'damage-effect';
    if (animationContainer) {
        animationContainer.appendChild(effect);
        setTimeout(() => effect.remove(), 300);
    }
}

function createHealEffect() {
    const effect = document.createElement('div');
    effect.className = 'heal-effect';
    if (animationContainer) {
        animationContainer.appendChild(effect);
        setTimeout(() => effect.remove(), 500);
    }
}

function createRecoilEffect() {
    // Небольшое отталкивание при стрельбе
    if (player) {
        player.x -= Math.cos(player.rotation) * 2;
        player.y -= Math.sin(player.rotation) * 2;
    }
}

// Отрисовка
function drawBackground() {
    if (!ctx || !gameCanvas) return;
    
    // Градиентный фон
    const gradient = ctx.createLinearGradient(0, 0, gameCanvas.width, gameCanvas.height);
    const location = locations[currentLocation];
    const color = location ? location.colorScheme : '#0d1b2a';
    
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, darkenColor(color, 0.3));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function darkenColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - amount));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - amount));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - amount));
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function drawObjects() {
    if (!ctx) return;
    
    gameObjects.forEach(obj => {
        ctx.save();
        ctx.translate(obj.x, obj.y);
        
        switch(obj.type) {
            case 'tree':
                // Ствол
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(-obj.width/4, -obj.height/2, obj.width/2, obj.height);
                
                // Крона
                ctx.fillStyle = obj.color;
                ctx.beginPath();
                ctx.arc(0, -obj.height/2, obj.width, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'chest':
                // Основа
                ctx.fillStyle = obj.color;
                ctx.fillRect(-obj.width/2, -obj.height/2, obj.width, obj.height);
                
                // Крышка
                ctx.fillStyle = obj.opened ? '#654321' : '#A0522D';
                ctx.fillRect(-obj.width/2, -obj.height/2, obj.width, obj.height/3);
                
                // Замок
                if (!obj.opened) {
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(0, -obj.height/3, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
                
            case 'vendor':
                // Тело
                ctx.fillStyle = obj.color;
                ctx.fillRect(-obj.width/2, -obj.height/2, obj.width, obj.height);
                
                // Голова
                ctx.fillStyle = '#f0f0f0';
                ctx.beginPath();
                ctx.arc(0, -obj.height/2 - 5, 12, 0, Math.PI * 2);
                ctx.fill();
                
                // Лицо
                ctx.fillStyle = '#333';
                ctx.fillRect(-3, -obj.height/2 - 8, 2, 2); // Левый глаз
                ctx.fillRect(1, -obj.height/2 - 8, 2, 2); // Правый глаз
                ctx.fillRect(-2, -obj.height/2 - 4, 4, 1); // Рот
                break;
                
            case 'oasis':
                // Вода
                ctx.fillStyle = obj.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, obj.width/2, obj.height/2, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Волны
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                for(let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(0, 0, obj.width/2 - i*6, 0, Math.PI * 1.5);
                    ctx.stroke();
                }
                break;
                
            case 'building':
                // Здание
                ctx.fillStyle = obj.color;
                ctx.fillRect(-obj.width/2, -obj.height/2, obj.width, obj.height);
                
                // Крыша
                ctx.fillStyle = '#333';
                ctx.beginPath();
                ctx.moveTo(-obj.width/2, -obj.height/2);
                ctx.lineTo(0, -obj.height/2 - 20);
                ctx.lineTo(obj.width/2, -obj.height/2);
                ctx.closePath();
                ctx.fill();
                
                // Окна
                ctx.fillStyle = '#4cc9f0';
                for(let i = -2; i <= 2; i += 2) {
                    for(let j = 0; j < 4; j++) {
                        ctx.fillRect(
                            i * 15 - 5,
                            j * 25 - obj.height/2 + 30,
                            8, 12
                        );
                    }
                }
                break;
        }
        
        ctx.restore();
    });
}

function drawPlayer() {
    if (!ctx || !player) return;
    
    const skin = characterSkins[player.skin];
    
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.rotation);
    
    // Тело
    ctx.beginPath();
    ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = skin.bodyColor;
    ctx.fill();
    
    // Контур
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Голова
    ctx.beginPath();
    ctx.arc(0, -player.radius * 0.3, player.radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = skin.headColor;
    ctx.fill();
    
    // Особенности скина
    if (skin.helmet) {
        ctx.strokeStyle = '#264653';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, -player.radius * 0.3, player.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    if (skin.mask) {
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(-4, -player.radius * 0.1, 8, 5);
    }
    
    if (skin.metallic) {
        // Металлический блеск
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, player.radius);
        gradient.addColorStop(0, 'rgba(255,255,255,0.6)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    // Оружие
    ctx.beginPath();
    ctx.moveTo(skin.weaponOffset, 0);
    ctx.lineTo(player.radius + 10, 0);
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    ctx.restore();
    
    // Полоска здоровья
    const healthWidth = (player.health / player.maxHealth) * (player.radius * 2);
    ctx.fillStyle = player.health > 50 ? '#4CAF50' : player.health > 25 ? '#FF9800' : '#F44336';
    ctx.fillRect(player.x - player.radius, player.y - player.radius - 15, healthWidth, 5);
    
    // Индикатор ключей
    if (player.keys > 0) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`🔑 ${player.keys}`, player.x, player.y + player.radius + 25);
    }
}

function drawEnemies() {
    if (!ctx) return;
    
    enemies.forEach(enemy => {
        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        
        // Тело
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = enemy.color;
        ctx.fill();
        
        // Контур
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Глаза
        const angleToPlayer = player ? Math.atan2(player.y - enemy.y, player.x - enemy.x) : 0;
        const eyeX = Math.cos(angleToPlayer) * 8;
        const eyeY = Math.sin(angleToPlayer) * 8;
        
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        
        ctx.restore();
        
        // Полоска здоровья
        const healthWidth = (enemy.health / enemy.maxHealth) * (enemy.radius * 2);
        ctx.fillStyle = enemy.health > 50 ? '#4CAF50' : enemy.health > 25 ? '#FF9800' : '#F44336';
        ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 10, healthWidth, 4);
    });
}

function drawBullets() {
    if (!ctx) return;
    
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
        
        // След от пули
        ctx.beginPath();
        ctx.moveTo(bullet.x - Math.cos(bullet.angle) * 10, bullet.y - Math.sin(bullet.angle) * 10);
        ctx.lineTo(bullet.x, bullet.y);
        ctx.strokeStyle = bullet.color;
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    enemyBullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
    });
}

function drawParticles() {
    if (!ctx) return;
    
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 50;
        ctx.fill();
        ctx.globalAlpha = 1.0;
    });
}

// Вспомогательные функции
function getRandomColor() {
    const colors = ['#ff4444', '#ff8800', '#ffaa00', '#ff7700', '#ff5500'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function showMessage(text, color = '#4cc9f0') {
    if (!textMessages) return;
    
    const message = document.createElement('div');
    message.className = 'message';
    message.textContent = text;
    message.style.borderColor = color;
    message.style.color = color;
    
    textMessages.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 3000);
}

function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    
    if (pauseMenu) {
        pauseMenu.style.display = gamePaused ? 'block' : 'none';
    }
    
    if (gamePaused) {
        if (backgroundMusic) backgroundMusic.pause();
    } else {
        if (backgroundMusic && musicEnabled) backgroundMusic.play();
    }
}

function gameOver() {
    gameRunning = false;
    const survivalTime = Math.floor((Date.now() - startTime) / 1000);
    
    if (survivalTimeSpan) survivalTimeSpan.textContent = survivalTime;
    if (killsCountSpan) killsCountSpan.textContent = kills;
    if (locationsClearedSpan) locationsClearedSpan.textContent = locationsCleared;
    if (keysCollectedSpan) keysCollectedSpan.textContent = playerKeys;
    
    playSound(deathSound);
    
    if (deathScreen) {
        deathScreen.style.display = 'block';
    }
}

// Управление звуком
function toggleSound() {
    soundEnabled = !soundEnabled;
    if (soundToggle) {
        soundToggle.textContent = soundEnabled ? '🔊 Вкл звук' : '🔇 Выкл звук';
    }
    saveGameSettings();
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    if (musicToggle) {
        musicToggle.textContent = musicEnabled ? '🎵 Вкл музыку' : '🎵 Выкл музыку';
    }
    
    if (backgroundMusic) {
        if (musicEnabled) {
            backgroundMusic.play().catch(e => console.log("Ошибка музыки:", e));
        } else {
            backgroundMusic.pause();
        }
    }
    saveGameSettings();
}

// Обработчики событий
window.addEventListener('load', () => {
    initDOMElements();
    detectDevice();
    
    // Старт игры
    if (startButton) {
        startButton.addEventListener('click', startGame);
    }
    
    // Рестарт
    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    }
    
    // Звук
    if (soundToggle) {
        soundToggle.addEventListener('click', toggleSound);
    }
    
    // Музыка
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    // Настройки
    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            startScreen.style.display = 'none';
            settingsScreen.style.display = 'flex';
        });
    }
    
    // Возврат из настроек
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            settingsScreen.style.display = 'none';
            startScreen.style.display = 'flex';
        });
    }
    
    // Сохранение настроек
    const saveSettingsButton = document.getElementById('saveSettings');
    if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', () => {
            // Получаем настройки из формы
            const joystickSensitivity = document.getElementById('joystickSensitivity');
            const autoShootToggle = document.getElementById('autoShootToggle');
            const particleQuality = document.getElementById('particleQuality');
            const effectsToggle = document.getElementById('effectsToggle');
            const enemyDifficulty = document.getElementById('enemyDifficulty');
            const hintsToggle = document.getElementById('hintsToggle');
            
            if (joystickSensitivity) {
                // Применяем чувствительность джойстика
                console.log('Чувствительность:', joystickSensitivity.value);
            }
            
            if (autoShootToggle) {
                autoShoot = autoShootToggle.checked;
            }
            
            if (enemyDifficulty) {
                difficulty = enemyDifficulty.value;
            }
            
            saveGameSettings();
            showMessage("Настройки сохранены!", '#4cc9f0');
            
            settingsScreen.style.display = 'none';
            startScreen.style.display = 'flex';
        });
    }
    
    // Управление паузой
    if (resumeButton) {
        resumeButton.addEventListener('click', togglePause);
    }
    
    if (mainMenuButton) {
        mainMenuButton.addEventListener('click', () => {
            gameRunning = false;
            gamePaused = false;
            if (pauseMenu) pauseMenu.style.display = 'none';
            if (deathScreen) deathScreen.style.display = 'none';
            gameScreen.style.display = 'none';
            startScreen.style.display = 'flex';
        });
    }
    
    if (deathMenuButton) {
        deathMenuButton.addEventListener('click', () => {
            deathScreen.style.display = 'none';
            gameScreen.style.display = 'none';
            startScreen.style.display = 'flex';
        });
    }
});

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    if (gameCanvas) {
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
        
        if (player) {
            player.x = Math.min(player.x, gameCanvas.width - player.radius);
            player.y = Math.min(player.y, gameCanvas.height - player.radius);
            player.x = Math.max(player.x, player.radius);
            player.y = Math.max(player.y, player.radius);
        }
    }
});

// Предотвращаем стандартное поведение
document.addEventListener('touchmove', function(e) {
    if (e.target === gameCanvas || 
        e.target.classList.contains('action-button') || 
        e.target === movementJoystick || 
        e.target === aimJoystick) {
        e.preventDefault();
    }
}, { passive: false });

// Обработка клавиатуры для десктопа
document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;
    
    switch(e.key.toLowerCase()) {
        case 'w': case 'arrowup':
            joystickY = -1;
            break;
        case 's': case 'arrowdown':
            joystickY = 1;
            break;
        case 'a': case 'arrowleft':
            joystickX = -1;
            break;
        case 'd': case 'arrowright':
            joystickX = 1;
            break;
        case ' ': case 'enter':
            shoot();
            break;
        case 'q':
            switchWeapon();
            break;
        case 'e':
            interactWithNearestObject();
            break;
        case 'p': case 'escape':
            togglePause();
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w': case 'arrowup':
        case 's': case 'arrowdown':
            joystickY = 0;
            break;
        case 'a': case 'arrowleft':
        case 'd': case 'arrowright':
            joystickX = 0;
            break;
    }
});

// Обработка мыши для прицеливания
document.addEventListener('mousemove', (e) => {
    if (!player || !gameCanvas || !gameRunning || gamePaused) return;
    
    const rect = gameCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    aimJoystickX = (mouseX - player.x) / 100;
    aimJoystickY = (mouseY - player.y) / 100;
    
    const length = Math.sqrt(aimJoystickX * aimJoystickX + aimJoystickY * aimJoystickY);
    if (length > 1) {
        aimJoystickX /= length;
        aimJoystickY /= length;
    }
    
    player.rotation = Math.atan2(aimJoystickY, aimJoystickX);
});

document.addEventListener('mousedown', (e) => {
    if (!gameRunning || gamePaused) return;
    
    if (e.button === 0) { // Левая кнопка мыши
        shoot();
    }
});

// Контекстное меню
document.addEventListener('contextmenu', (e) => {
    if (e.target === gameCanvas) {
        e.preventDefault();
    }
});