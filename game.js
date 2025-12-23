// Эмуляция сервера с комнатами
const serverRooms = {
    moscow: {
        name: 'Москва',
        players: [],
        maxPlayers: 20
    },
    petersburg: {
        name: 'Санкт-Петербург',
        players: [],
        maxPlayers: 20
    }
};

// Система оружия
const weapons = {
    pistol: {
        name: "Пистолет",
        damage: 10,
        fireRate: 300,
        ammo: Infinity,
        bulletSpeed: 12,
        bulletSize: 5,
        color: "#4cc9f0"
    },
    rifle: {
        name: "Винтовка",
        damage: 25,
        fireRate: 500,
        ammo: 30,
        maxAmmo: 30,
        bulletSpeed: 15,
        bulletSize: 6,
        color: "#4361ee"
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
        color: "#f72585"
    }
};

// МЕДИА-КОНФИГУРАЦИЯ (Здесь вы можете вставлять свои файлы)
const mediaConfig = {
    // Фоновые изображения для разных городов
    backgrounds: {
        moscow: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        petersburg: 'https://images.unsplash.com/photo-1558661093-53d5f71c8d7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80'
    },
    
    // Звуковые эффекты (укажите пути к вашим файлам)
    sounds: {
        backgroundMusic: 'audio/background.mp3',
        shoot: 'audio/shoot.mp3',
        reload: 'audio/reload.mp3',
        hit: 'audio/hit.mp3',
        death: 'audio/death.mp3',
        kill: 'audio/kill.mp3',
        levelUp: 'audio/level-up.mp3'
    },
    
    // Анимационные спрайты (опционально)
    animations: {
        blood: 'animations/blood.png',
        explosion: 'animations/explosion.png',
        muzzleFlash: 'animations/muzzle-flash.png'
    },
    
    // Текстовые сообщения для событий
    messages: {
       
        newWave: "Новая волна врагов!",
        bossComing: "⚠️ Приближается босс! ⚠️",
        levelComplete: "Уровень пройден!",
        powerUp: "Вы нашли улучшение!",
        warning: "Будьте осторожны!"
    }
};

// Глобальные переменные
let currentCity = null;
let player = null;
let bullets = [];
let enemyBullets = [];
let enemies = [];
let particles = [];
let gameRunning = false;
let startTime = 0;
let kills = 0;
let playerId = null;
let keys = {};
let mouseX = 0;
let mouseY = 0;
let currentWeapon = 'pistol';
let isReloading = false;
let gameLoopId = null;
let miniMapLoopId = null;
let isMobile = false;
let soundEnabled = true;
let musicEnabled = true;
let joystickActive = false;
let joystickX = 0;
let joystickY = 0;


// DOM элементы
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const startButton = document.getElementById('startButton');
const cityCards = document.querySelectorAll('.city-card');
const currentCitySpan = document.getElementById('currentCity');
const playerHealthFill = document.getElementById('playerHealth');
const playersList = document.getElementById('playersList');
const deathScreen = document.getElementById('deathScreen');
const survivalTimeSpan = document.getElementById('survivalTime');
const killsCountSpan = document.getElementById('killsCount');
const restartButton = document.getElementById('restartButton');
const moscowCount = document.getElementById('moscow-count');
const petersburgCount = document.getElementById('petersburg-count');
const ammoCount = document.getElementById('ammoCount');
const currentWeaponSpan = document.getElementById('currentWeapon');
const gameCanvas = document.getElementById('gameCanvas');
const miniMapCanvas = document.getElementById('miniMapCanvas');
const ctx = gameCanvas.getContext('2d');
const miniMapCtx = miniMapCanvas.getContext('2d');
const backgroundOverlay = document.getElementById('backgroundOverlay');
const animationContainer = document.getElementById('animationContainer');
const textMessages = document.getElementById('textMessages');
const mobileControls = document.getElementById('mobileControls');
const soundToggle = document.getElementById('soundToggle');
const musicToggle = document.getElementById('musicToggle');

// Аудио элементы
const backgroundMusic = document.getElementById('backgroundMusic');
const shootSound = document.getElementById('shootSound');
const reloadSound = document.getElementById('reloadSound');
const hitSound = document.getElementById('hitSound');
const deathSound = document.getElementById('deathSound');
const killSound = document.getElementById('killSound');
const levelUpSound = document.getElementById('levelUpSound');

// Мобильные элементы управления
const movementJoystick = document.getElementById('movementJoystick');
const joystickHandle = movementJoystick.querySelector('.joystick-handle');
const shootButton = document.getElementById('shootButton');
const reloadButton = document.getElementById('reloadButton');
const sprintButton = document.getElementById('sprintButton');
const weaponButtons = document.querySelectorAll('.weapon-button');

// Определение устройства
function detectDevice() {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log(`Определено устройство: ${isMobile ? 'Мобильное' : 'Десктоп'}`);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        mobileControls.classList.add('active');
    } else {
        mobileControls.classList.remove('active');
    }
}

// Инициализация звуков
function initSounds() {
    // Устанавливаем пути к звукам из конфигурации
    if (mediaConfig.sounds.backgroundMusic) {
        backgroundMusic.src = mediaConfig.sounds.backgroundMusic;
    }
    if (mediaConfig.sounds.shoot) {
        shootSound.src = mediaConfig.sounds.shoot;
    }
    if (mediaConfig.sounds.reload) {
        reloadSound.src = mediaConfig.sounds.reload;
    }
    if (mediaConfig.sounds.hit) {
        hitSound.src = mediaConfig.sounds.hit;
    }
    if (mediaConfig.sounds.death) {
        deathSound.src = mediaConfig.sounds.death;
    }
    if (mediaConfig.sounds.kill) {
        killSound.src = mediaConfig.sounds.kill;
    }
    if (mediaConfig.sounds.levelUp) {
        levelUpSound.src = mediaConfig.sounds.levelUp;
    }
    
    // Настройка громкости
    backgroundMusic.volume = 0.3;
    shootSound.volume = 0.5;
    reloadSound.volume = 0.3;
    hitSound.volume = 0.4;
    deathSound.volume = 0.6;
    killSound.volume = 0.5;
    levelUpSound.volume = 0.5;
}

// Воспроизведение звука с проверкой
function playSound(soundElement) {
    if (soundEnabled && soundElement) {
        soundElement.currentTime = 0;
        soundElement.play().catch(e => console.log("Ошибка воспроизведения звука:", e));
    }
}

// Включение/выключение звука
function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊 Вкл звук' : '🔇 Выкл звук';
}

// Включение/выключение музыки
function toggleMusic() {
    musicEnabled = !musicEnabled;
    musicToggle.textContent = musicEnabled ? '🎵 Вкл музыку' : '🎵 Выкл музыку';
    
    if (musicEnabled) {
        backgroundMusic.play().catch(e => console.log("Ошибка воспроизведения музыки:", e));
    } else {
        backgroundMusic.pause();
    }
}

// Установка фонового изображения
function setBackground(city) {
    if (mediaConfig.backgrounds[city]) {
        backgroundOverlay.style.backgroundImage = `url('${mediaConfig.backgrounds[city]}')`;
    } else {
        backgroundOverlay.style.backgroundImage = '';
    }
}

// Создание анимации
function createAnimation(x, y, type, size = 50) {
    const anim = document.createElement('div');
    anim.className = `animation ${type}`;
    anim.style.left = `${x - size/2}px`;
    anim.style.top = `${y - size/2}px`;
    anim.style.width = `${size}px`;
    anim.style.height = `${size}px`;
    
    animationContainer.appendChild(anim);
    
    // Удаление анимации после завершения
    setTimeout(() => {
        if (anim.parentNode) {
            anim.remove();
        }
    }, 1000);
}

// Показ текстового сообщения
function showMessage(text, type = 'normal') {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    textMessages.appendChild(message);
    
    // Удаление сообщения через 3 секунды
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 3000);
}

// Обновление счетчиков игроков
function updatePlayerCounts() {
    moscowCount.textContent = serverRooms.moscow.players.length;
    petersburgCount.textContent = serverRooms.petersburg.players.length;
}

// Выбор города
cityCards.forEach(card => {
    card.addEventListener('click', () => {
        cityCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        currentCity = card.dataset.city;
        startButton.disabled = false;
    });
});

// Начало игры
startButton.addEventListener('click', startGame);

// Перезапуск игры
restartButton.addEventListener('click', restartGame);

// Управление звуком и музыкой
soundToggle.addEventListener('click', toggleSound);
musicToggle.addEventListener('click', toggleMusic);

function startGame() {
    if (!currentCity) return;
    
    playerId = 'player_' + Date.now() + Math.random();
    
    serverRooms[currentCity].players.push({
        id: playerId,
        name: `Игрок_${Math.floor(Math.random() * 1000)}`,
        health: 100
    });
    
    updatePlayerCounts();
    
    // Устанавливаем фон
    setBackground(currentCity);
    
  
    
    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    currentCitySpan.textContent = serverRooms[currentCity].name;
    
    initGame();
    
    // Запускаем игровые циклы
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    if (miniMapLoopId) cancelAnimationFrame(miniMapLoopId);
    
    gameLoopId = requestAnimationFrame(gameLoop);
    miniMapLoopId = requestAnimationFrame(miniMapLoop);
    
    // Запускаем музыку
    if (musicEnabled) {
        backgroundMusic.play().catch(e => console.log("Автовоспроизведение заблокировано, пользователь должен запустить игру"));
    }
}

function restartGame() {
    deathScreen.style.display = 'none';
    
    // Очищаем игровое состояние
    bullets = [];
    enemyBullets = [];
    enemies = [];
    particles = [];
    
    // Очищаем анимации и сообщения
    animationContainer.innerHTML = '';
    textMessages.innerHTML = '';
    
    // Восстанавливаем здоровье игрока
    player.health = 100;
    player.lastDamageTime = 0;
    player.color = '#4cc9f0';
    
    // Восстанавливаем патроны
    weapons.rifle.ammo = weapons.rifle.maxAmmo;
    weapons.shotgun.ammo = weapons.shotgun.maxAmmo;
    currentWeapon = 'pistol';
    isReloading = false;
    
    // Сбрасываем статистику
    kills = 0;
    startTime = Date.now();
    
    // Перемещаем игрока в центр
    player.x = gameCanvas.width / 2;
    player.y = gameCanvas.height / 2;
    
    // Создаем новых ботов
    createBots();
    
    // Обновляем UI
    updateWeaponUI();
    updateWeaponButtons();
    
    // Показываем сообщение о перезапуске
    showMessage("Игра перезапущена!");
    
    // Запускаем игру
    gameRunning = true;
    
    // Запускаем игровые циклы
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    if (miniMapLoopId) cancelAnimationFrame(miniMapLoopId);
    
    gameLoopId = requestAnimationFrame(gameLoop);
    miniMapLoopId = requestAnimationFrame(miniMapLoop);
}

// Инициализация игры
function initGame() {
    // Создаем игрока
    player = {
        id: playerId,
        x: gameCanvas.width / 2,
        y: gameCanvas.height / 2,
        radius: 20,
        color: '#4cc9f0',
        speed: 5,
        health: 100,
        maxHealth: 100,
        lastShot: 0,
        lastDamageTime: 0,
        isSprinting: false,
        sprintMultiplier: 1.5,
        rotation: 0
    };
    
    // Создаем ботов
    createBots();
    
    startTime = Date.now();
    gameRunning = true;
    
    // Инициализируем звуки
    initSounds();
    
    // Настройка управления в зависимости от устройства
    if (isMobile) {
        setupMobileControls();
    } else {
        setupDesktopControls();
    }
    
    // Обновление UI оружия
    updateWeaponUI();
    updateWeaponButtons();
}

// Настройка десктоп управления
function setupDesktopControls() {
    // Очищаем предыдущие обработчики событий
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    gameCanvas.removeEventListener('mousemove', handleMouseMove);
    gameCanvas.removeEventListener('mousedown', handleMouseDown);
    
    // Управление клавиатурой
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Управление мышью
    gameCanvas.addEventListener('mousemove', handleMouseMove);
    gameCanvas.addEventListener('mousedown', handleMouseDown);
    gameCanvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

// Настройка мобильного управления
function setupMobileControls() {
    // Джойстик для движения
    let joystickStartX = 0;
    let joystickStartY = 0;
    let joystickRadius = 50;
    
    movementJoystick.addEventListener('touchstart', (e) => {
        e.preventDefault();
        joystickActive = true;
        const rect = movementJoystick.getBoundingClientRect();
        joystickStartX = rect.left + rect.width / 2;
        joystickStartY = rect.top + rect.height / 2;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!joystickActive) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        
        let deltaX = touch.clientX - joystickStartX;
        let deltaY = touch.clientY - joystickStartY;
        
        // Ограничиваем движение внутри джойстика
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance > joystickRadius) {
            deltaX = (deltaX / distance) * joystickRadius;
            deltaY = (deltaY / distance) * joystickRadius;
        }
        
        // Обновляем позицию ручки джойстика
        joystickHandle.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
        
        // Нормализуем значения для движения
        joystickX = deltaX / joystickRadius;
        joystickY = deltaY / joystickRadius;
    });
    
    document.addEventListener('touchend', (e) => {
        if (!joystickActive) return;
        
        joystickActive = false;
        joystickX = 0;
        joystickY = 0;
        joystickHandle.style.transform = 'translate(-50%, -50%)';
    });
    
    // Кнопка стрельбы
    shootButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        shoot();
    });
    
    // Кнопка перезарядки
    reloadButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (currentWeapon !== 'pistol' && weapons[currentWeapon].ammo < weapons[currentWeapon].maxAmmo) {
            reloadWeapon();
        }
    });
    
    // Кнопка ускорения
    sprintButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        player.isSprinting = true;
    });
    
    sprintButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        player.isSprinting = false;
    });
    
    // Кнопки смены оружия
    weaponButtons.forEach(button => {
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const weapon = button.dataset.weapon;
            
            if (weapon === 'pistol') {
                currentWeapon = 'pistol';
            } else if (weapon === 'rifle' && weapons.rifle.ammo > 0) {
                currentWeapon = 'rifle';
            } else if (weapon === 'shotgun' && weapons.shotgun.ammo > 0) {
                currentWeapon = 'shotgun';
            }
            
            updateWeaponUI();
            updateWeaponButtons();
        });
    });
    
    // Управление прицеливанием через касание экрана
    gameCanvas.addEventListener('touchstart', (e) => {
        if (e.target === gameCanvas) {
            const touch = e.touches[0];
            const rect = gameCanvas.getBoundingClientRect();
            mouseX = touch.clientX - rect.left;
            mouseY = touch.clientY - rect.top;
        }
    });
    
    gameCanvas.addEventListener('touchmove', (e) => {
        if (e.target === gameCanvas) {
            const touch = e.touches[0];
            const rect = gameCanvas.getBoundingClientRect();
            mouseX = touch.clientX - rect.left;
            mouseY = touch.clientY - rect.top;
        }
    });
}

// Обработчики событий для десктопа
function handleKeyDown(e) {
    const key = e.key.toLowerCase();
    keys[key] = true;
    
    // Смена оружия
    if (key === '1') {
        currentWeapon = 'pistol';
        updateWeaponUI();
        updateWeaponButtons();
    }
    if (key === '2' && weapons.rifle.ammo > 0) {
        currentWeapon = 'rifle';
        updateWeaponUI();
        updateWeaponButtons();
    }
    if (key === '3' && weapons.shotgun.ammo > 0) {
        currentWeapon = 'shotgun';
        updateWeaponUI();
        updateWeaponButtons();
    }
    
    // Перезарядка
    if (key === 'r' && currentWeapon !== 'pistol' && weapons[currentWeapon].ammo < weapons[currentWeapon].maxAmmo) {
        reloadWeapon();
    }
    
    // Ускорение
    if (key === 'shift') {
        player.isSprinting = true;
    }
}

function handleKeyUp(e) {
    const key = e.key.toLowerCase();
    keys[key] = false;
    
    if (key === 'shift') {
        player.isSprinting = false;
    }
}

function handleMouseMove(e) {
    const rect = gameCanvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
}

function handleMouseDown(e) {
    if (e.button === 0) {
        shoot();
    }
}

// Обновление кнопок оружия
function updateWeaponButtons() {
    weaponButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.weapon === currentWeapon) {
            button.classList.add('active');
        }
    });
}

function shoot() {
    const weapon = weapons[currentWeapon];
    
    if (isReloading) return;
    if (weapon.ammo <= 0 && currentWeapon !== 'pistol') {
        reloadWeapon();
        return;
    }
    if (Date.now() - player.lastShot < weapon.fireRate) return;
    
    // Расход патронов
    if (currentWeapon !== 'pistol') {
        weapon.ammo--;
        updateWeaponUI();
        updateWeaponButtons();
    }
    
    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    
    if (currentWeapon === 'shotgun') {
        // Выстрел дробовика (несколько дробин)
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
        
        // Анимация выстрела дробовика
        createAnimation(player.x, player.y, 'explosion', 60);
    } else {
        // Обычный выстрел
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
        
        // Анимация выстрела
        createAnimation(player.x, player.y, 'explosion', 40);
        
        // След от пули
        createBulletTrail(player.x, player.y, angle);
    }
    
    player.lastShot = Date.now();
    
    // Воспроизведение звука выстрела
    playSound(shootSound);
    
    // Эффект отдачи
    const recoil = 0.5;
    player.x -= Math.cos(angle) * recoil;
    player.y -= Math.sin(angle) * recoil;
    
    // Частицы выстрела
    createMuzzleFlash(player.x, player.y, angle);
}

function createBulletTrail(x, y, angle) {
    const trail = document.createElement('div');
    trail.className = 'bullet-trail';
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    trail.style.width = '50px';
    trail.style.transform = `rotate(${angle}rad)`;
    trail.style.transformOrigin = 'left center';
    
    animationContainer.appendChild(trail);
    
    setTimeout(() => {
        if (trail.parentNode) {
            trail.remove();
        }
    }, 300);
}

function reloadWeapon() {
    if (isReloading || currentWeapon === 'pistol') return;
    
    isReloading = true;
    updateWeaponUI();
    
    // Воспроизведение звука перезарядки
    playSound(reloadSound);
    
    setTimeout(() => {
        weapons[currentWeapon].ammo = weapons[currentWeapon].maxAmmo;
        isReloading = false;
        updateWeaponUI();
        updateWeaponButtons();
    }, 1500);
}

function updateWeaponUI() {
    const weapon = weapons[currentWeapon];
    currentWeaponSpan.textContent = weapon.name;
    ammoCount.textContent = weapon.ammo === Infinity ? '∞' : weapon.ammo;
    
    if (isReloading) {
        currentWeaponSpan.textContent += ' (Перезарядка...)';
        ammoCount.textContent = '...';
    }
}

function createMuzzleFlash(x, y, angle) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x + Math.cos(angle) * 25,
            y: y + Math.sin(angle) * 25,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            radius: Math.random() * 3 + 1,
            color: '#ff9900',
            life: 20
        });
    }
}

function createBlood(x, y) {
    // Частицы крови
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            radius: Math.random() * 4 + 2,
            color: '#ff0000',
            life: 30
        });
    }
    
    // Анимация брызг крови
    createAnimation(x, y, 'blood-splash', 80);
}

function createBots() {
    const botCount = 5 + Math.floor(Math.random() * 6); // 5-10 ботов
    
    for (let i = 0; i < botCount; i++) {
        createBot();
    }
    
    // Показываем сообщение о новой волне
    if (kills > 0) {
        showMessage(mediaConfig.messages.newWave);
    }
}

function createBot() {
    const names = ['Бот_Алексей', 'Бот_Иван', 'Бот_Дмитрий', 'Бот_Сергей', 'Бот_Андрей'];
    const botTypes = ['pistol', 'rifle'];
    const botType = botTypes[Math.floor(Math.random() * botTypes.length)];
    
    enemies.push({
        id: 'bot_' + Date.now() + Math.random(),
        name: names[Math.floor(Math.random() * names.length)],
        type: botType,
        x: Math.random() * gameCanvas.width,
        y: Math.random() * gameCanvas.height,
        radius: 18,
        color: getRandomColor(),
        speed: 1 + Math.random() * 2,
        health: 100,
        maxHealth: 100,
        lastShot: 0,
        fireRate: 1000 + Math.random() * 1000,
        detectionRange: 300,
        attackRange: 400
    });
}

function botShoot(bot) {
    const dx = player.x - bot.x;
    const dy = player.y - bot.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > bot.attackRange) return;
    
    const angle = Math.atan2(dy, dx);
    const spread = (Math.random() - 0.5) * 0.1;
    
    enemyBullets.push({
        x: bot.x,
        y: bot.y,
        radius: 4,
        color: '#ff4444',
        speed: 8,
        angle: angle + spread,
        damage: bot.type === 'rifle' ? 15 : 8,
        owner: bot.id
    });
    
    bot.lastShot = Date.now();
}

function updatePlayer() {
    if (!player) return;
    
    // Скорость движения
    let speed = player.speed;
    if (player.isSprinting) {
        speed *= player.sprintMultiplier;
    }
    
    // Движение
    if (isMobile && joystickActive) {
        // Управление через джойстик на мобильном
        player.x += joystickX * speed;
        player.y += joystickY * speed;
    } else {
        // Управление через клавиатуру на десктопе
        if (keys['w'] || keys['ц']) player.y -= speed;
        if (keys['s'] || keys['ы']) player.y += speed;
        if (keys['a'] || keys['ф']) player.x -= speed;
        if (keys['d'] || keys['в']) player.x += speed;
    }
    
    // Вращение игрока к курсору
    player.rotation = Math.atan2(mouseY - player.y, mouseX - player.x);
    
    // Границы
    player.x = Math.max(player.radius, Math.min(gameCanvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(gameCanvas.height - player.radius, player.y));
    
    // Обновление здоровья на UI
    playerHealthFill.style.width = `${(player.health / player.maxHealth) * 100}%`;
    
   
    
    // Проверка смерти игрока
    if (player.health <= 0 && gameRunning) {
        gameRunning = false;
        const survivalTime = Math.floor((Date.now() - startTime) / 1000);
        survivalTimeSpan.textContent = survivalTime;
        killsCountSpan.textContent = kills;
        
        // Воспроизведение звука смерти
        playSound(deathSound);
        
        deathScreen.style.display = 'block';
    }
    
    // Мерцание при получении урона
    if (Date.now() - player.lastDamageTime < 200) {
        player.color = '#ff4444';
    } else {
        player.color = '#4cc9f0';
    }
}

function updateBullets() {
    // Пули игрока
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        bullet.x += Math.cos(bullet.angle) * bullet.speed;
        bullet.y += Math.sin(bullet.angle) * bullet.speed;
        
        // Удаление пуль за пределами экрана
        if (bullet.x < -100 || bullet.x > gameCanvas.width + 100 || 
            bullet.y < -100 || bullet.y > gameCanvas.height + 100) {
            bullets.splice(i, 1);
            continue;
        }
        
        // Проверка столкновений с врагами
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < bullet.radius + enemy.radius) {
                enemy.health -= bullet.damage;
                createBlood(enemy.x, enemy.y);
                bullets.splice(i, 1);
                
                // Воспроизведение звука попадания
                playSound(hitSound);
                
                if (enemy.health <= 0) {
                    enemies.splice(j, 1);
                    kills++;
                    
                    // Воспроизведение звука убийства
                    playSound(killSound);
                    
                    // События по количеству убийств
                    if (kills % 5 === 0) {
                        showMessage(`Убито врагов: ${kills}!`, 'powerup');
                        playSound(levelUpSound);
                    }
                    
                    if (kills % 10 === 0) {
                        showMessage(mediaConfig.messages.bossComing, 'warning');
                    }
                    
                    setTimeout(() => createBot(), 2000);
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
        
        if (bullet.x < -100 || bullet.x > gameCanvas.width + 100 || 
            bullet.y < -100 || bullet.y > gameCanvas.height + 100) {
            enemyBullets.splice(i, 1);
            continue;
        }
        
        // Проверка столкновения с игроком
        const dx = bullet.x - player.x;
        const dy = bullet.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < bullet.radius + player.radius) {
            player.health -= bullet.damage;
            player.lastDamageTime = Date.now();
            createBlood(player.x, player.y);
            enemyBullets.splice(i, 1);
            
            // Воспроизведение звука попадания по игроку
            playSound(hitSound);
        }
    }
}

function updateEnemies() {
    enemies.forEach(enemy => {
        // ИИ бота
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < enemy.detectionRange) {
            // Движение к игроку
            if (distance > 100) {
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
                enemy.x += Math.cos(enemy.randomAngle) * enemy.speed * 0.5;
                enemy.y += Math.sin(enemy.randomAngle) * enemy.speed * 0.5;
                
                // Границы для ботов
                enemy.x = Math.max(enemy.radius, Math.min(gameCanvas.width - enemy.radius, enemy.x));
                enemy.y = Math.max(enemy.radius, Math.min(gameCanvas.height - enemy.radius, enemy.y));
            }
        }
        
        // Столкновение с игроком
        const collisionDist = Math.sqrt(
            Math.pow(player.x - enemy.x, 2) + 
            Math.pow(player.y - enemy.y, 2)
        );
        
        if (collisionDist < player.radius + enemy.radius) {
            player.health -= 1;
            player.lastDamageTime = Date.now();
        }
    });
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        
        // Замедление
        p.vx *= 0.95;
        p.vy *= 0.95;
        
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function updateUI() {
    // Обновляем список игроков
    playersList.innerHTML = `
        <div class="player-item">
            <div class="player-color" style="background-color: ${player.color}"></div>
            <span>Вы (${player.health.toFixed(0)} HP)</span>
        </div>
    `;
    
    enemies.forEach(enemy => {
        playersList.innerHTML += `
            <div class="player-item">
                <div class="player-color" style="background-color: ${enemy.color}"></div>
                <span>${enemy.name} (${enemy.health.toFixed(0)} HP)</span>
            </div>
        `;
    });
}

function drawBackground() {
    // Фоновый градиент (используется как fallback если нет изображения)
    const gradient = ctx.createLinearGradient(0, 0, gameCanvas.width, gameCanvas.height);
    gradient.addColorStop(0, '#0d1b2a');
    gradient.addColorStop(1, '#1b263b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Детали города (рисуются поверх фонового изображения)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    
    // Здания
    for (let i = 0; i < 20; i++) {
        const x = (i * 150) % gameCanvas.width;
        const y = Math.sin(i * 0.5) * 100 + 200;
        const width = 80 + Math.sin(i) * 20;
        const height = 150 + Math.cos(i * 1.5) * 50;
        
        ctx.fillRect(x, y, width, height);
        ctx.fillStyle = 'rgba(100, 100, 255, 0.1)';
        ctx.fillRect(x + 10, y + 10, 20, 20);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    }
}

function drawPlayer() {
    if (!player) return;
    
    // Тело игрока
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.rotation);
    
    // Основной круг
    ctx.beginPath();
    ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    
    // Обводка
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Направление (ствол)
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(player.radius + 10, 0);
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 6;
    ctx.stroke();
    
    ctx.restore();
    
    // Имя игрока
    ctx.fillStyle = '#ffffff';
    ctx.font = isMobile ? '12px Arial' : '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Вы', player.x, player.y - player.radius - (isMobile ? 12 : 15));
    
    // Полоска здоровья
    const healthWidth = (player.health / player.maxHealth) * (player.radius * 2);
    ctx.fillStyle = player.health > 50 ? '#4CAF50' : player.health > 25 ? '#FF9800' : '#F44336';
    ctx.fillRect(player.x - player.radius, player.y - player.radius - (isMobile ? 6 : 8), healthWidth, 4);
}

function drawEnemies() {
    enemies.forEach(enemy => {
        // Тело врага
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = enemy.color;
        ctx.fill();
        
        // Обводка
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Глаза (направление взгляда)
        const angleToPlayer = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        const eyeX = enemy.x + Math.cos(angleToPlayer) * 10;
        const eyeY = enemy.y + Math.sin(angleToPlayer) * 10;
        
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        
        // Имя врага
        ctx.fillStyle = '#ffffff';
        ctx.font = isMobile ? '10px Arial' : '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(enemy.name, enemy.x, enemy.y - enemy.radius - (isMobile ? 10 : 12));
        
        // Полоска здоровья
        const healthWidth = (enemy.health / enemy.maxHealth) * (enemy.radius * 2);
        ctx.fillStyle = enemy.health > 50 ? '#4CAF50' : enemy.health > 25 ? '#FF9800' : '#F44336';
        ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - (isMobile ? 6 : 8), healthWidth, 4);
    });
}

function drawBullets() {
    // Пули игрока
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
        
        // След пули
        ctx.beginPath();
        ctx.moveTo(bullet.x - Math.cos(bullet.angle) * 10, bullet.y - Math.sin(bullet.angle) * 10);
        ctx.lineTo(bullet.x, bullet.y);
        ctx.strokeStyle = bullet.color + '80';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // Пули врагов
    enemyBullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
        
        // След пули врага
        ctx.beginPath();
        ctx.moveTo(bullet.x - Math.cos(bullet.angle) * 10, bullet.y - Math.sin(bullet.angle) * 10);
        ctx.lineTo(bullet.x, bullet.y);
        ctx.strokeStyle = '#ff444480';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function drawParticles() {
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.life / 30 * 255).toString(16).padStart(2, '0');
        ctx.fill();
    });
}

function drawMiniMap() {
    if (!player) return;
    
    miniMapCtx.clearRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
    
    // Фон миникарты
    miniMapCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    miniMapCtx.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
    
    // Масштаб
    const scale = 0.1;
    const offsetX = miniMapCanvas.width / 2;
    const offsetY = miniMapCanvas.height / 2;
    
    // Игрок на миникарте
    const playerMapX = player.x * scale;
    const playerMapY = player.y * scale;
    
    miniMapCtx.fillStyle = '#4cc9f0';
    miniMapCtx.beginPath();
    miniMapCtx.arc(offsetX, offsetY, 4, 0, Math.PI * 2);
    miniMapCtx.fill();
    
    // Направление игрока
    miniMapCtx.strokeStyle = '#4cc9f0';
    miniMapCtx.beginPath();
    miniMapCtx.moveTo(offsetX, offsetY);
    miniMapCtx.lineTo(
        offsetX + Math.cos(player.rotation) * 10,
        offsetY + Math.sin(player.rotation) * 10
    );
    miniMapCtx.stroke();
    
    // Враги на миникарте
    enemies.forEach(enemy => {
        const enemyMapX = offsetX + (enemy.x - player.x) * scale;
        const enemyMapY = offsetY + (enemy.y - player.y) * scale;
        
        if (enemyMapX >= 0 && enemyMapX <= miniMapCanvas.width &&
            enemyMapY >= 0 && enemyMapY <= miniMapCanvas.height) {
            miniMapCtx.fillStyle = '#ff4444';
            miniMapCtx.beginPath();
            miniMapCtx.arc(enemyMapX, enemyMapY, 3, 0, Math.PI * 2);
            miniMapCtx.fill();
        }
    });
    
    // Граница миникарты
    miniMapCtx.strokeStyle = '#4cc9f0';
    miniMapCtx.lineWidth = 2;
    miniMapCtx.strokeRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
}

function gameLoop() {
    if (!gameRunning) return;
    
    // Обновление
    updatePlayer();
    updateBullets();
    updateEnemies();
    updateParticles();
    updateUI();
    updateWeaponUI();
    
    // Отрисовка
    drawBackground();
    drawEnemies();
    drawBullets();
    drawParticles();
    drawPlayer();
    
    gameLoopId = requestAnimationFrame(gameLoop);
}

function miniMapLoop() {
    if (!gameRunning) return;
    drawMiniMap();
    miniMapLoopId = requestAnimationFrame(miniMapLoop);
}

function getRandomColor() {
    const colors = ['#ff4444', '#ff8800', '#ffaa00', '#ff7700', '#ff5500'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Инициализация при загрузке страницы
window.addEventListener('load', () => {
    detectDevice();
    updatePlayerCounts();
    setInterval(updatePlayerCounts, 5000);
});

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    if (gameRunning) {
        // Можно добавить адаптацию к изменению размера экрана
    }
});