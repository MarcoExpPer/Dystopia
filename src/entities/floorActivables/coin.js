import Phaser from 'phaser'
import FloorConsumable from './floorConsumable';


/**
 * Clase que representa el recurso que se pierde entre partidas y que el jugador lo recoge al pasar por encima
 */
export default class Coin extends FloorConsumable {

  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {string} texture Textura con la que renderiza la entidad
   * @param {frame} frame Marco de la textura con la que renderiza la entidad, por defecto 0
   */
  constructor(scene, x, y, type) {
    super(scene, x, y, "coin1_ss", 0);
    this.type = type;

    if (type === 1)
      this.setTexture("coin2_ss");
  }

  consumableEvent() {
    if (this.type === 1)
      this.scene.registry.values.coins += 5;
    else
      this.scene.registry.values.coins += 1;
  }

}