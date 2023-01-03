import Phaser from 'phaser'
import MaskedLevelingData from './maskedLevelingData';
import NPC from './npc';
/**
 * Clase que representa al NPC Masked.
 */
export default class Masked extends NPC {

    /**
     * Constructor del Masked
     * @param {Phaser.Scene} scene Escena a la que pertenece el Masked
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */
    constructor(scene, x, y, level) {
        super(scene, x, y, 'npc_2', 0, "majora", level);

        this.utils = new MaskedLevelingData();

        this.prepareHitBox();
        this.prepareAnimations();


    }

    //Make the Masked stop working and open his dialogue
    interact() {
        if (this.exist === true) {
            //Look to the player
            let facing = 2; //N
            if (this.scene.player.getLeftCenter().x + 5 > this.getRightCenter().x)
                facing = 1;   //E
            else if (this.scene.player.getRightCenter().x - 5 < this.getLeftCenter().x)
                facing = 3;   //W
            else if (this.scene.player.getCenter().y > this.getCenter().y)
                facing = 0;   //S

            this.setTexture("npc_2", facing * 3 + ".png");

            this.scene.openDialogue("masked1", "green", this.dialogueFlagEnds.bind(this), this.scene.NPCs);
        }
    }
    flagFirstLevelUp() {
        this.scene.queueDialogue("maskedbuy", this.dialogueFlagEnds.bind(this));
    }

    //Prepare the hitbox of this NPC
    prepareHitBox() {
        this.setScale(2);
        this.setTexture("npc_2", "9" + ".png");

    }

    //Prepare the animations of this NPC
    prepareAnimations() {
        for (let i = 0; i < 4; i++) {
            this.scene.anims.create({
                key: "walk" + (i * 2),
                frameRate: 4,
                frames: this.anims.generateFrameNames("npc_2", {
                    suffix: ".png",
                    start: 1 + i * 3,
                    end: 2 + i * 3,
                }),
                repeat: -1
            });
        }
    }
}