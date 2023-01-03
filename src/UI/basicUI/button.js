import Phaser, { GameObjects } from 'phaser'
import RectangleAndText from './rectangleAndText';
import UIutils from '../uiutils';

/**
 * Clase que representa un boton que cambia su textura cuando se pasa el raton por encima y que tiene un texto en su interior
 * Al clicar el boton se ejecuta la funcion que se pasa como parametro
 */
export default class Button extends Phaser.GameObjects.Container {

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
  constructor(scene, x, y, color, type, scale, text, onClick, onHoverFunc = null, fontSize = 100,) {
    super(scene, x, y);
    this.fontSize = fontSize;
    this.scale = scale;

    this.utils = new UIutils();

    this.changeAlpha = null;
    this.alphaIncreasing = true;


    const rectangleAndText = new RectangleAndText(scene, 0, 0, color, type, scale, text, fontSize);
    this.background = rectangleAndText.background;
    this.text = rectangleAndText.text;

    let width = (this.background.width + 10) * scale;
    let height = (this.background.height + 10) * scale;
    let texture = "_overlaySquare";
    switch (type) {
      case "small":
        texture = "_overlaySmall";
        height += 10;
        width += 10;
        break;
      case "medium":
        texture = "_overlayMedium";
        height += 12;
        width += 12;
        break;
      case "large":
        texture = "_overlayLarge";
        height += 5;
        width += 5;
        break;
      case "saveslot":
        texture = "_overlaySaveSlot";
        break;
    }

    this.areaAnimation = new Phaser.GameObjects.Image(scene, 0, 0, color + texture).setVisible(false);
    this.areaAnimation.setDisplaySize(width, height);


    this.overImage = new Phaser.GameObjects.Image(scene, 0, 0, rectangleAndText.overTexture).setVisible(false).setScale(scale);


    this.setSize(this.overImage.width * scale, this.overImage.height * scale);
    this.setInteractive();

    if (onHoverFunc === null)
      onHoverFunc = this.unselect;

    this.onClick = onClick
    //Al pasar el raton por encima, la textura cambia
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, onHoverFunc);
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, onClick);

    this.add(this.areaAnimation);
    this.add(this.background);
    this.add(this.overImage);
    this.add(this.text);

    this.utils.autosizetext(this.text, this.background, this.scale, this.fontSize);

    this.changeInteractuable = this.changeInteractuable;
  }

  changeInteractuable(interactuable) {
    if (interactuable) {
      this.background.setVisible(true);
      this.overImage.setVisible(false);

      this.setInteractive();
    } else {
      this.background.setVisible(true);
      this.overImage.setVisible(false);

      this.removeInteractive();
    }
  }

  select() {
    this.overImage.setVisible(true);
    this.background.setVisible(false);
    this.areaAnimation.setAlpha(1).setVisible(true);

    this.selectedEffect();
  }

  unselect() {
    this.background.setVisible(true);
    this.overImage.setVisible(false);

    if (this.changeAlpha !== null) this.changeAlpha.remove();

    this.areaAnimation.setAlpha(1).setVisible(false);

    this.alphaIncreasing = true;
  }

  execute() {
    this.onClick();
  }

  selectedEffect() {
    if (this.changeAlpha !== null) this.changeAlpha.remove();

    if (this.alphaIncreasing === true)
      this.changeAlpha = this.scene.tweens.addCounter({
        from: 1,
        to: 0,
        duration: 1000,
        ease: Phaser.Math.Easing.Sine.In,
        repeat: 0,
        onUpdate: (tween) => {
          const newAlpha = tween.getValue();
          this.areaAnimation.setAlpha(newAlpha)
        },
        onComplete: () => {
          this.alphaIncreasing = false;
          this.selectedEffect()
        }
      })
    else
      this.changeAlpha = this.scene.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 1000,
        ease: Phaser.Math.Easing.Sine.In,
        repeat: 0,
        onUpdate: (tween) => {
          const newAlpha = tween.getValue();
          this.areaAnimation.setAlpha(newAlpha)
        },
        onComplete: () => {
          this.alphaIncreasing = true;
          this.selectedEffect()
        }
      })
  }

  disableInteractive() {
    this.removeInteractive();
    this.unselect();

  }

  destroy(){
    if (this.changeAlpha !== null) this.changeAlpha.remove();

    super.destroy();

  }
}