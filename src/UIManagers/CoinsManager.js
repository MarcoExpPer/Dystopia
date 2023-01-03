import Phaser from 'phaser'
import ResourceManager from './ResourceManager';

/**
 * Clase que maneja la UI que muestra cuantos recursos volatiles tiene el jugador
 */
export default class CoinsManager extends ResourceManager {

  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {number} currentAmount Cantidad actual
   * @param {bool} hide Hide the resource UI if necesary
   */
  constructor(scene, x, y, currentAmount, hide) {
    super(scene, x, y, "coin1_ss", 0, currentAmount, hide);

    this.scene.anims.create({
      key: 'coin1_anim',
      frames: this.scene.anims.generateFrameNumbers('coin1_ss', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 2
    });
    this.scene.anims.create({
      key: 'coin2_anim',
      frames: this.scene.anims.generateFrameNumbers('coin2_ss', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 2
    });
  }

  amountChange(newAmount) {
    if (this.hide) this.showUI();

    if (newAmount - this.currentAmount === 0)
      this.sprite.play("coin2_anim");
    else
      this.sprite.play("coin1_anim");

    this.currentAmount = newAmount;
    this.text.setText(this.currentAmount);

    this.sprite.on('animationcomplete', this.animationEnds, this);
  }

  animationEnds() {
    this.sprite.setTexture("coin1_ss", 0);
    if (this.hide) this.hideUI()
  }

}
