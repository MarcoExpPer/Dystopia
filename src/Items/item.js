export default class Item {

    constructor(scene, label, texture, frame, dialogueID) {
        this.scene = scene;

        this.label = label;
        this.texture = texture;
        this.dialogueID = dialogueID;
        this.frame = frame;

    }


    calculateSpawningXY() {
        let x = this.player.x;
        let y = this.player.y;
        const facing = this.player.facing;
        
        if (facing === 4) {
            y -= 20;
        } else if (facing === 3) {
            y -= 10;
            x += 10;
        } else if (facing === 2) {
            x += 20;
        } else if (facing === 1) {
            y += 10;
            x += 10;
        } else if (facing === 0) {
            y += 20;
        } else if (facing === 7) {
            y += 10;
            x -= 10;
        } else if (facing === 6) {
            x -= 20;
        } else if (facing === 5) {
            y -= 10;
            x -= 10;
        }

        this.xRef = x;
        this.yRef = y;
    }
}