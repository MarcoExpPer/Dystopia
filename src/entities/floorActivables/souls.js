import Phaser from 'phaser'
import FloorConsumable from './floorConsumable';


/**
 * Clase que representa el recurso permanente en la partida y que el jugador lo recoge al pasar por encima
 */
export default class Souls extends FloorConsumable {

  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {string} texture Textura con la que renderiza la entidad
   * @param {frame} frame Marco de la textura con la que renderiza la entidad, por defecto 0
   */
  constructor(scene, x, y) {
    super(scene, x, y, "permanentRes_ss", 0);

    this.prepareAnimations();
    this.play("souls_anim");
  }

  prepareAnimations() {
    this.scene.anims.create({
      key: "souls_anim",
      frameRate: 7,
      frames: this.anims.generateFrameNames("souls_ss", {
        suffix: ".png",
        start: 0,
        end: 5,
        zeroPad: 0
      }),
      repeat: -1
    });
  }

  consumableEvent() {
    this.scene.registry.values.souls++;
  }

}