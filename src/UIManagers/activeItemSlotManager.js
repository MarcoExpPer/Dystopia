import Phaser from 'phaser'
import SquareAndImage from '../UI/basicUI/squareAndImage';

/**
 * Clase que controla la UI de que imagen de que objeto activo se esta viendo en cada momento, 
 * y trackea cuanta municion/cooldown del objeto activo queda
 */
export default class ActiveItemSlotManager extends Phaser.GameObjects.Container {

  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {string} texture textura del item actual
   * @param {frame}  frame frame de la textura
   */
  constructor(scene, x, y) {
    super(scene, x, y)

    this.setScrollFactor(0, 0, true);

    this.itemslot = new SquareAndImage(this.scene, 0, 0, "itemslot", "unique", 1, "itemslot_unique");
    this.add(this.itemslot);


    //CooldownRadialEffect
    this.cooldownEffect = this.scene.add.graphics();
    this.cooldownEffect.setPosition(x, y);
    this.cooldownEffect.setScrollFactor(0, 0);
    this.cooldownEffect.depth = 12;


    this.rectMask = new Phaser.GameObjects.Graphics(this.scene);
    this.rectMask.fillStyle(0, 1);
    this.rectMask.fillRect(0, 0, 32, 32);
    this.rectMask.setPosition(x - 16, y - 16);
    this.rectMask.setScrollFactor(0, 0);

    this.cooldownEffect.mask = new Phaser.Display.Masks.GeometryMask(this.scene, this.rectMask);
    this.cooldownEffect.visible = false;
    this.activationTime = 0;

    //CooldownTextTimer
    this.cooldownText = new Phaser.GameObjects.Text(this.scene, -16, -16, "10", { color: "RED", align: "center", fontFamily: "monospace", fontSize: 30 });
    this.cooldownText.setDepth(11);
    this.add(this.cooldownText);

    //AmunitionTracker
    this.ammoText = new Phaser.GameObjects.Text(this.scene, -42, -16, "0", { color: "RED", align: "center", fontFamily: "monospace", fontSize: 30 });
    this.ammoText.setDepth(11).setVisible(false);
    this.add(this.ammoText);

    this.scene.add.existing(this);
    this.setDepth(10);
    
  }

  //Change current active item texture
  changeItem(texture, frame, currentAmmo = null) {
    this.itemslot.changeImage(texture, frame);
    this.cooldownTime = 0;

    if (currentAmmo !== null) {
      this.ammoText.text = currentAmmo;
      this.ammoText.setVisible(true);
    } else {
      this.ammoText.setVisible(false);
    }
  }

  //Start the cooldown tracking
  startCooldown(cooldown, currentTime) {
    if (this.cooldownEffect.visible === false) {
      this.cooldownTime = cooldown * 1000;
      this.activationTime = currentTime;
    }

  }

  ammoChange(newAmmo) {
    if (newAmmo !== null)
      this.ammoText.text = newAmmo;
  }

  //Update the visuals and the text of the current active item cooldown
  updateCooldown(time) {
    let elapsed = time - this.activationTime;
    let disabled = false;

    if (this.cooldownTime == -1) {
      disabled = true;
    }
    if (!disabled && elapsed > this.cooldownTime) {
      this.cooldownEffect.visible = false;
      this.cooldownText.text = "";
    } else {
      this.cooldownEffect.visible = true;
      let render = 1;
      if (!disabled) {
        render = Math.floor(360 * elapsed / this.cooldownTime);
        let cd = Math.ceil((this.cooldownTime - elapsed) / 1000);
        this.cooldownText.text = cd;
        if (cd >= 10)
          this.cooldownText.setX(-16);
        else {
          this.cooldownText.setX(-8);
        }
      }
      this.cooldownEffect.clear();
      this.cooldownEffect.fillStyle(this.cdColor, 0.6);
      this.cooldownEffect.moveTo(0, 0);
      this.cooldownEffect.arc(0, 0, 32, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(render - 90), true);
      this.cooldownEffect.fillPath();
    }
  }

}
