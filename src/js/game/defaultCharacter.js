import { bodyHeight, bodyWidth } from './variables.js';

export default class AbstractCharacter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'walk1');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(2);
        this.refreshBody();
        this.setScale(0.9);

        this.body.setSize(bodyWidth, bodyHeight - bodyHeight / 10);
        // const offsetX = (this.width - bodyWidth) / 2; // Center the body horizontally
        // const offsetY = (this.height - bodyHeight) / 2; // Center the body vertically
        // this.body.setOffset(offsetX, offsetY);
        this.refreshBody();
    }
}
