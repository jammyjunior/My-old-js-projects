let scene;

let background;
let bgSpeed = 0.5;

let player;
let playerProjectiles;

// Task 2: Decrease speed of bullet
// TODO
let bulletSpeed = 450;

let enemies;
let enemyProjectiles;
let enemySpacing = 80;
let enemyOffsetX = 56;

let elapseTime = 0;
let explosions;

let keyUp;
let keyDown;
let keyLeft;
let keyRight;
let keyFire;

let gameOver = false;

let score = 0;
let popupContainer;
let popupWnd;
let btnRetry;
let missionFailedTitle;
let scoreTxt;
let HUDtext;

// Task 3: Add the max energy variable for each enemy = 2 
// TODO

// TODO - Task 4: Add the user guide screen when type H

function preload() {
    scene = this;
    scene.load.image("bg", "resources/desertBG.png");
    scene.load.spritesheet("player", "resources/player-ship.png", { frameWidth: 16, frameHeight: 24 });
    // Task 1: Update character image & animation
    // TODO
    
    scene.load.spritesheet("playerBullet", "resources/player-bullet.png", { frameWidth: 5, frameHeight: 13 });
    scene.load.spritesheet("enemy", "resources/enemy-ship.png", { frameWidth: 32, frameHeight: 16 });
    scene.load.spritesheet("enemyBullet", "resources/enemy-bullet.png", { frameWidth: 5, frameHeight: 5 });
    scene.load.spritesheet("explosion", "resources/explosion-sprite.png", { frameWidth: 16, frameHeight: 16 });
    scene.load.image("popupWnd", "resources/popupWnd.png");
    scene.load.image("btnRetry", "resources/btnRetry.png");
    
    // TODO - Task 4: Add the user guide screen when type H
}

function create() {
    // background
    createBackground();

    // animations
    createAnimation();

    // groups
    playerProjectiles = scene.add.group();
    enemies = scene.add.group();
    enemyProjectiles = scene.add.group();
    explosions = scene.add.group();

    // player
    createPlayer();

    // Enemies
    createEnemies();

    // explosion effect
    createVFX();

    // popup window
    createPopupWindow();

    HUDtext = scene.add.text(10, 10, 'Score: ' + score);
    
    // check for collisions
	scene.physics.add.overlap(enemies, playerProjectiles, defeatEnemies);
	scene.physics.add.overlap(player, enemies, playerLoses);
	scene.physics.add.overlap(player, enemyProjectiles, playerLoses);

    // game controls
    keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
	keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
	keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
	keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
	keyFire = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // TODO - Task 4: Add the user guide screen when type H
}

function createBackground() {
    background = scene.add.tileSprite(0,0,800,600, 'bg');
    background.setScale(2);
    background.setOrigin(0,0);
}

function createAnimation() {
    // player animation
    scene.anims.create({
        key: 'forward',
        frames: scene.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
        frameRate: 12,
        repeat: -1
    });
    // Task 1: Update character image & animation
    // TODO
    
    // bullet animation
    scene.anims.create({
        key: "bullet_anim",
        frames: scene.anims.generateFrameNumbers("playerBullet", { start: 0, end: 1 }),
        frameRate: 12,
        repeat: -1
    });

    // enemy animation
    scene.anims.create({
        key: "enemy_anim",
        frames: scene.anims.generateFrameNumbers("enemy", { start: 0, end: 1 }),
        frameRate: 12,
        repeat: -1
    });

    // enemy bullet animation
    scene.anims.create({
        key: "enemyBullet_anim",
        frames: scene.anims.generateFrameNumbers("enemyBullet", { start: 0, end: 1 }),
        frameRate: 12,
        repeat: -1
    });
}

function createPlayer() {
    player = scene.physics.add.sprite(256, 600, "player");
    player.setScale(1.5);
	player.setCollideWorldBounds(true);
    player.anims.play("forward");
}

function createEnemies() {
    // create enemies
    for (let i = 0; i < 6; i++) {
        let enemy = scene.physics.add.sprite(0, 100, "enemy");
        enemy.x = enemyOffsetX + (i * enemySpacing);
        enemy.y = 0;
        enemy.depth = 0;
        enemy.setScale(1.2);
        enemy.startX = enemy.x;
        enemy.speedY = (Math.random() * 2) + 0.5;
        scene.physics.world.enableBody(enemy);
        enemy.anims.play("enemy_anim");
      	
      	// setup fireInterval
	    enemy.fireInterval = (Math.random() * 3000) + 1500;
        // Task 2: Decrease speed of bullet
        // TODO
		
        // console.log(enemy.fireInterval);
		enemy.timedEvent = scene.time.addEvent({
			delay: enemy.fireInterval,
			args: [enemy],
			callback: enemyFire,
			callbackScope: scene,
			repeat: -1
		});
        // Task 3: Add the max energy for each enemy = 2 
        // TODO
        
        enemies.add(enemy);
    }
}

function createPopupWindow() {
    popupContainer = scene.add.container();
    popupContainer.x = 256;
    popupContainer.y = 350;
    popupWnd = scene.add.sprite(0, 0, "popupWnd");
    popupContainer.add(popupWnd);
    btnRetry = scene.add.sprite(0, 30, "btnRetry");
    btnRetry.setInteractive({ useHandCursor: true  });
    popupContainer.add(btnRetry);
    scene.input.on("gameobjectdown", handleClick);

    let textConfig = { fontSize:'18px', color:'#d2d2d2', fontFamily: 'Arial' };
    missionFailedTitle = scene.add.text(-57, -51, 'Mission Failed', textConfig);
    popupContainer.add(missionFailedTitle);
    
    textConfig = { fontSize:'14px', color:'#d2d2d2', fontFamily: 'Arial' };
    scoreTxt = scene.add.text(-22, -19, '0', textConfig);
    popupContainer.add(scoreTxt);

    popupContainer.visible = false;
    popupContainer.depth = 100;
}

function handleClick(pointer, gameObject) {
    if (gameObject == btnRetry) {
        retryGame();
    }
}
    
function update() {
    if (!gameOver) {
        // animate background image
        background.tilePositionY -= bgSpeed; 

        // update player
		updatePlayer();
      
      	// update enemies
        updateEnemies();
        
        elapseTime += 0.02;
    }
}

function updatePlayer() {
    // horizontal control
	if (keyLeft.isDown) {
		player.setVelocityX(-160);
	}
	else if (keyRight.isDown) {
		player.setVelocityX(160);
	}
	else {
		player.setVelocityX(0);
	}

    // vertical control
	if (keyUp.isDown) {
		player.setVelocityY(-160);
	}
	else if (keyDown.isDown) {
		player.setVelocityY(160);
	}
	else {
		player.setVelocityY(0);
	}
    
    // check for firing bullets
	if (Phaser.Input.Keyboard.JustDown(keyFire)) {
		fire();
	}

    // check for out of screen bullet, then delete it
    for (let i = 0; i < playerProjectiles.getChildren().length; i++) {
        let bullet = playerProjectiles.getChildren()[i];
        if (bullet.y < -16) {
            bullet.destroy();
        }
    }
    
    // TODO - Task 4: Add the user guide screen when type H
}

function updateEnemies() {
    // updateEnemies
    for (let i = 0; i < enemies.getChildren().length; i++) {
        let enemy = enemies.getChildren()[i];
        enemy.x = enemy.startX + (Math.sin(elapseTime) * 32);
        enemy.y += enemy.speedY;

        if (enemy.y > config.height) {
            enemy.speedY = (Math.random() * 2) + 0.5;
            enemy.y = 0;
        }
    }

    // check for out of screen enemy's bullets, then delete it
    for (let i = 0; i < enemyProjectiles.getChildren().length; i++) {
        let bullet = enemyProjectiles.getChildren()[i];
        if (bullet.y > game.config.height) {
            bullet.destroy();
        }
    }
}

function createVFX() {
    // explosion
    scene.anims.create({
        key: "explosion_anim",
        frames: scene.anims.generateFrameNumbers("explosion", { start: 0, end: 4 }),
        frameRate: 18,
        repeat: 0
    });
}

function fire() {
    let bullet = scene.physics.add.sprite(player.x, player.y-20, "playerBullet");
    bullet.anims.play("bullet_anim");
    scene.physics.world.enableBody(bullet);
    bullet.body.velocity.y = -bulletSpeed;
    bullet.setScale(1.5);

    playerProjectiles.add(bullet);
}

function defeatEnemies(enemy, bullet) {
    score++;
    HUDtext.text = "Score: " + score;
    scoreTxt.text = score;
    
    // Task 3: Check energy of enemy = 1 than add explosion & reset energy for new enemy
    // TODO
    
    // add explosion
    let explosion = scene.add.sprite(bullet.x, bullet.y, "explosion");
    explosion.anims.play("explosion_anim");
    explosion.setScale(2.5);
    explosions.add(explosion);
    explosion.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, destroyExplosion);

    bullet.destroy();

    // reset enemy
    enemy.y = -30 ;
    enemy.speedY = (Math.random() * 2) + 0.5;
}

function enemyFire(enemy) {
    if (enemy.active) {
        let bullet = scene.physics.add.sprite(enemy.x, enemy.y, "enemyBullet");
        bullet.anims.play("enemyBullet_anim");
        scene.physics.world.enableBody(bullet);
        bullet.body.velocity.y = bulletSpeed;
        bullet.setScale(1.5);
    
        enemyProjectiles.add(bullet);
    }
}

function playerLoses(player, bullet) {
    let explosion = scene.add.sprite(player.x, player.y, "explosion");
    explosion.anims.play("explosion_anim");
    explosion.setScale(2.5);
    explosions.add(explosion);
    explosion.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, destroyExplosion);
    
    bullet.destroy();

    gameOver = true;
    pauseGame();
}

function destroyExplosion(anim, texture, sprite) {
    sprite.destroy(); 
}

function pauseGame() {
    popupContainer.visible = true;

    scoreTxt.text = score;

    // stop player
    player.setVelocityX(0);
    player.setVelocityY(0);
    player.visible = false;

    // stop enemies fire
    for (let i = enemies.getChildren().length - 1; i >= 0; i--) {
        let enemy = enemies.getChildren()[i];
    }
}

function retryGame() {
    // destroy enemies
    for (let i = enemies.getChildren().length - 1; i >= 0; i--) {
        let enemy = enemies.getChildren()[i];
        enemy.destroy();
    }
    
    // reset player
    player.x = 256;
    player.y = 600;
    player.visible = true;

    // reset enemies
    createEnemies();

    score = 0;

    gameOver = false;
    popupContainer.visible = false;
}


let config = {
    type: Phaser.AUTO,
    width: 512,
    height: 720,
    parent: "gameContainer",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

let game = new Phaser.Game(config); 