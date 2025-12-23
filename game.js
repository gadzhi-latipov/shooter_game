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
let isMobile = true; // Принудительно для мобильных
let soundEnabled = true;
let musicEnabled = true;
let joystickActive = false;
let joystickX = 0;
let joystickY = 0;
let lowHealthWarningShown = false;

// DOM элементы
let startScreen, gameScreen, startButton, cityCards, currentCitySpan;
let playerHealthFill, playersList, deathScreen, survivalTimeSpan, killsCountSpan;
let restartButton, moscowCount, petersburgCount, ammoCount, currentWeaponSpan;
let gameCanvas, ctx, backgroundOverlay, animationContainer, textMessages;
let mobileControls, soundToggle, musicToggle;
let movementJoystick, joystickHandle, shootButton;
let reloadButton, sprintButton, weaponButtons;

// Аудио элементы
let backgroundMusic, shootSound, reloadSound, hitSound, deathSound, killSound, levelUpSound;

// Определение устройства
function detectDevice() {
    // Принудительно устанавливаем мобильный режим
    isMobile = true;
    console.log(`Мобильный режим включен`);
    
    if (mobileControls) mobileControls.classList.add('active');
}

// Инициализация звуков
function initSounds() {
    // Устанавливаем пути к звукам из конфигурации
    if (mediaConfig.sounds.backgroundMusic && backgroundMusic) {
        backgroundMusic.src = mediaConfig.sounds.backgroundMusic;
    }
    if (mediaConfig.sounds.shoot && shootSound) {
        shootSound.src = mediaConfig.sounds.shoot;
    }
    if (mediaConfig.sounds.reload && reloadSound) {
        reloadSound.src = mediaConfig.sounds.reload;
    }
    if (mediaConfig.sounds.hit && hitSound) {
        hitSound.src = mediaConfig.sounds.hit;
    }
    if (mediaConfig.sounds.death && deathSound) {
        deathSound.src = mediaConfig.sounds.death;
    }
    if (mediaConfig.sounds.kill && killSound) {
        killSound.src = mediaConfig.sounds.kill;
    }
    if (mediaConfig.sounds.levelUp && levelUpSound) {
        levelUpSound.src = mediaConfig.sounds.levelUp;
    }
    
    // Настройка громкости
    if (backgroundMusic) backgroundMusic.volume = 0.3;
    if (shootSound) shootSound.volume = 0.5;
    if (reloadSound) reloadSound.volume = 0.3;
    if (hitSound) hitSound.volume = 0.4;
    if (deathSound) deathSound.volume = 0.6;
    if (killSound) killSound.volume = 0.5;
    if (levelUpSound) levelUpSound.volume = 0.5;
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
    if (soundToggle) {
        soundToggle.textContent = soundEnabled ? '🔊 Вкл звук' : '🔇 Выкл звук';
    }
}

// Включение/выключение музыки
function toggleMusic() {
    musicEnabled = !musicEnabled;
    if (musicToggle) {
        musicToggle.textContent = musicEnabled ? '🎵 Вкл музыку' : '🎵 Выкл музыку';
    }
    
    if (backgroundMusic) {
        if (musicEnabled) {
            backgroundMusic.play().catch(e => console.log("Ошибка воспроизведения музыки:", e));
        } else {
            backgroundMusic.pause();
        }
    }
}

// Установка фонового изображения
function setBackground(city) {
    if (backgroundOverlay && mediaConfig.backgrounds[city]) {
        backgroundOverlay.style.backgroundImage = `url('${mediaConfig.backgrounds[city]}')`;
    }
}

// Создание анимации
function createAnimation(x, y, type, size = 50) {
    if (!animationContainer) return;
    
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
    if (!textMessages) return;
    
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
    if (moscowCount) moscowCount.textContent = serverRooms.moscow.players.length;
    if (petersburgCount) petersburgCount.textContent = serverRooms.petersburg.players.length;
}

// Инициализация DOM элементов
function initDOMElements() {
    startScreen = document.getElementById('startScreen');
    gameScreen = document.getElementById('gameScreen');
    startButton = document.getElementById('startButton');
    cityCards = document.querySelectorAll('.city-card');
    currentCitySpan = document.getElementById('currentCity');
    playerHealthFill = document.getElementById('playerHealth');
    playersList = document.getElementById('playersList');
    deathScreen = document.getElementById('deathScreen');
    survivalTimeSpan = document.getElementById('survivalTime');
    killsCountSpan = document.getElementById('killsCount');
    restartButton = document.getElementById('restartButton');
    moscowCount = document.getElementById('moscow-count');
    petersburgCount = document.getElementById('petersburg-count');
    ammoCount = document.getElementById('ammoCount');
    currentWeaponSpan = document.getElementById('currentWeapon');
    gameCanvas = document.getElementById('gameCanvas');
    backgroundOverlay = document.getElementById('backgroundOverlay');
    animationContainer = document.getElementById('animationContainer');
    textMessages = document.getElementById('textMessages');
    mobileControls = document.getElementById('mobileControls');
    soundToggle = document.getElementById('soundToggle');
    musicToggle = document.getElementById('musicToggle');
    
    // Аудио элементы
    backgroundMusic = document.getElementById('backgroundMusic');
    shootSound = document.getElementById('shootSound');
    reloadSound = document.getElementById('reloadSound');
    hitSound = document.getElementById('hitSound');
    deathSound = document.getElementById('deathSound');
    killSound = document.getElementById('killSound');
    levelUpSound = document.getElementById('levelUpSound');
    
    // Мобильные элементы управления
    movementJoystick = document.getElementById('movementJoystick');
    if (movementJoystick) {
        joystickHandle = movementJoystick.querySelector('.joystick-handle');
    }
    shootButton = document.getElementById('shootButton');
    reloadButton = document.getElementById('reloadButton');
    sprintButton = document.getElementById('sprintButton');
    weaponButtons = document.querySelectorAll('.weapon-button');
    
    // Получаем контекст canvas если он существует
    if (gameCanvas) {
        ctx = gameCanvas.getContext('2d');
        // Устанавливаем размер canvas на весь экран
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
    }
}

// Начало игры
function startGame() {
    if (!currentCity || !gameScreen || !startScreen) return;
    
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
    if (currentCitySpan) currentCitySpan.textContent = serverRooms[currentCity].name;
    
    initGame();
    
    // Запускаем игровые циклы
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    
    gameLoopId = requestAnimationFrame(gameLoop);
    
    // Запускаем музыку
    if (musicEnabled && backgroundMusic) {
        backgroundMusic.play().catch(e => console.log("Автовоспроизведение заблокировано"));
    }
}

function restartGame() {
    if (!deathScreen) return;
    
    deathScreen.style.display = 'none';
    
    // Очищаем игровое состояние
    bullets = [];
    enemyBullets = [];
    enemies = [];
    particles = [];
    
    // Очищаем анимации и сообщения
    if (animationContainer) animationContainer.innerHTML = '';
    if (textMessages) textMessages.innerHTML = '';
    
    // Восстанавливаем здоровье игрока
    if (player) {
        player.health = 100;
        player.lastDamageTime = 0;
        player.color = '#4cc9f0';
    }
    
    // Восстанавливаем патроны
    weapons.rifle.ammo = weapons.rifle.maxAmmo;
    weapons.shotgun.ammo = weapons.shotgun.maxAmmo;
    currentWeapon = 'pistol';
    isReloading = false;
    lowHealthWarningShown = false;
    
    // Сбрасываем статистику
    kills = 0;
    startTime = Date.now();
    
    // Перемещаем игрока в центр
    if (player && gameCanvas) {
        player.x = gameCanvas.width / 2;
        player.y = gameCanvas.height / 2;
    }
    
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
    
    gameLoopId = requestAnimationFrame(gameLoop);
}

// Инициализация игры
function initGame() {
    if (!gameCanvas) return;
    
    // Создаем игрока
    player = {
        id: playerId,
        x: gameCanvas.width / 2,
        y: gameCanvas.height / 2,
        radius: 15, // Уменьшено для мобильных
        color: '#4cc9f0',
        speed: 4, // Уменьшено для мобильных
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
    
    // Настраиваем мобильное управление
    setupMobileControls();
    
    // Обновление UI оружия
    updateWeaponUI();
    updateWeaponButtons();
}

// Настройка мобильного управления
function setupMobileControls() {
    if (!movementJoystick || !shootButton || !reloadButton || !sprintButton) return;
    
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
        if (joystickHandle) {
            joystickHandle.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
        }
        
        // Нормализуем значения для движения
        joystickX = deltaX / joystickRadius;
        joystickY = deltaY / joystickRadius;
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
    
    // Кнопка стрельбы
    shootButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        shoot();
    });
    
    shootButton.addEventListener('touchmove', (e) => {
        e.preventDefault();
    });
    
    shootButton.addEventListener('touchend', (e) => {
        e.preventDefault();
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
        if (player) player.isSprinting = true;
    });
    
    sprintButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (player) player.isSprinting = false;
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
    if (gameCanvas) {
        gameCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = gameCanvas.getBoundingClientRect();
            mouseX = touch.clientX - rect.left;
            mouseY = touch.clientY - rect.top;
        });
        
        gameCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = gameCanvas.getBoundingClientRect();
            mouseX = touch.clientX - rect.left;
            mouseY = touch.clientY - rect.top;
        });
    }
}

// Обновление кнопок оружия
function updateWeaponButtons() {
    if (!weaponButtons) return;
    
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
        createAnimation(player.x, player.y, 'explosion', 40);
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
        createAnimation(player.x, player.y, 'explosion', 30);
    }
    
    player.lastShot = Date.now();
    
    // Воспроизведение звука выстрела
    playSound(shootSound);
    
    // Частицы выстрела
    createMuzzleFlash(player.x, player.y, angle);
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
    if (currentWeaponSpan) {
        currentWeaponSpan.textContent = weapon.name;
    }
    if (ammoCount) {
        ammoCount.textContent = weapon.ammo === Infinity ? '∞' : weapon.ammo;
    }
    
    if (isReloading && currentWeaponSpan) {
        currentWeaponSpan.textContent += ' (Перезарядка...)';
        if (ammoCount) ammoCount.textContent = '...';
    }
}

function createMuzzleFlash(x, y, angle) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x + Math.cos(angle) * 20,
            y: y + Math.sin(angle) * 20,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            radius: Math.random() * 2 + 1,
            color: '#ff9900',
            life: 15
        });
    }
}

function createBlood(x, y) {
    // Частицы крови
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            radius: Math.random() * 3 + 2,
            color: '#ff0000',
            life: 25
        });
    }
    
    // Анимация брызг крови
    createAnimation(x, y, 'blood-splash', 60);
}

function createBots() {
    const botCount = 3 + Math.floor(Math.random() * 4); // 3-6 ботов для мобильных
    
    for (let i = 0; i < botCount; i++) {
        createBot();
    }
    
    // Показываем сообщение о новой волне
    if (kills > 0) {
        showMessage(mediaConfig.messages.newWave);
    }
}

function createBot() {
    if (!gameCanvas) return;
    
    const names = ['Бот_Алексей', 'Бот_Иван', 'Бот_Дмитрий', 'Бот_Сергей', 'Бот_Андрей'];
    const botTypes = ['pistol', 'rifle'];
    const botType = botTypes[Math.floor(Math.random() * botTypes.length)];
    
    enemies.push({
        id: 'bot_' + Date.now() + Math.random(),
        name: names[Math.floor(Math.random() * names.length)],
        type: botType,
        x: Math.random() * gameCanvas.width,
        y: Math.random() * gameCanvas.height,
        radius: 12, // Уменьшено для мобильных
        color: getRandomColor(),
        speed: 0.8 + Math.random() * 1.5, // Уменьшено для мобильных
        health: 100,
        maxHealth: 100,
        lastShot: 0,
        fireRate: 1200 + Math.random() * 1000, // Уменьшена скорость стрельбы
        detectionRange: 150, // Уменьшено для мобильных
        attackRange: 200 // Уменьшено для мобильных
    });
}

function botShoot(bot) {
    if (!player) return;
    
    const dx = player.x - bot.x;
    const dy = player.y - bot.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > bot.attackRange) return;
    
    const angle = Math.atan2(dy, dx);
    const spread = (Math.random() - 0.5) * 0.15;
    
    enemyBullets.push({
        x: bot.x,
        y: bot.y,
        radius: 3,
        color: '#ff4444',
        speed: 6,
        angle: angle + spread,
        damage: bot.type === 'rifle' ? 12 : 6,
        owner: bot.id
    });
    
    bot.lastShot = Date.now();
}

function updatePlayer() {
    if (!player || !gameCanvas) return;
    
    // Скорость движения
    let speed = player.speed;
    if (player.isSprinting) {
        speed *= player.sprintMultiplier;
    }
    
    // Движение через джойстик
    if (joystickActive) {
        player.x += joystickX * speed * 1.5;
        player.y += joystickY * speed * 1.5;
    }
    
    // Вращение игрока к курсору
    player.rotation = Math.atan2(mouseY - player.y, mouseX - player.x);
    
    // Границы
    player.x = Math.max(player.radius, Math.min(gameCanvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(gameCanvas.height - player.radius, player.y));
    
    // Обновление здоровья на UI
    if (playerHealthFill) {
        playerHealthFill.style.width = `${(player.health / player.maxHealth) * 100}%`;
    }
    
    // События по уровню здоровья (показывается только один раз)
    if (player.health < 30 && player.health > 0 && !lowHealthWarningShown) {
        showMessage(mediaConfig.messages.warning, 'warning');
        lowHealthWarningShown = true;
    }
    
    // Сбросить флаг, если здоровье восстановилось выше 30
    if (player.health >= 30) {
        lowHealthWarningShown = false;
    }
    
    // Проверка смерти игрока
    if (player.health <= 0 && gameRunning) {
        gameRunning = false;
        const survivalTime = Math.floor((Date.now() - startTime) / 1000);
        if (survivalTimeSpan) survivalTimeSpan.textContent = survivalTime;
        if (killsCountSpan) killsCountSpan.textContent = kills;
        
        // Воспроизведение звука смерти
        playSound(deathSound);
        
        if (deathScreen) deathScreen.style.display = 'block';
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
        if (!gameCanvas || bullet.x < -50 || bullet.x > gameCanvas.width + 50 || 
            bullet.y < -50 || bullet.y > gameCanvas.height + 50) {
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
                    if (kills % 3 === 0) {
                        showMessage(`Убито врагов: ${kills}!`, 'powerup');
                        playSound(levelUpSound);
                    }
                    
                    if (kills % 5 === 0) {
                        showMessage(mediaConfig.messages.bossComing, 'warning');
                    }
                    
                    setTimeout(() => createBot(), 1500);
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
        
        if (!gameCanvas || bullet.x < -50 || bullet.x > gameCanvas.width + 50 || 
            bullet.y < -50 || bullet.y > gameCanvas.height + 50) {
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
    if (!player) return;
    
    enemies.forEach(enemy => {
        // ИИ бота
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
                
                // Границы для ботов
                if (gameCanvas) {
                    enemy.x = Math.max(enemy.radius, Math.min(gameCanvas.width - enemy.radius, enemy.x));
                    enemy.y = Math.max(enemy.radius, Math.min(gameCanvas.height - enemy.radius, enemy.y));
                }
            }
        }
        
        // Столкновение с игроком
        const collisionDist = Math.sqrt(
            Math.pow(player.x - enemy.x, 2) + 
            Math.pow(player.y - enemy.y, 2)
        );
        
        if (collisionDist < player.radius + enemy.radius) {
            player.health -= 0.5; // Уменьшен урон от столкновения
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
        p.vx *= 0.9;
        p.vy *= 0.9;
        
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function updateUI() {
    if (!playersList || !player) return;
    
    // Обновляем список игроков
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
}

function drawBackground() {
    if (!ctx || !gameCanvas) return;
    
    // Фоновый градиент
    const gradient = ctx.createLinearGradient(0, 0, gameCanvas.width, gameCanvas.height);
    gradient.addColorStop(0, '#0d1b2a');
    gradient.addColorStop(1, '#1b263b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawPlayer() {
    if (!ctx || !player) return;
    
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
    ctx.moveTo(10, 0);
    ctx.lineTo(player.radius + 8, 0);
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.restore();
    
    // Полоска здоровья
    const healthWidth = (player.health / player.maxHealth) * (player.radius * 2);
    ctx.fillStyle = player.health > 50 ? '#4CAF50' : player.health > 25 ? '#FF9800' : '#F44336';
    ctx.fillRect(player.x - player.radius, player.y - player.radius - 8, healthWidth, 3);
}

function drawEnemies() {
    if (!ctx) return;
    
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
        const eyeX = enemy.x + Math.cos(angleToPlayer) * 8;
        const eyeY = enemy.y + Math.sin(angleToPlayer) * 8;
        
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        // Полоска здоровья
        const healthWidth = (enemy.health / enemy.maxHealth) * (enemy.radius * 2);
        ctx.fillStyle = enemy.health > 50 ? '#4CAF50' : enemy.health > 25 ? '#FF9800' : '#F44336';
        ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 6, healthWidth, 3);
    });
}

function drawBullets() {
    if (!ctx) return;
    
    // Пули игрока
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
    });
    
    // Пули врагов
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
        ctx.fillStyle = p.color + Math.floor(p.life / 30 * 255).toString(16).padStart(2, '0');
        ctx.fill();
    });
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

function getRandomColor() {
    const colors = ['#ff4444', '#ff8800', '#ffaa00', '#ff7700', '#ff5500'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Инициализация при загрузке страницы
window.addEventListener('load', () => {
    // Сначала инициализируем DOM элементы
    initDOMElements();
    
    // Затем определяем устройство (принудительно мобильное)
    detectDevice();
    
    // Назначаем обработчики событий
    if (startButton) {
        startButton.addEventListener('click', startGame);
    }
    
    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    }
    
    if (soundToggle) {
        soundToggle.addEventListener('click', toggleSound);
    }
    
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleMusic);
    }
    
    // Выбор города
    if (cityCards) {
        cityCards.forEach(card => {
            card.addEventListener('click', () => {
                cityCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                currentCity = card.dataset.city;
                if (startButton) startButton.disabled = false;
            });
        });
    }
    
    updatePlayerCounts();
    setInterval(updatePlayerCounts, 5000);
});

// Обработка изменения размера окна и ориентации
window.addEventListener('resize', () => {
    if (gameCanvas) {
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
        
        if (player) {
            // Корректируем позицию игрока
            player.x = Math.min(player.x, gameCanvas.width - player.radius);
            player.y = Math.min(player.y, gameCanvas.height - player.radius);
            player.x = Math.max(player.x, player.radius);
            player.y = Math.max(player.y, player.radius);
        }
    }
});

// Предотвращаем стандартное поведение касаний
document.addEventListener('touchmove', function(e) {
    if (e.target === gameCanvas || e.target.classList.contains('action-button') || 
        e.target.classList.contains('weapon-button') || e.target === movementJoystick) {
        e.preventDefault();
    }
}, { passive: false });

// Предотвращаем масштабирование при двойном касании
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);