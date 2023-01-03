import Phaser from 'phaser'
import Button from '../../basicUI/button';
import RectangleAndText from '../../basicUI/rectangleAndText';

/**
 * Clase que dibuja la parte derecha de una fila de la tienda de la diosa, en concreto la del blackmisth npc
 */
export default class BlackSmithRow extends Phaser.GameObjects.Container {

  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece el container
   * @param {number} x Coordenada X del container
   * @param {number} y Coordenada Y del container
   * @param {string} color Color del tema que se va a usar
   * @param {string} fontColor Color de la default font
   * @param {GodShop} godshop GodShop reference
   */
  constructor(scene, x, y, color, godshop) {
    super(scene, x, y);

    this.godshop = godshop;

    this.fontColor = this.godshop.getBaseColor();
    this.updatedFontColor = this.godshop.getUpdateColor();
    this.fullFontColor = this.godshop.getFullColor();

    this.currentLevel = JSON.parse(JSON.stringify(this.scene.registry.values.blacksmithLvl));

    //Draw a resume of what powers is this NPC currently giving.
    this.currentPowers = new Phaser.GameObjects.Text(scene, 0, -5, "+" + this.currentLevel,
      { color: this.fontColor, align: "left", fontFamily: "monospace", fontSize: 30 });
    this.add(this.currentPowers);
    this.image = new Phaser.GameObjects.Image(scene, 55, 10, "hearths_ss", 4);
    this.add(this.image);

    //Show current cost of the next upgrade
    this.cost = new RectangleAndText(scene, 260 + 90, 10, color, "small", 0.9, this.currentLevel + 1);
    this.cost.text.setOrigin(0, 0.5);
    this.cost.text.setX(this.cost.text.x - 50);
    this.add(this.cost);

    this.coin = new Phaser.GameObjects.Image(scene, this.cost.x + 25, 9, "souls_ss", 0);
    this.add(this.coin);

    this.checkIfFull();
  }

  //return the name shown in the left part of the row
  getName() {
    return "Herrero";
  }
  //return the frame shown in the left part
  getImage() {
    return "npc_1_profile";
  }
  //return the description in the tooltip
  getDesc() {
    return "Aumenta tu vida maxima";
  }
  getToolTipSize() {
    return 21;
  }

  //Check if the buy can be executed, update values, and change all text to updatedFontColor to represent the value changed
  buy() {
    if (this.godshop.buy("blacksmithLvl", this.currentLevel + 1, this.currentLevel + 1, 10) == true) {
      this.currentLevel += 1;

      if (this.checkIfFull() === false) {

        this.currentPowers.text = "+" + this.currentLevel;
        this.currentPowers.setColor(this.updatedFontColor);

        this.cost.text.text = this.currentLevel + 1;
        this.cost.text.setColor(this.updatedFontColor);
      }
    }
  }

  //Reset all colors and values to the initial/default value
  reset() {
    this.currentLevel = JSON.parse(JSON.stringify(this.scene.registry.values.blacksmithLvl));

    if (this.checkIfFull() === false) {

      this.currentPowers.text = "+" + this.currentLevel;
      this.currentPowers.setColor(this.fontColor);

      this.cost.text.text = this.currentLevel + 1;
      this.cost.text.setColor(this.fontColor);
    }
  }

  checkIfFull() {
    if (this.currentLevel === 9) {
      this.currentPowers.text = "+" + this.currentLevel;
      this.currentPowers.setColor(this.fullFontColor);

      this.cost.text.text = "MAX";
      this.cost.text.setColor(this.fullFontColor);

      return true;
    }
    return false;
  }
}