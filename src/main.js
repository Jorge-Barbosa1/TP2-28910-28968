
/*////////////////////////////////////////////////////////////////////
                        LEVEL 1 
////////////////////////////////////////////////////////////////////*/
let deaths = 0;

class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
        
    }

    preload() {
        this.load.tilemapTiledJSON('map1', 'assets/map1.tmj');
        this.load.image('tileset', 'assets/tileset.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 275, frameHeight: 550 });
        this.load.image('obstacle1', 'assets/obstacle1.png');
        this.load.image('obstacle2', 'assets/obstacle2.png');
        this.load.audio('hitSound', 'assets/Sounds/hit.wav');
        this.load.audio('backgroundMusic', 'assets/Sounds/soundtrack.wav');
    }

    create() {
        // Adicionar as teclas
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Adicionar o mapa
        const map = this.make.tilemap({ key: 'map1' });
        const tileset = map.addTilesetImage('Map1', 'tileset');

        map.createLayer('BackGround', tileset, 0, 0);
        this.groundLayer = map.createLayer('Ground', tileset, 0, 0);
        this.groundLayer.setCollisionBetween(1, 1000);

        // Adicionar o jogador
        this.player = this.physics.add.sprite(50, 1000, 'player').setScale(0.25);
        this.player.setCollideWorldBounds(true);

        // Adicionar colisão entre o jogador e o chão
        this.physics.add.collider(this.player, this.groundLayer);
        
        // Adicionar obstáculos
        this.obstacles = this.physics.add.group();
        const obstacle1 = this.obstacles.create(400, 1000, 'obstacle2').setScale(0.11).setImmovable();
        const obstacle2 = this.obstacles.create(800, 1000, 'obstacle2').setScale(0.11).setImmovable(); //mudar para 0.13
        obstacle1.setVisible(false);
        obstacle2.setVisible(false);
        this.physics.add.collider(obstacle1, this.groundLayer);
        this.physics.add.collider(obstacle2, this.groundLayer);

        // Colisão entre o jogador e os obstáculos
        this.physics.add.collider(this.player, this.obstacles, this.hitsObstacle, null, this);

        // Definir a animação do jogador a correr
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // Definir a animação do jogador parado
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 10,
            repeat: -1
        });

        // Definir a animação do jogador a saltar
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.player.anims.play('idle');

        this.deathsTxt = this.add.text(20, 20, 'Deaths: ' + deaths, { fontSize: '32px', fill: '#fff' });

        //Musica de fundo
        this.backgroundMusic = this.sound.add('backgroundMusic');
        this.backgroundMusic.play({ loop: true});
    }

    update() {
        // Movimentação do player
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.flipX = true; // Flip the sprite to the left
            if (this.player.anims.currentAnim.key !== 'run') {
                this.player.anims.play('run');
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.flipX = false;
            if (this.player.anims.currentAnim.key !== 'run') {
                this.player.anims.play('run');
            }
        } else {
            this.player.setVelocityX(0);
            if (this.player.anims.currentAnim.key !== 'idle') {
                this.player.anims.play('idle');
            }
        }

        // Salto do player
        if (Phaser.Input.Keyboard.JustDown(this.jumpkey) && this.player.body.blocked.down) {
            this.player.setVelocityY(-300);
            if (this.player.anims.currentAnim.key !== 'jump') {
                this.player.anims.play('jump');
            }
        }

        // Tornar obstáculos visíveis quando o jogador passar por eles
        this.obstacles.getChildren().forEach(function(obstacle) {
            if (this.player.x > obstacle.x - 300 / 2 && !obstacle.visible) {
                obstacle.setVisible(true);
            }
        }, this);

        if (this.restartKey.isDown) {
            this.restartGame();
        }

        // Verifica se o jogador atingiu o fim do nível
        if (this.player.x > 1040) {
            this.nextLevel();
        }
    }

    hitsObstacle(player, obstacle) {
        deaths += 1;
        this.deathsTxt.setText('Deaths: ' + deaths );
        this.sound.play('hitSound');
        
        this.resetPlayer();
    }

    nextLevel() {
        //console.log("Next Level");
        this.scene.start('Level2'); // Transição para o segundo nível
    }

    resetPlayer() {
        this.player.setPosition(50, 1000);
        this.player.setVelocity(0, 0);
        this.player.anims.play('idle', true);
    }

    restartGame() {
        deaths = 0;
        this.scene.restart();
    }

}

/*////////////////////////////////////////////////////////////////////
                        //LEVEL 2 
////////////////////////////////////////////////////////////////////*/

class Level2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2' });
    }

    preload() {
        //console.log("2_Level 2 created");
        this.load.tilemapTiledJSON('map1', 'assets/map1.tmj');
        this.load.image('tileset', 'assets/tileset.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 270, frameHeight: 550 });
        this.load.image('obstacle2', 'assets/obstacle2.png');
        this.load.audio('hitSound', 'assets/Sounds/hit.wav');
        this.load.audio('backgroundMusic', 'assets/Sounds/soundtrack.wav');
    }

    create() {
        console.log("Level 2 created");

        // Adicionar as teclas
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Adicionar o mapa
        const map = this.make.tilemap({ key: 'map1' });
        const tileset = map.addTilesetImage('Map1', 'tileset'); 

        map.createLayer('BackGround', tileset, 0, 0);
        this.groundLayer = map.createLayer('Ground', tileset, 0, 0);
        this.groundLayer.setCollisionBetween(1, 1000);

        // Adicionar o jogador
        this.player = this.physics.add.sprite(50, 1000, 'player').setScale(0.25);
        this.player.setCollideWorldBounds(true);

        // Adicionar obstáculos
        this.physics.add.collider(this.player, this.groundLayer);// Adicionar colisão entre o jogador e o chão
        this.obstacles = this.physics.add.group();
        const obstacle1 = this.obstacles.create(200, 100, 'obstacle2').setScale(0.30).setImmovable(true);
        const obstacle2 = this.obstacles.create(200, 1000, 'obstacle2').setScale(0.12).setImmovable(true);
        const obstacle3 = this.obstacles.create(500, 100, 'obstacle2').setScale(0.30).setImmovable(true);
        const obstacle4 = this.obstacles.create(800, 100, 'obstacle2').setScale(0.30).setImmovable(true);
        const obstacle5 = this.obstacles.create(700, 1000, 'obstacle2').setScale(0.12).setImmovable(true);
        
        obstacle1.setVisible(false);
        obstacle3.setVisible(false);
        obstacle4.setVisible(false);
        obstacle5.setVisible(false);

        // Inicialmente, os obstáculos são fixos
        obstacle1.body.moves = false;
        obstacle3.body.moves = false;
        obstacle4.body.moves = false;
        obstacle5.body.moves = false;
        
        //this.physics.add.collider(obstacle1, this.groundLayer);
        this.physics.add.collider(obstacle2, this.groundLayer);
        this.physics.add.collider(obstacle5, this.groundLayer);
        // Colisão entre o jogador e os obstáculos
        this.physics.add.collider(this.player, this.obstacles,this.hitsObstacle, null, this);

        // Definir a animação do jogador a correr
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // Definir a animação do jogador parado
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 10,
            repeat: -1
        });

        // Definir a animação do jogador a saltar
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.player.anims.play('idle');

        this.deathsTxt = this.add.text(20, 20, 'Deaths: ' + deaths, { fontSize: '32px', fill: '#fff' });
        
    }

    update() {
        // Movimentação do player
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.flipX = true; 
            if (this.player.anims.currentAnim.key !== 'run') {
                this.player.anims.play('run');
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.flipX = false;
            if (this.player.anims.currentAnim.key !== 'run') {
                this.player.anims.play('run');
            }
        } else {
            this.player.setVelocityX(0);
            if (this.player.anims.currentAnim.key !== 'idle') {
                this.player.anims.play('idle');
            }
        }

        // Salto do player
        if (Phaser.Input.Keyboard.JustDown(this.jumpkey) && this.player.body.blocked.down) {
            this.player.setVelocityY(-300);
            if (this.player.anims.currentAnim.key !== 'jump') {
                this.player.anims.play('jump');
            }
        }

        // Tornar obstáculos visíveis quando o jogador passar por eles
        this.obstacles.getChildren().forEach(function(obstacle) {
            if (this.player.x > obstacle.x - 300 / 2 && !obstacle.visible && !obstacle.body.moves) {
                obstacle.body.moves = true;
                obstacle.setGravityY(1000);
                obstacle.setVisible(true);
            }
        }, this);

        if (this.restartKey.isDown) {
            this.restartGame();
        }

        // Verifica se o jogador atingiu o fim do nível
        if (this.player.x > 1040) {
            this.nextLevel();
        }
    }

    hitsObstacle(player, obstacle) {
        deaths += 1;
        this.deathsTxt.setText('Deaths: ' + deaths);
        this.sound.play('hitSound');
        this.resetPlayer();
    }

    restartGame() {
        deaths = 0;
        this.scene.start("Level1");
    }
    
    resetPlayer() {
        this.scene.restart();
    }
    
    nextLevel() {
        console.log("Next Level");
        this.scene.start('Level3');
    }
}
    

/*////////////////////////////////////////////////////////////////////
                        LEVEL 3
////////////////////////////////////////////////////////////////////*/

class Level3 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3' });
    }

    preload() {
        this.load.tilemapTiledJSON('map1', 'assets/map1.tmj');
        this.load.image('tileset', 'assets/tileset.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 270, frameHeight: 550 });
        this.load.image('obstacle2', 'assets/obstacle2.png');
        this.load.image('cannon', 'assets/cannon.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.audio('hitSound', 'assets/Sounds/hit.wav');
        this.load.audio('backgroundMusic', 'assets/Sounds/soundtrack.wav');
    }

    create() {
        console.log("Level 3 created");

        // Adicionar as teclas
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Adicionar o mapa
        const map = this.make.tilemap({ key: 'map1' });
        const tileset = map.addTilesetImage('Map1', 'tileset');

        map.createLayer('BackGround', tileset, 0, 0);
        this.groundLayer = map.createLayer('Ground', tileset, 0, 0);
        this.groundLayer.setCollisionBetween(1, 1000);

        // Adicionar o jogador
        this.player = this.physics.add.sprite(50, 1000, 'player').setScale(0.25);
        this.player.setCollideWorldBounds(true);

        // Adicionar obstáculos
        this.physics.add.collider(this.player, this.groundLayer);// Adicionar colisão entre o jogador e o chão
        this.obstacles = this.physics.add.group();
        const obstacle1 = this.obstacles.create(200, 100, 'obstacle2').setScale(0.30).setImmovable(true);
        const obstacle2 = this.obstacles.create(200, 1000, 'obstacle2').setScale(0.12).setImmovable(true);
        const obstacle4 = this.obstacles.create(1000, 100, 'obstacle2').setScale(0.30).setImmovable(true);
        const obstacle5 = this.obstacles.create(700, 1000, 'obstacle2').setScale(0.12).setImmovable(true);
        const obstacle6 = this.obstacles.create(960, 1000, 'obstacle2').setScale(0.12).setImmovable(true);
        
        obstacle1.setVisible(false);
        obstacle4.setVisible(false);
        obstacle6.setVisible(false);

        // Inicialmente, os obstáculos são fixos
        obstacle1.body.moves = false;
        obstacle4.body.moves = false;
        obstacle6.body.moves = false;

        this.physics.add.collider(obstacle2, this.groundLayer);
        this.physics.add.collider(obstacle5, this.groundLayer);
        this.physics.add.collider(obstacle6, this.groundLayer);
        this.physics.add.collider(this.player, this.obstacles, this.hitsObstacle, null, this);// Colisão entre o jogador e os obstáculos

        // Adicionar o canhão
        this.cannon = this.physics.add.sprite(800, 1000, 'cannon').setScale(0.1);
        this.cannon.setImmovable(true);
        this.cannon.flipX = true; 
        this.cannon.setCollideWorldBounds(true);
        this.physics.add.collider(this.cannon, this.groundLayer);
        this.physics.add.collider(this.player,this.cannon);
        
        // Colisão entre o jogador e os obstáculos
        this.physics.add.collider(this.player, this.obstacles,this.hitsObstacle, null, this);

        // Adicionar as balas
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });

        this.time.addEvent({
            delay: 2000, // Dispara uma bala a cada 2 segundos
            callback: this.shootBullet,
            callbackScope: this,
            loop: true
        });

        // Adicionar colisão entre as balas e o jogador
        this.physics.add.collider(this.player, this.bullets, this.hitsObstacle, null, this);

        // Definir a animação do jogador a correr
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // Definir a animação do jogador parado
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 10,
            repeat: -1
        });

        // Definir a animação do jogador a saltar
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.player.anims.play('idle');
        
        this.deathsTxt = this.add.text(20, 20, 'Deaths: ' + deaths, { fontSize: '32px', fill: '#fff' });

        this.EndText = this.add.text(540, 640, '', { fontSize: '32px', fill: '#00ff00' }).setOrigin(0.5);
        this.deathCountTxt = this.add.text(540, 680, '', { fontSize: '32px', fill: '#00ff00' }).setOrigin(0.5);
    }

    update() {
        // Movimentação do player
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.flipX = true; 
            if (this.player.anims.currentAnim.key !== 'run') {
                this.player.anims.play('run');
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.flipX = false;
            if (this.player.anims.currentAnim.key !== 'run') {
                this.player.anims.play('run');
            }
        } else {
            this.player.setVelocityX(0);
            if (this.player.anims.currentAnim.key !== 'idle') {
                this.player.anims.play('idle');
            }
        }

        // Salto do player
        if (Phaser.Input.Keyboard.JustDown(this.jumpkey) && this.player.body.blocked.down) {
            this.player.setVelocityY(-300);
            if (this.player.anims.currentAnim.key !== 'jump') {
                this.player.anims.play('jump');
            }
        }

        // Tornar obstáculos visíveis quando o jogador passar por eles
        this.obstacles.getChildren().forEach(function(obstacle) {
            if (this.player.x > obstacle.x - 300 / 2 && !obstacle.visible && !obstacle.body.moves) {
                obstacle.body.moves = true;
                obstacle.setGravityY(1000);
                obstacle.setVisible(true);
            }
        }, this);

        if (this.restartKey.isDown) {
            this.restartGame();
        }

        // Verifica se o jogador atingiu o fim do nível
        if (this.player.x > 1040) {
            this.scene.pause();
            this.EndText.setText('Congratulations! You have completed the game!');
            this.deathCountTxt.setText('With: ' + deaths + ' deaths');}
    }
    
    shootBullet() {
        const bullet = this.bullets.get(this.cannon.x, this.cannon.y);

        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setScale(0.3);
            bullet.body.allowGravity = false;//Disparar sempre reto
            bullet.body.velocity.x = -500; // Velocidade da bala
            bullet.angle = 90;
            bullet.flipX = true;
            bullet.flipY = true;
            bullet.setCollideWorldBounds(true);
            bullet.body.onWorldBounds = true;


            bullet.body.world.on('worldbounds', function(body) {
                if (body.gameObject === bullet) {
                    bullet.setActive(false);
                    bullet.setVisible(false);
                }
            });
        }
    }

    hitsObstacle(player, obstacle) {
        deaths += 1;
        this.deathsTxt.setText('Deaths: ' + deaths);
        this.sound.play('hitSound');
        this.resetPlayer();
    }

    resetPlayer() {
        this.scene.restart();
    }
    restartGame() {
        deaths = 0;
        this.scene.start("Level1");
    }
}


/*////////////////////////////////////////////////////////////////////
                            CONFIG
////////////////////////////////////////////////////////////////////*/

const gameConfig = {
    type: Phaser.AUTO,
    width: 1080,
    height: 1280,
    scene: [Level1, Level2,Level3], //Level1, Level2,
        physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    }
};

const game = new Phaser.Game(gameConfig);