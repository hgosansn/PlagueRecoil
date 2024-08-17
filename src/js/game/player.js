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
} from './variables.js';

import Bullet from './bullet.js';
import AbstractCharacter from './defaultCharacter.js';

// Player.js
export default class Player extends AbstractCharacter {
    shots = [
        /* {target: , time: 0 } */
    ];

    constructor(scene, x, y) {
        super(scene, x, y, 'walk1');

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        scene.physics.add.collider(this, scene.platforms);
        scene.physics.add.collider(
            this,
            scene.targets,
            this.onZombieBounce,
            null,
            this
        );

        this.scene = scene;
        this.createPlayerAnimations();
        this.initPlayerControls();
    }

    createPlayerAnimations() {
        // Define this animations here (e.g., walking, jumping)
        // this.scene.anims.create({ ... });

        // Create this sprite
        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'walk1' },
                { key: 'walk2' },
                { key: 'walk3' },
                // Include more frames
            ],
            frameRate: 10,
            repeat: -1, // Loop the animation
        });
        this.anims.create({
            key: 'jump',
            frames: [
                { key: 'jump1' },
                { key: 'jump2' },
                { key: 'jump3' },
                // Include more frames
            ],
            frameRate: 5,
            repeat: 1, // Loop the animation
        });
        this.anims.create({
            key: 'fire',
            frames: [
                { key: 'fire1' },
                { key: 'fire2' },
                { key: 'fire3' },
                { key: 'walk3' },
                // Include more frames
            ],
            frameRate: 10,
            repeat: 0, // Loop the animation
        });
    }

    initPlayerControls() {
        // Initialize this controls here
        this.scene.input.keyboard.on('keydown-SPACE', this.fireBullet, this);
        this.scene.input.keyboard.on('keydown-ARROW-UP', this.fireBullet, this);
        this.initAutoAim();
    }

    // Player abilities
    // TO DO Punch animation
    // TO DO High Kick animation

    hit() {
        this.anims.stop();
        this.scene.gameOver();
    }

    fireBullet() {
        var bullet = new Bullet(this.scene, this);
        this.scene.bullets.push(bullet);
        const anim = this.anims.play('fire', true);
        this.firing = true;
        this.setVelocityX(0);
        anim.on('animationcomplete', () => {
            this.firing = false;
        });
        return bullet;
    }

    onZombieBounce(player, zombie) {
        if (player.body.touching.down && zombie.body.touching.up) {
            console.log('onZombieHit');
            zombie.hit();
            this.jumpAnimation();
            player.setVelocityY(-1 * jumpHeight);
        } else {
            this.hit();
            zombie.idle();
        }
    }

    initAutoAim() {
        this.scene.time.addEvent({
            delay: 300, // Auto Fire
            callback: this.autoFireGun,
            callbackScope: this,
            loop: true,
        });
    }

    autoFireGun() {
        this.scene.targets.forEach((target) => {
            if (this.isTargetClose(this, target) && this.isOnTheFloor()) {
                // Play idle animation
                const dist = this.x - target.x;
                if (dist > 0) {
                    this.flipX = true;
                } else {
                    this.flipX = false;
                }
                const now = new Date().getTime();
                const i = this.shots.findIndex((s) => s.target === target);
                const s = this.shots[i];
                // Not in the bullet list
                if (i < 0) {
                    this.shots.push({ target, time: now });
                    const bullet = this.fireBullet();
                    this.scene.bullets.push(bullet);
                } else {
                    const diff = Math.abs(now - s.time);
                    // Remove the target from the list
                    if (diff > 100) {
                        this.shots.splice(i, 1, { target, time: now });
                        const bullet = this.fireBullet();
                        this.scene.bullets.push(bullet);
                    }
                }
            }
        });
    }

    jumpAnimation() {
        const explosion = this.scene.add.sprite(this.x, this.y + 80, 'levelup');
        explosion.play('levelhit');
    }

    isTargetClose(bot, target) {
        const firingRange = Phaser.Math.Between(0, 300); // Pixels within which the bot will fire
        return Math.abs(bot.x - target.x) < firingRange;
    }

    hit() {
        this.anims.stop();
        this.scene.gameOver();
    }

    update() {
        // Player movement and animation logic here
        if (this.scene.cursors.left.isDown) {
            this.setVelocityX(-speed);
            this.flipX = true;
            // Move left
        } else if (this.scene.cursors.right.isDown) {
            // Move right
            this.setVelocityX(speed);
            this.flipX = false;
        } else {
            // Stand still
            this.setVelocityX(0);
        }

        // Animation logic
        if (this.isOnTheFloor() && !this.intro) {
            this.setVelocityY(0);

            if (this.body.velocity.x != 0) {
                this.anims.play('walk', true); // Play walking animation
            } else if (!this.firing) {
                this.anims.stop(); // Stop animation if this is not moving
            }
            // Check if the player is on the ground before allowing upward movement
            if (this.scene.cursors.up.isDown) {
                this.setVelocityY(-(0.1 * gravity + jumpHeight));
                this.jumpAnimation();
            }
        } else {
            this.anims.play('jump', true); // Play jumping animation when in air
        }
    }

    isOnTheFloor() {
        return this.body.touching.down || this.body.onFloor();
    }
}
