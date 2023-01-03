import Phaser from 'phaser'
import FloorConsumable from './floorConsumable';


/**
 * Clase que representa un corazon que el jugador lo recoge al pasar por encima
 */
export default class HearthResource extends FloorConsumable {
  
  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {string} texture Textura con la que renderiza la entidad
   * @param {frame} frame Marco de la textura con la que renderiza la entidad, por defecto 0
   */
  constructor(scene, x, y) {
    super(scene, x, y, "hearths_ss", 4);
  }

  consumableEvent(){
    this.scene.player.healEvent(4, "heal");
  }
  
}