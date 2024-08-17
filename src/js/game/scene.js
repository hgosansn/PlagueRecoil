// MainScene.js
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
    spawnMoreTargets,
    bodyWidth,
    bodyHeight,
} from './variables.js';
import Target from './target.js';
import Player from './player.js';

function createPlatform(platforms, x, y, displayWidth, displayHeight) {
    let platform = platforms.create(x, y, null);
    platform.setOrigin(0, 0);
    platform.setVisible(showPlatforms);
    platform.displayWidth = displayWidth;
    platform.displayHeight = displayHeight;
    platform.body.immovable = true;
    platform.body.allowGravity = false;
    platform.refreshBody();
    return platform;
}

const spawnLoacations = [
    { x: bodyWidth + floorSize, y: gameHeight - (bodyHeight + floorSize) },
    { x: gameWidth - (bodyWidth + floorSize), y: gameHeight / 3 },
];

export default class MainScene extends Phaser.Scene {
    cursors;
    background;
    player;
    targets = [];
    bullets = [];
    platforms = [];

    generationOffset = -gameWidth;

    constructor() {
        super('game');
        this.score = 0;
    }

    preload() {}

    create() {
        // Create your game world, sprites, etc., here

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 4,
            }),
            frameRate: 20,
            hideOnComplete: true,
        });

        this.anims.create({
            key: 'levelhit',
            frames: this.anims.generateFrameNumbers('levelup', {
                start: 0,
                end: 12,
                offset: 1,
            }),
            frameRate: 20,
            hideOnComplete: true,
        });
        this.platforms = this.physics.add.staticGroup();

        // WORLD BOUNDS
        // Floor
        const floor = createPlatform(
            this.platforms,
            0,
            gameHeight - floorSize,
            backgroundWidth,
            floorSize
        );
        const ceiling = createPlatform(
            this.platforms,
            0,
            0,
            backgroundWidth,
            floorSize
        );
        // Walls
        const wallHeight = backgroundHeight;
        const leftWall = createPlatform(
            this.platforms,
            0,
            0,
            floorSize,
            backgroundHeight
        );
        const rightWall = createPlatform(
            this.platforms,
            backgroundWidth - floorSize,
            0,
            floorSize,
            backgroundHeight
        );

        this.player = new Player(this, gameWidth / 2, gameHeight / 2, 'walk1');

        this.setWorldBoundsAroundPlayer(this.player);
        // this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setFollowOffset(0, gameHeight / 4.5);

        this.cursors = this.input.keyboard.createCursorKeys();

        // this.generationOffset = this.generateApageOFTiles(this.generationOffset);
        // this.generationOffset = this.generateApageOFTiles(this.generationOffset);

        // ZOMBIES
        this.spawnTarget(spawnLoacations[0]);
        this.spawnTarget(spawnLoacations[1]);

        // Call this method in the create() method to start spawning targets
        if (spawnMoreTargets) {
            this.time.addEvent({
                delay: 2000, // Spawn a target every 1000 milliseconds
                callback: this.spawnTargetRandomly,
                callbackScope: this,
                loop: true,
            });
        }

        // Overlay

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000',
        });
        this.scoreText.setScrollFactor(0);
    }

    onBulletHitTarget(target, bullet) {
        target.hit(); // Call the hit method on the target
        bullet.onBulletHitTarget(target); // Destroy the bullet
        // Remove the target from the targets array
        const index = this.targets.indexOf(target);
        this.targets.splice(index, 1);
        // Add points to the score
        this.addScore(1);
    }

    spawnTargetRandomly() {
        // Randomly select a spawn location
        const location =
            spawnLoacations[
                Math.round(Math.random() * (spawnLoacations.length - 1))
            ];
        this.spawnTarget(location);
    }

    spawnTarget(location) {
        // const x = initialX ?? (Phaser.Math.Between(0, 1) == 0 ? Phaser.Math.Between(0, this.cameras.main.x) : Phaser.Math.Between(0, this.cameras.main.x)); // Spawn off-screen to the right
        // const y = initialY ?? gameHeight / 2; // Spawn in the middle of the screen

        const target = new Target(this, location.x, location.y);
        this.targets.push(target);
        this.physics.add.collider(
            target,
            this.bullets,
            this.onBulletHitTarget,
            null,
            this
        );
    }

    addScore(points) {
        this.score += points; // Increment the score
        this.scoreText.setText('Score: ' + this.score); // Update the text
    }

    gameOver() {
        this.anims.pauseAll();
        this.physics.pause();
        this.input.keyboard.enabled = false;
        this.scene.pause();
        this.game.loop.pause();
        let gameOverText = this.add.text(
            this.cameras.main.midPoint.x,
            gameHeight / 4,
            'Game Over',
            { fontSize: '48px', fill: '#000' }
        );
        gameOverText.setOrigin(0.5, 0.5);
        console.log('Game Over');
    }

    /**
     *
     * @param {*} time
     * @param {*} delta
     */

    generateApageOFTiles(offset) {
        // Define the size of the tile grid

        const tileSize = 64;
        const distanceAroundPlayer = 200;
        const rows = Math.abs(gameHeight / tileSize);
        const cols = Math.abs(gameWidth / tileSize);
        let lastXposition = offset;
        // Loop to create tiles
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (y < 7) {
                    // Random obstacles spawning away from the player
                    // Fixed Y position
                    if (
                        y == 6 &&
                        Phaser.Math.Between(0, 1) == 0 &&
                        Math.abs(x * tileSize + offset - this.player.x) > 200
                    ) {
                        lastXposition = this.drawTile(
                            tileSize,
                            x,
                            y,
                            'floor',
                            Phaser.Math.Between(15, 16),
                            offset
                        );
                        this.spawnTarget(lastXposition - tileSize / 2, 200);
                    }
                    continue;
                }
                // pick a random tile in the floor sprite sheet
                if (y == 7) {
                    lastXposition = this.drawTile(
                        tileSize,
                        x,
                        y,
                        'floor',
                        Phaser.Math.Between(13, 14),
                        offset
                    );
                    continue;
                } else if (y == 8) {
                    lastXposition = this.drawTile(
                        tileSize,
                        x,
                        y,
                        'floor',
                        Phaser.Math.Between(0, 1),
                        offset
                    );
                    continue;
                }

                lastXposition = this.drawTile(
                    tileSize,
                    x,
                    y,
                    'floor',
                    Phaser.Math.Between(9, 11),
                    offset
                );
            }
        }
        return lastXposition;
    }

    drawTile(tileSize, x, y, texture, spriteIndex, offset) {
        const xPosition = x * tileSize + offset;
        let tileGraphic = this.add.graphics({ x: xPosition, y: y * tileSize });
        // Load texture
        texture = texture || 'floor';
        // Apply sprite texture
        tileGraphic.fillStyle(0xaaaaaa, 1); // Set color
        tileGraphic.fillRect(0, 0, tileSize, tileSize); // Draw a square

        // Add the graphic as a physics body
        let tile = this.platforms.create(
            tileGraphic.x,
            tileGraphic.y,
            texture,
            spriteIndex
        );
        tile.displayWidth = tileSize;
        0;
        tile.displayHeight = tileSize;
        tile.body.immovable = true;
        tile.setScrollFactor(1);
        tile.body.allowGravity = false;
        tile.refreshBody();

        tile.setImmovable(true);
        tile.body.checkCollision.none = false;

        // Clean up the graphics object
        tileGraphic.destroy();
        return xPosition + tileSize;
    }

    updateMinimap() {
        // Clear the previous frame's drawings
        this.minimap.clear();

        // Example: Draw a dot for each game object
        this.children.list.forEach((gameObject) => {
            if (gameObject.active) {
                let minimapX = gameObject.x * this.minimapScale;
                let minimapY = gameObject.y * this.minimapScale;

                // Draw a dot or a small sprite to represent the object
                this.minimapGraphics.fill(0xffffff, 1); // White dot, full opacity
                this.minimapGraphics.fillEllipse(minimapX, minimapY, 4, 4);
            }
        });
        this.minimap.draw(this.minimapGraphics);
    }

    update(time, delta) {
        this.setWorldBoundsAroundPlayer(this.player);
        this.removeOutOfBoundsObjects(this.targets);
        this.removeOutOfBoundsObjects(this.bullets);
        // this.removeOutOfBoundsObjects(this.platforms.children.entries);

        // Game loop logic goes here
        this.player.update();
        this.targets.forEach((e) => e.update());

        /*         if (Math.abs(this.generationOffset - this.player.x) < gameWidth) {
            this.generationOffset = this.generateApageOFTiles(this.generationOffset);
        }  */

        // this.updateMinimap();

        // Background movement
        /*         if (this.cursors.left.isDown) {
            this.background.tilePositionX -= 2; // Move background to right when player goes left
        } else if (this.cursors.right.isDown) {
            this.background.tilePositionX += 2; // Move background to left when player goes right
        } */
    }

    removeOutOfBoundsObjects(objects) {
        if (!objects || !objects.forEach) {
            return;
        }
        let count = 0;
        objects.forEach((object, index) => {
            if (this.isOutOfBounds(object)) {
                object.destroy(); // Remove the object
                objects.splice(index, 1); // Remove from the array
                count++;
            }
        });
        if (count > 0) {
            // console.log(`Destroyed ${count} objects`);
        }
    }

    isOutOfBounds(object) {
        const tolerance = gameWidth / 2; // How far off-screen an object can be before it is removed
        return (
            object.x < this.physics.world.bounds.left - tolerance ||
            object.x > this.physics.world.bounds.right + tolerance ||
            object.y < this.physics.world.bounds.top - tolerance ||
            object.y > this.physics.world.bounds.bottom + tolerance
        );
    }

    setWorldBoundsAroundPlayer(player) {
        const horizontalBuffer = gameWidth * 1.5; // Buffer distance on each side of the player horizontally
        const verticalBuffer = gameHeight * 3; // Buffer distance above and below the player vertically

        // Calculate new bounds
        const newBoundsLeft = player.x - horizontalBuffer;
        const newBoundsRight = player.x + horizontalBuffer;
        const newBoundsTop = player.y - verticalBuffer;
        const newBoundsBottom = player.y + verticalBuffer;

        // Update world bounds
        this.physics.world.bounds.setTo(
            newBoundsLeft,
            newBoundsTop,
            newBoundsRight - newBoundsLeft,
            newBoundsBottom - newBoundsTop
        );

        // Update camera bounds if needed
        this.cameras.main.setBounds(
            newBoundsLeft,
            newBoundsTop,
            newBoundsRight - newBoundsLeft,
            newBoundsBottom - newBoundsTop
        );
    }
}
