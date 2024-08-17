export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }
    preload() {
        // Load assets like images and audio here
        this.load.image('walk1', './assets/game/char1.png');
        this.load.image('walk2', './assets/game/char2.png');
        this.load.image('walk3', './assets/game/char3.png');
        this.load.image('jump1', './assets/game/jump1.png');
        this.load.image('jump2', './assets/game/jump2.png');
        this.load.image('jump3', './assets/game/jump3.png');

        this.load.image('background1', './assets/game/background3.png');

        this.load.image('bullet1', './assets/game/bullet.png');
        this.load.image('zombie', './assets/game/zombie.png');
        this.load.image('zombie1', './assets/game/zombie1.png');
        this.load.image('zombie2', './assets/game/zombie2.png');
        this.load.image('zombie3', './assets/game/zombie3.png');
        this.load.image('fire1', './assets/game/fire1.png');
        this.load.image('fire2', './assets/game/fire2.png');
        this.load.image('fire3', './assets/game/fire3.png');
        this.load.spritesheet('explosion', './assets/game/explosion1.png', {
            frameWidth: 30,
            frameHeight: 30,
        });
        this.load.spritesheet('floor', './assets/game/floor1.png', {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet('bullet', './assets/game/bullet.png', {
            frameWidth: 30,
            frameHeight: 30,
        });

        this.load.spritesheet('levelup', './assets/game/levelup.png', {
            frameWidth: 30,
            frameHeight: 30,
            margin: 1,
            spacing: 1,
        });
    }
    create() {
        this.scene.start('game');
    }
}
