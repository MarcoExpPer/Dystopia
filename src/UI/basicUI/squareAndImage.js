import Phaser from 'phaser'

/**
 * Clase que dibuja un cuadrado con un icono en su interior
 */
export default class SquareAndImage extends Phaser.GameObjects.Container {

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

  constructor(scene, x, y, color, type, scale, image, frame = 0, imageScale = 10) {
    super(scene, x, y);
    this.scale = scale;
    this.imageScale = imageScale;

    this.backTexture = color + "_" + type;
    this.overTexture = color + "_" + type + "over";


    this.background = new Phaser.GameObjects.Image(scene, 0, 0, this.backTexture).setScale(scale);
    this.image = new Phaser.GameObjects.Image(scene, 0, 0, image, frame);


    this.add(this.background);
    this.autosizeimage();
    this.add(this.image);
  }

  //Autofit the image if theres no imageScale parameter
  autosizeimage() {
    if (this.imageScale === 10) {
      this.image.setScale(this.imageScale);
      let imageScale = this.imageScale;

      while( (this.image.width * imageScale > (this.background.width * this.scale - this.background.width * this.scale / 20))
        && imageScale > 1) {
        imageScale = (imageScale * .9)
        this.image.setScale(imageScale);

      }
      while( (this.image.height * imageScale > (this.background.height * this.scale - this.background.height * this.scale / 20))
        && imageScale > 1) {
        imageScale = (imageScale * .9)
        this.image.setScale(imageScale);
      }
    }
  }

  changeImage(texture, frame) {
    this.image.setTexture(texture, frame);
    this.autosizeimage()
  }
}