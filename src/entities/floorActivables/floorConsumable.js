import Phaser from 'phaser'
import FloorActivable from './floorActivable';

/**
 * Clase que representa un recurso en el suelo que desaparece cuando el jugador pasa por encima
 */
export default class FloorConsumable extends FloorActivable {

  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {string} texture Textura con la que renderiza la entidad
   * @param {frame} frame Marco de la textura con la que renderiza la entidad, por defecto 0
   */
  constructor(scene, x, y, texture, frame, destroyOnCollision = true) {
    super(scene, x, y, texture, frame);
    this.destroyOnCollision = destroyOnCollision;
  }

  handleCollisionWith(body) {
    if (body.label === "playerBody") {
      this.consumableEvent();

      if (this.destroyOnCollision)
        this.destroy();
    }
  }

  consumableEvent() { }

}



