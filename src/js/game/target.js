import {
    gameWidth,
    gameHeight,
    backgroundWidth,
    backgroundHeight,
    floorSize,
    speed,
    gravity,
    bulletSpeed,
    jumpHeight,
    showPlatforms,
    zombieSpeed,
} from './variables.js';
import AbstractCharacter from './defaultCharacter.js';

export default class Target extends AbstractCharacter {
    near = false;

    constructor(scene, x, y) {
        super(scene, x, y, 'zombie');

        // Physics properties
        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        scene.physics.add.collider(this, scene.platforms);

        this.createPlayerAnimations();
    }

    createPlayerAnimations() {
        this.anims.create({
            key: 'zombieWalk',
            frames: [
                { key: 'zombie2' },
                { key: 'zombie3' },
                { key: 'zombie1' },
                // Include more frames
            ],
            frameRate: 5,
            repeat: -1, // Loop the animation
        });
        this.anims.create({
            key: 'idle',
            frames: [
                { key: 'zombie' },
                // Include more frames
            ],
            frameRate: 5,
            repeat: 0, // Loop the animation
        });
        this.anims.play('zombieWalk', true);
    }

    // Method to be called when the target is hit
    hit(callback = () => {}) {
        this.anims.stop();
        this.setVelocityX(0);
        const anim = this.anims.play('idle', true);

        anim.on('animationcomplete', () => {
            this.destroy();
            callback();
        });
    }

    idle() {
        if (!this.near) {
            this.anims.stop();
            this.anims.play('idle', true);
        }
        this.near = true;
    }

    update() {
        const distance = this.scene.player.x - this.x;
        this.anims.play('zombieWalk', true);
        if (distance > 0) {
            this.setVelocityX(zombieSpeed);
            this.flipX = true;
        } else {
            this.setVelocityX(-zombieSpeed);
            this.flipX = false;
        }
    }
}
