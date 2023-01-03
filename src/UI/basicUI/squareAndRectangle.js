import Phaser from 'phaser'
import SquareAndImage from './squareAndImage';
import RectangleAndText from './rectangleAndText';
/**
 * Clase que dibuja combina un rectangulo con texto y un icono a su izzquierda
 */
export default class SquareAndRectangle extends Phaser.GameObjects.Container {

 /**
  * @param {Phaser.Scene} scene Escena a la que pertenece el container
  * @param {number} x Coordenada X del container
  * @param {number} y Coordenada Y del container
  * @param {string} color Color del tema que se va a usar
  * @param {string} type Tipo de la textura que se va a usar ("large", "medium", "small", "square")
  * @param {Number} scale Tamaño de la textura que se va a usar
  * @param {string} image Imagen que se va a mostrar en el interior del boton
  * @param {number} frame Frame de la imagen de ser necesario
  * @param {number} imageScale Tamaño de la imagen de ser necesario
  */

   constructor(scene, x, y, color, type, scale, squareScale, image, text, fontSize = 100, frame = 0, imageScale = 10) {
    super(scene, x, y);

    this.rectangleAndText = new RectangleAndText(scene, 0, 0, color, type, scale, text, fontSize);
    this.add( this.rectangleAndText );

    this.square = new SquareAndImage(scene, -90, 0, color, "square", squareScale, image, frame, imageScale);
    this.add( this.square );
  }

}