import Phaser from 'phaser'
import ResourceManager from './ResourceManager';

/**
 * Clase que maneja la UI que muestra cuantos recursos volatiles tiene el jugador
 */
export default class KeysManager extends ResourceManager {

    /**
     * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     * @param {number} currentAmount Cantidad actual
     * @param {bool} hide Hide the resource UI if necesary
     */
    constructor(scene, x, y) {
        super(scene, x, y, "key", 0, 0, true);

        this.currentAmount = 0;
        this.prepareAnimations();

        this.text.y += 5;
    }


    prepareAnimations() {
        this.scene.anims.create({
            key: 'key_anim_man',
            frames: this.scene.anims.generateFrameNumbers('key', { start: 0, end: 11 }),
            frameRate: 7,
            repeat: 0
        });
    }

    amountChange(newAmount) {
        this.currentAmount = newAmount;
        this.text.setText(newAmount);
        this.showUI();

        this.sprite.play("key_anim_man");
        this.sprite.on('animationcomplete', this.animationEnds, this);

    }

    animationEnds() {
        if (this.currentAmount === 0) this.hideUI();
        else this.showUI();
    }

}
