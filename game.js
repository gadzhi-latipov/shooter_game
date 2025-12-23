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
    pistol: { name: "Пистолет", damage: 10, fireRate: 300, ammo: Infinity, bulletSpeed: 12, bulletSize: 5, color: "#4cc9f0" },
    rifle: { name: "Винтовка", damage: 25, fireRate: 500, ammo: 30, maxAmmo: 30, bulletSpeed: 15, bulletSize: 6, color: "#4361ee" },
    shotgun: { name: "Дробовик", damage: 15, fireRate: 800, ammo: 8, maxAmmo: 8, bulletSpeed: 8, bulletSize: 8, spread: 0.3, pellets: 5, color: "#f72585" }
};
const weaponOrder = ['pistol', 'rifle', 'shotgun'];
let weaponIndex = 0;


// МЕДИА-КОНФИГУРАЦИЯ
const mediaConfig = {
    backgrounds: {
        moscow: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80',
        petersburg: 'https://images.unsplash.com/photo-1558661093-53d5f71c8d7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80'
    },
    sounds: {
        backgroundMusic: 'audio/background.mp3',
        shoot: '/shoot.ogg',
        reload: 'audio/reload.mp3',
        hit: 'audio/hit.mp3',
        death: 'audio/death.mp3',
        kill: 'audio/kill.mp3'
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
let currentWeapon = 'pistol';
let isReloading = false;
let gameLoopId = null;
let isMobile = true;
let soundEnabled = true;
let musicEnabled = true;

// Джойстики
let joystickActive = false;
let aimJoystickActive = false;
let joystickX = 0;
let joystickY = 0;
let aimJoystickX = 0;
let aimJoystickY = 0;

// DOM элементы
let startScreen, gameScreen, startButton, cityCards, currentCitySpan;
let playerHealthFill, playersList, deathScreen, survivalTimeSpan, killsCountSpan;
let restartButton, moscowCount, petersburgCount, ammoCount, currentWeaponSpan;
let gameCanvas, ctx, backgroundOverlay, animationContainer, textMessages;
let mobileControls, soundToggle, musicToggle;
let movementJoystick, aimJoystick, joystickHandle, aimJoystickHandle;
let weaponSwitchButton; // Добавляем кнопку смены оружия

// Аудио элементы
let backgroundMusic, shootSound, reloadSound, hitSound, deathSound, killSound;

// Определение устройства
function detectDevice() {
    isMobile = true;
    console.log(`Мобильный режим включен`);
    
    if (mobileControls) mobileControls.classList.add('active');
}

// Инициализация звуков
function initSounds() {
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
    
    if (backgroundMusic) backgroundMusic.volume = 0.3;
    if (shootSound) shootSound.volume = 0.5;
    if (reloadSound) reloadSound.volume = 0.3;
    if (hitSound) hitSound.volume = 0.4;
    if (deathSound) deathSound.volume = 0.6;
    if (killSound) killSound.volume = 0.5;
}

// Воспроизведение звука
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
    
    // Мобильные элементы управления
    movementJoystick = document.getElementById('movementJoystick');
    aimJoystick = document.getElementById('aimJoystick');
    weaponSwitchButton = document.getElementById('weaponSwitchButton'); // Инициализируем кнопку
    
    if (movementJoystick) {
        joystickHandle = movementJoystick.querySelector('.joystick-handle');
    }
    if (aimJoystick) {
        aimJoystickHandle = aimJoystick.querySelector('.joystick-handle');
    }
    
    // Получаем контекст canvas
    if (gameCanvas) {
        ctx = gameCanvas.getContext('2d');
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
    
    setBackground(currentCity);
    
    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    if (currentCitySpan) currentCitySpan.textContent = serverRooms[currentCity].name;
    
    initGame();
    
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    gameLoopId = requestAnimationFrame(gameLoop);
    
    if (musicEnabled && backgroundMusic) {
        backgroundMusic.play().catch(e => console.log("Автовоспроизведение заблокировано"));
    }
}

function restartGame() {
    if (!deathScreen) return;
    
    deathScreen.style.display = 'none';
    
    bullets = [];
    enemyBullets = [];
    enemies = [];
    particles = [];
    
    if (animationContainer) animationContainer.innerHTML = '';
    if (textMessages) textMessages.innerHTML = '';
    
    if (player) {
        player.health = 100;
        player.lastDamageTime = 0;
        player.color = '#4cc9f0';
    }
    
    weapons.rifle.ammo = weapons.rifle.maxAmmo;
    weapons.shotgun.ammo = weapons.shotgun.maxAmmo;
    currentWeapon = 'pistol';
    weaponIndex = 0;
    isReloading = false;
    
    kills = 0;
    startTime = Date.now();
    
    if (player && gameCanvas) {
        player.x = gameCanvas.width / 2;
        player.y = gameCanvas.height / 2;
    }
    
    createBots();
    
    updateWeaponUI();
    
    gameRunning = true;
    
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    gameLoopId = requestAnimationFrame(gameLoop);
}

// Инициализация игры
function initGame() {
    if (!gameCanvas) return;
    
    player = {
        id: playerId,
        x: gameCanvas.width / 2,
        y: gameCanvas.height / 2,
        radius: 15,
        color: '#4cc9f0',
        speed: 4,
        health: 100,
        maxHealth: 100,
        lastShot: 0,
        lastDamageTime: 0,
        rotation: 0
    };
    
    createBots();
    startTime = Date.now();
    gameRunning = true;
    
    initSounds();
    setupMobileControls();
    updateWeaponUI();
}

// Функция смены оружия
function switchWeapon() {
    weaponIndex = (weaponIndex + 1) % weaponOrder.length;
    currentWeapon = weaponOrder[weaponIndex];
    updateWeaponUI();
    
    // Визуальная обратная связь
    if (weaponSwitchButton) {
        weaponSwitchButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            if (weaponSwitchButton) weaponSwitchButton.style.transform = 'scale(1)';
        }, 100);
    }
}

// Настройка мобильного управления с двумя джойстиками
function setupMobileControls() {
    if (!movementJoystick || !aimJoystick) return;
    
    // Настройка левого джойстика (движение)
    let movementJoystickStartX = 0;
    let movementJoystickStartY = 0;
    let movementJoystickRadius = 30;
    
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
    
    // Настройка правого джойстика (прицеливание и автострельба)
    let aimJoystickStartX = 0;
    let aimJoystickStartY = 0;
    let aimJoystickRadius = 50;
    let autoShootInterval;
    
    aimJoystick.addEventListener('touchstart', (e) => {
        e.preventDefault();
        aimJoystickActive = true;
        const rect = aimJoystick.getBoundingClientRect();
        aimJoystickStartX = rect.left + rect.width / 2;
        aimJoystickStartY = rect.top + rect.height / 2;
        
        // Автоматическая стрельба при удержании джойстика
        if (autoShootInterval) clearInterval(autoShootInterval);
        autoShootInterval = setInterval(() => {
            if (aimJoystickActive && (Math.abs(aimJoystickX) > 0.1 || Math.abs(aimJoystickY) > 0.1)) {
                shoot();
            }
        }, weapons[currentWeapon].fireRate);
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
        
        // Обновляем направление прицеливания
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
        
        // Останавливаем автострельбу
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
        
        weaponSwitchButton.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
        
        weaponSwitchButton.addEventListener('touchend', (e) => {
            e.preventDefault();
        });
    }
}

function shoot() {
    const weapon = weapons[currentWeapon];
    
    if (isReloading) return;
    if (weapon.ammo <= 0 && currentWeapon !== 'pistol') {
        isReloading = true;
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
    
    // Используем направление из правого джойстика
    const angle = player.rotation;
    
    // Стрельба в зависимости от типа оружия
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
    playSound(shootSound);
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

function createBots() {
    const botCount = 3 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < botCount; i++) {
        createBot();
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
        radius: 12,
        color: getRandomColor(),
        speed: 0.8 + Math.random() * 1.5,
        health: 100,
        maxHealth: 100,
        lastShot: 0,
        fireRate: 1200 + Math.random() * 1000,
        detectionRange: 150,
        attackRange: 200
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
    
    let speed = player.speed;
    
    // Движение через левый джойстик
    if (joystickActive) {
        player.x += joystickX * speed * 1.5;
        player.y += joystickY * speed * 1.5;
    }
    
    // Поворот через правый джойстик
    if (aimJoystickActive) {
        player.rotation = Math.atan2(aimJoystickY, aimJoystickX);
    }
    
    // Ограничение движения в пределах canvas
    player.x = Math.max(player.radius, Math.min(gameCanvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(gameCanvas.height - player.radius, player.y));
    
    // Обновление UI здоровья
    if (playerHealthFill) {
        playerHealthFill.style.width = `${(player.health / player.maxHealth) * 100}%`;
    }
    
    // Проверка смерти игрока
    if (player.health <= 0 && gameRunning) {
        gameRunning = false;
        const survivalTime = Math.floor((Date.now() - startTime) / 1000);
        if (survivalTimeSpan) survivalTimeSpan.textContent = survivalTime;
        if (killsCountSpan) killsCountSpan.textContent = kills;
        
        playSound(deathSound);
        
        if (deathScreen) deathScreen.style.display = 'block';
    }
    
    // Эффект получения урона
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
        
        if (!gameCanvas || bullet.x < -50 || bullet.x > gameCanvas.width + 50 || 
            bullet.y < -50 || bullet.y > gameCanvas.height + 50) {
            bullets.splice(i, 1);
            continue;
        }
        
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < bullet.radius + enemy.radius) {
                enemy.health -= bullet.damage;
                bullets.splice(i, 1);
                
                playSound(hitSound);
                
                if (enemy.health <= 0) {
                    enemies.splice(j, 1);
                    kills++;
                    
                    playSound(killSound);
                    
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
        
        const dx = bullet.x - player.x;
        const dy = bullet.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < bullet.radius + player.radius) {
            player.health -= bullet.damage;
            player.lastDamageTime = Date.now();
            enemyBullets.splice(i, 1);
            
            playSound(hitSound);
        }
    }
}

function updateEnemies() {
    if (!player) return;
    
    enemies.forEach(enemy => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < enemy.detectionRange) {
            if (distance > 80) {
                enemy.x += (dx / distance) * enemy.speed;
                enemy.y += (dy / distance) * enemy.speed;
            }
            
            if (distance < enemy.attackRange && Date.now() - enemy.lastShot > enemy.fireRate) {
                botShoot(enemy);
            }
        } else {
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
        
        const collisionDist = Math.sqrt(
            Math.pow(player.x - enemy.x, 2) + 
            Math.pow(player.y - enemy.y, 2)
        );
        
        if (collisionDist < player.radius + enemy.radius) {
            player.health -= 0.5;
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
        
        p.vx *= 0.9;
        p.vy *= 0.9;
        
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function updateUI() {
    if (!playersList || !player) return;
    
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
    
    const gradient = ctx.createLinearGradient(0, 0, gameCanvas.width, gameCanvas.height);
    gradient.addColorStop(0, '#0d1b2a');
    gradient.addColorStop(1, '#1b263b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawPlayer() {
    if (!ctx || !player) return;
    
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.rotation);
    
    ctx.beginPath();
    ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(player.radius + 8, 0);
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.restore();
    
    const healthWidth = (player.health / player.maxHealth) * (player.radius * 2);
    ctx.fillStyle = player.health > 50 ? '#4CAF50' : player.health > 25 ? '#FF9800' : '#F44336';
    ctx.fillRect(player.x - player.radius, player.y - player.radius - 8, healthWidth, 3);
}

function drawEnemies() {
    if (!ctx) return;
    
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = enemy.color;
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        const angleToPlayer = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        const eyeX = enemy.x + Math.cos(angleToPlayer) * 8;
        const eyeY = enemy.y + Math.sin(angleToPlayer) * 8;
        
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        const healthWidth = (enemy.health / enemy.maxHealth) * (enemy.radius * 2);
        ctx.fillStyle = enemy.health > 50 ? '#4CAF50' : enemy.health > 25 ? '#FF9800' : '#F44336';
        ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 6, healthWidth, 3);
    });
}

function drawBullets() {
    if (!ctx) return;
    
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
    });
    
    enemyBullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = bullet.color;
        ctx.fill();
    });
}

function gameLoop() {
    if (!gameRunning) return;
    
    updatePlayer();
    updateBullets();
    updateEnemies();
    updateParticles();
    updateUI();
    updateWeaponUI();
    
    drawBackground();
    drawEnemies();
    drawBullets();
    drawPlayer();
    
    gameLoopId = requestAnimationFrame(gameLoop);
}

function getRandomColor() {
    const colors = ['#ff4444', '#ff8800', '#ffaa00', '#ff7700', '#ff5500'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Инициализация при загрузке страницы
window.addEventListener('load', () => {
    initDOMElements();
    detectDevice();
    
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
    
    if (cityCards) {
        cityCards.forEach(card => {
            card.addEventListener('click', () => {
                cityCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                currentCity = card.dataset.city;
                if (startButton) startButton.disabled = false;
                console.log('Выбран город:', currentCity); // Для отладки
            });
        });
    }
    
    updatePlayerCounts();
    setInterval(updatePlayerCounts, 5000);
});

// Обработка изменения размера
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
    if (e.target === gameCanvas || e.target.classList.contains('action-button') || 
        e.target === movementJoystick || e.target === aimJoystick) {
        e.preventDefault();
    }
}, { passive: false });