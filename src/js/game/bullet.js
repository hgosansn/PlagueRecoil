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
    debug,
    bodyHeight,
    bulletMovement,
    bodyWidth,
} from './variables.js';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player) {
        const bulletX =
            player.body.x +
            (player.flipX
                ? -1 * bodyWidth * 0.6
                : player.body.width + bodyWidth * 0.6);
        const bulletY = player.body.y + bodyHeight * 0.4;
        super(scene, bulletX, bulletY, 'bullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;

        this.setDepth(1);
        this.setOrigin(0.5, 0.5);
        this.setScale(0.4);
        this.refreshBody();
        this.body.immovable = true;

        this.body.setAllowGravity(false);

        this.targets = scene.targets;
        if (bulletMovement) {
            if (player.flipX) {
                this.setVelocityX(-1 * bulletSpeed);
                this.flipX = true;
            } else {
                this.setVelocityX(1 * bulletSpeed);
                this.flipX = false;
            }
        }

        // Enable world bounds collision
        this.setCollideWorldBounds(true);

        // Event listener for when the bullet hits the world bounds
        this.body.onWorldBounds = true;
        // Assumes 'player' is your player sprite. Adjust x and y as neede d.
        this.worldBoundsCallback = this.handleWorldBoundsCollision.bind(this);
        this.scene.physics.world.on('worldbounds', this.worldBoundsCallback);

        this.scene.physics.add.collider(this, this.targets, this.onBulletHit);
    }

    destroy() {
        if (this.body && this.body.world) {
            this.body.world.off('worldbounds', this.worldBoundsCallback);
        }
        super.destroy();
    }

    onBulletHitTarget(target) {
        const offsetX = 25;
        const explosion = this.scene.add.sprite(
            this.x + (this.scene.player.flipX ? -offsetX : offsetX),
            this.y,
            'explosion'
        );

        explosion.flipX = this.scene.player.flipX;

        explosion.play('explode');
        console.log('bullet hit', {
            target,
            bullet: this,
        });
        this.destroy();
    }

    createBulletAnimations() {
        this.anims.create({
            key: 'bullet1',
            frames: this.anims.generateFrameNumbers('bullet1', {
                start: 0,
                end: 9,
            }),
            frameRate: 20,
            hideOnComplete: true,
        });
    }

    // Function to handle collision with world bounds
    handleWorldBoundsCollision(body) {
        this.destroy();
    }
    // ... additional bullet methods ...
}
