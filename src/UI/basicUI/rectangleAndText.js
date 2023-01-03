import Phaser from 'phaser'
import UIutils from '../uiutils';

/**
 * Clase que dibuja una textura con un nombre en su interior
 */

export default class RectangleAndText extends Phaser.GameObjects.Container {

  /**
  * @param {Phaser.Scene} scene Escena a la que pertenece el container
  * @param {number} x Coordenada X del container
  * @param {number} y Coordenada Y del container
  * @param {string} color Color del tema que se va a usar
  * @param {string} type Tipo de la textura que se va a usar ("large", "medium", "small", "square")
  * @param {Number} scale Tamaño de la textura que se va a usar
  * @param {string} text Texto que se muestra en el interior del boton
  * @param {number} fontSize Tamaño de la font del texto
  */

  constructor(scene, x, y, color, type, scale, text, fontSize = 100) {
    super(scene, x, y);
    this.scale = scale;
    this.fontSize = fontSize;

    this.backTexture = color + "_" + type;
    this.overTexture = color + "_" + type + "over";

    this.utils = new UIutils();
    this.fontColor = this.utils.chooseStyle(color);

    this.text = new Phaser.GameObjects.Text(scene, 0, 0, text,
      { color: this.fontColor, align: "center", fontFamily: "monospace" }).setOrigin(0.5, 0.5).setFontSize(fontSize);

    this.background = new Phaser.GameObjects.Image(scene, 0, 0, this.backTexture).setScale(scale);

    this.add(this.background);
    this.add(this.text);
    
    this.utils.autosizetext(this.text, this.background, this.scale, this.fontSize);
    
  }

  changeText(newText){
    this.text.text = newText;
    this.utils.autosizetext(this.text, this.background, this.scale, this.fontSize);
  }

}