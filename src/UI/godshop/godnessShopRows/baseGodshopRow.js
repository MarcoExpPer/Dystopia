import Phaser from 'phaser'
import Button from '../../basicUI/button';

import RectangleAndText from '../../basicUI/rectangleAndText';
import SquareAndRectangle from '../../basicUI/squareAndRectangle';
import BlackSmithRow from './blacksmithRow';
import DruidRow from './druidRow';
import MaskedRow from './maskedRow';
/**
 * Clase qgenerica que dibuja la parte izquierda de una fila de la tienda de la diosa
 */
export default class BaseGodShopRow extends Phaser.GameObjects.Container {

  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece el container
   * @param {number} x Coordenada X del container
   * @param {number} y Coordenada Y del container
   * @param {string} color Color del tema que se va a usar
   * @param {string} name Name or id of the npc that goes in this row
   * @param {GodShop} godshop GodShopref used as a parameter for the right part of the row
   */

  constructor(scene, x, y, color, name, godshop, i) {
    super(scene, x, y);

    this.addRightUI(name, godshop, color);

    const buyButton = new Button(scene, 360, 1, color, "plus", 0.8, "", this.rightPart.buy.bind(this.rightPart), this.scene.select.bind(this.scene, i, 1));
    this.add(buyButton);
    
    //Create the left part of the row that shows the NPC image and a rectangle with its name
    const squareAndRectangle = new SquareAndRectangle(scene, 0, 0, color, "medium", 0.9, 0.69, this.rightPart.getImage(), this.rightPart.getName(), 32);
    this.add(squareAndRectangle);

    //Tooltip activated bya hovering with a description of what this NPC upgrades do
    this.tooltip = new RectangleAndText(scene, 300, 0, color, "tooltipmegalarge", 0.9, this.rightPart.getDesc(), this.rightPart.getToolTipSize()).setVisible(false);
    this.tooltip.text.setColor("WHITE");

    this.tooltip.execute = function(){};
    this.tooltip.select = () => this.tooltip.setVisible(true)
    this.tooltip.unselect = () => this.tooltip.setVisible(false)

    this.add(this.tooltip);

    squareAndRectangle.setSize(squareAndRectangle.rectangleAndText.background.width * 0.9, squareAndRectangle.rectangleAndText.background.height * 0.9);
    squareAndRectangle.setInteractive();

    squareAndRectangle.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
      this.tooltip.setVisible(true);
      this.rightPart.setVisible(false).setActive(false);
    })
    squareAndRectangle.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
      this.rightPart.setVisible(true).setActive(true);
      this.tooltip.setVisible(false);
    })



    this.scene.selectables.push([this.tooltip,buyButton]);
  }

  //Based on the name, add the correct rightPart
  addRightUI(name, godshop, color, i) {
    this.rightPart;

    switch (name) {
      case "herrero":
        this.rightPart = new BlackSmithRow(this.scene, 100, -10, color, godshop, i);
        break;
      case "druida":
        this.rightPart = new DruidRow(this.scene, 100, -10, color, godshop, i);
        break;
      case "majora":
        this.rightPart = new MaskedRow(this.scene, 100, -10, color, godshop, i);
        break;
      default:
        console.log("Error al crear la parte derecha de la UI de la godshop " + name);
        break;
    }
    this.add(this.rightPart);
  }

  //Get the currentLvl of this NPC row
  getLvl() {
    return this.rightPart.currentLevel;
  }

  //Reset everything to the default/starting value, which is nothing because this object doesnt hold critical info, thats the rightPart job
  reset() {
    this.rightPart.reset();
  }


}