import Phaser from 'phaser'
import MaskedLevelingData from '../../../entities/npcs/maskedLevelingData';
import Button from '../../basicUI/button';
import RectangleAndText from '../../basicUI/rectangleAndText';

/**
 * Clase que dibuja la parte derecha de una fila de la tienda de la diosa, en concreto la del blackmisth npc
 */
export default class MaskedRow extends Phaser.GameObjects.Container {

  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece el container
   * @param {number} x Coordenada X del container
   * @param {number} y Coordenada Y del container
   * @param {string} color Color del tema que se va a usar
   * @param {string} fontColor Color de la default font
   * @param {GodShop} godshop GodShop reference
   */
  constructor(scene, x, y, color, godshop, i) {
    super(scene, x, y);

    this.godshop = godshop;
    this.maskedUtils = new MaskedLevelingData()

    this.fontColor = godshop.getBaseColor();
    this.updatedFontColor = godshop.getUpdateColor();
    this.fullFontColor = godshop.getFullColor();

    this.currentLevel = JSON.parse(JSON.stringify(this.scene.registry.values.maskedLvl));

    //Draw a resume of what powers is this NPC currently giving.
    this.plus = new Phaser.GameObjects.Text(scene, 0, -5, "+",
      { color: this.fontColor, align: "left", fontFamily: "monospace", fontSize: 30 });
    this.add(this.plus);

    if (this.currentLevel > 9) {
      this.image = new Phaser.GameObjects.Image(scene, 25, 30, "player_" + Phaser.Math.Between(0, 8), 0);
    } else
      this.image = new Phaser.GameObjects.Image(scene, 25, 30, "player_" + this.maskedUtils.getPlayerTypeLevel(this.currentLevel), 0);

    this.image.setOrigin(0, 1);
    this.add(this.image);

    //Show current cost of the next upgrade
    this.cost = new RectangleAndText(scene, 260 + 90, 10, color, "small", 0.9, 4);
    this.cost.text.setOrigin(0, 0.5);
    this.cost.text.setX(this.cost.text.x - 50);
    this.add(this.cost);

    this.coin = new Phaser.GameObjects.Image(scene, this.cost.x + 25, 9, "souls_ss", 0);
    this.add(this.coin);

    this.checkIfFull();
  }

  //return the name shown in the left part of the row
  getName() {
    return "Majora";
  }
  //return the frame shown in the left part
  getImage() {
    return "npc_2_profile";
  }
  //return the description in the tooltip
  getDesc() {
    return "   Trajes que modifican tus estadisticas base";
  }
  getToolTipSize() {
    return 17;
  }

  //Check if the buy can be executed, update values, and change all text to updatedFontColor to represent the value changed
  buy() {
    if (this.godshop.buy("maskedLvl", this.currentLevel + 1, 4, 9) == true) {
      this.currentLevel += 1;

      if (this.checkIfFull() === false) {
        this.image.setTexture("player_" + this.maskedUtils.getPlayerTypeLevel(this.currentLevel), 0);

        this.cost.text.text = 4;
        this.plus.setColor(this.updatedFontColor);
        this.cost.text.setColor(this.updatedFontColor);
      }
    }
  }

  //Reset all colors and values to the initial/default value
  reset() {
    this.currentLevel = JSON.parse(JSON.stringify(this.scene.registry.values.druidLvl));

    if (this.checkIfFull() === false) {
      this.image.setTexture("player_" + this.maskedUtils.getPlayerTypeLevel(this.currentLevel), 0);

      this.cost.text.text = 4;
      this.plus.setColor(this.fontColor);
      this.cost.text.setColor(this.fontColor);
    }

  }


  checkIfFull() {
    if (this.currentLevel === 8) {

      this.plus.setColor(this.fullFontColor);
      this.image.setTexture("player_" + Phaser.Math.Between(0, 8), 0);

      this.cost.text.text = "MAX";
      this.cost.text.setColor(this.fullFontColor);

      return true;
    }
    return false;
  }

}