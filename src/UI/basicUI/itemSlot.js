import Phaser, { GameObjects } from 'phaser'
import FireEssence from '../../Items/PassiveItems/fireEssence';
import RectangleAndText from './rectangleAndText';

/**
 * Clase que representa un boton que cambia su textura cuando se pasa el raton por encima y que tiene un texto en su interior
 * Al clicar el boton se ejecuta la funcion que se pasa como parametro
 */
export default class ItemSlot extends Phaser.GameObjects.Container {

  /**
    * @param {Phaser.Scene} scene Escena a la que pertenece el container
    * @param {number} x Coordenada X del container
    * @param {number} y Coordenada Y del container
    * @param {string} color Color del tema que se va a usar
    * @param {string} type Tipo de la textura que se va a usar ("large", "medium", "small", "square")
    * @param {Number} scale Tamaño de la textura que se va a usar
    * @param {string} text Texto que se muestra en el interior del boton
    * @param {number} fontSize Tamaño de la font del texto, si no se pasa, el tamaño se fijara automaticamente para entrar en la caja
    * @param {function} onClick Funcion que se ejecuta cuando se clica el boton
    * @param {wildcard} onClickthis Referencia con la que se ejecutara onClick
    */
  constructor(scene, x, y, texture, frame, onClick, onHoverFunc = null) {
    super(scene, x, y);

    this.background = new Phaser.GameObjects.Image(scene, 0, 0, "itemslot_unique");
    this.image = new Phaser.GameObjects.Image(scene, 0, 0, texture, frame);

    if (texture === new FireEssence(this.scene).texture)
      this.image.setScale(2.5);

    this.overBackground = new Phaser.GameObjects.Image(scene, 0, 0, "itemslot_uniqueover").setVisible(false);


    if (onClick !== null) {
      this.setSize(this.background.width, this.background.height);
      this.setInteractive();

      if (onHoverFunc === null)
        onHoverFunc = this.unselect;

      this.onHoverFunc = onHoverFunc
      this.onClick = onClick;


      //Al pasar el raton por encima, la textura cambia
      this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, onHoverFunc);
      this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, onClick);

    }
    this.add(this.background);
    this.add(this.overBackground);
    this.add(this.image);

  }


  select() {
    this.overBackground.setVisible(true);
    this.background.setVisible(false);
  }

  unselect() {
    this.background.setVisible(true);
    this.overBackground.setVisible(false);
  }

  execute() {
    this.onClick();
  }

  changeInteractuable(interactuable) {
    if (interactuable) {
      this.background.setVisible(true);
      this.overBackground.setVisible(false);

      this.setInteractive();
    } else {
      this.background.setVisible(true);
      this.overBackground.setVisible(false);

      this.removeInteractive();
    }
  }

}