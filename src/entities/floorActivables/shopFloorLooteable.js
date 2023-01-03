import Phaser from 'phaser'
import FloorConsumable from './floorConsumable';


/**
 * Clase que representa un corazon que el jugador lo recoge al pasar por encima
 */
export default class shopFloorLooteable extends FloorConsumable {

    /**
     * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     * @param {string} texture Textura con la que renderiza la entidad
     * @param {frame} frame Marco de la textura con la que renderiza la entidad, por defecto 0
     */
    constructor(scene, x, y, item) {
        super(scene, x, y, item.texture, item.frame, false);
        this.item = item;

        this.prize = 15 + Phaser.Math.Between(-5, 5);
        this.showPrize();
    }

    consumableEvent() {
        if (this.scene.registry.values.coins >= this.prize) {
            this.scene.registry.values.coins -= this.prize;

            this.scene.openDialogue(this.item.dialogueID, "green", this.dialogueFlagEnds.bind(this));

        }
    }

    dialogueFlagEnds(){
        if (this.item.isActive) {
            this.scene.player.addActiveItem(this.item);
        } else {
            this.scene.player.equipPassiveItem(this.item);
        }

        this.destroy();
    }
    
    showPrize() {
        this.text = new Phaser.GameObjects.Text(this.scene, this.x, this.y + 35, this.prize,
            { color: "#35dae5", align: "center", fontFamily: "monospace" }).setOrigin(0.5, 0.5).setFontSize(15);

        this.text.fontWeight = 'bold';
        this.scene.add.existing(this.text);
    }

}