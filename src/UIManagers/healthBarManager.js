import Phaser from 'phaser'

/**
 * Clase maneja la UI de los corazones de salud que se visualizan
 */
export default class HealthBarManager extends Phaser.GameObjects.Container {

  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {number} maxhearths Maximo de corazones
   * @param {number} current_health Vida actual del personaje
   */
  constructor(scene, x, y, maxHearths, shield, current_health = null) {
    super(scene, x, y);

    this.xSpan = 32;




    this.createhealthBar(maxHearths, current_health);
    this.createShieldBar(shield);

    this.scene.add.existing(this);
    this.setDepth(10);

    this.setScrollFactor(0, 0, true);
  }

  createhealthBar(maxHearths, current_health = null) {
    this.hearthContainer = new Phaser.GameObjects.Container(this.scene, 0, 0);

    this.heartIndex = -1;
    this.hearthState = 4;

    this.maxHp = maxHearths;
    const hpHearths = Math.ceil(maxHearths / 4.0);

    for (let i = 0; i < hpHearths; i++) {
      this.hearthContainer.add(new Phaser.GameObjects.Image(this.scene, this.xSpan * (this.heartIndex + 1), 0, "hearths_ss", 4))
      this.heartIndex++;
    }

    if (current_health !== null) {
      this.playerHealthChange(- (this.maxHp - current_health));
    }

    this.add(this.hearthContainer);
  }

  createShieldBar(shield) {
    this.shield = shield;

    this.shieldIndex = -1;

    this.shieldContainer = new Phaser.GameObjects.Container(this.scene, this.xSpan * (this.heartIndex + 1), 0);

    for (let i = 0; i < shield; i++) {
      this.shieldContainer.add(new Phaser.GameObjects.Image(this.scene, this.xSpan * (this.shieldIndex + 1), 0, "hearths_ss", 5))
      this.shieldIndex++;
    }

    this.add(this.shieldContainer);
  }
  //Change Hearths
  playerHealthChange(amountChange) {

    let newHearthState = this.hearthState + amountChange;

    if (newHearthState < 0) {

      this.hearthContainer.getAt(this.heartIndex).setTexture("hearths_ss", 0);
      this.heartIndex--;

      this.hearthState = 4;

      this.playerHealthChange(newHearthState);

    } else if (newHearthState > 4) {
      this.hearthContainer.getAt(this.heartIndex).setTexture("hearths_ss", 4);
      this.heartIndex++;

      newHearthState = amountChange - (4 - this.hearthState);

      this.hearthState = 0;

      this.playerHealthChange(newHearthState);

    } else {

      this.hearthState += amountChange;
      this.hearthContainer.getAt(this.heartIndex).setTexture("hearths_ss", newHearthState);

    }

  }

  reduceShields(amount) {

    for (let i = 0; i < amount; i++) {
      this.shieldContainer.getAt(this.shieldIndex).destroy();
      this.shieldIndex--;
    }
  }

  increaseMaxHp(newMaxHp, healToFull = true) {
    if (healToFull) {
      this.hearthContainer.destroy();

      this.createhealthBar(newMaxHp, null);
      this.shieldContainer.setX(this.xSpan * (this.heartIndex + 1));

    } else {

      const hpHearths = Math.ceil((newMaxHp - this.maxHp) / 4.0);
      this.maxHp = newMaxHp;

      for (let i = 0; i < hpHearths; i++) {
        this.hearthContainer.add( new Phaser.GameObjects.Image(this.scene, this.xSpan * (this.heartIndex + 1 + i), 0, "hearths_ss", 0) );
        this.shieldContainer.setX(this.shieldContainer.x + this.xSpan);
      }

    }
  }

  addShield(newShield) {

    for (let i = 0; i < newShield; i++) {
      this.shieldContainer.add(new Phaser.GameObjects.Image(this.scene, this.xSpan * (this.shieldIndex + 1), 0, "hearths_ss", 5))
      this.shieldIndex++;
      this.shield++;
    }

  }
}
