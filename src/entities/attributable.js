import Phaser from 'phaser'
import Entity from './entity';

/**
 * Clase que representa la base para las entidades con atributos del juego
 */
export default class Attributable extends Entity {
  
  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {string} texture Textura con la que renderiza la entidad
   * @param {frame} frame Marco de la textura con la que renderiza la entidad, por defecto 0
   */
  constructor(scene, x, y, texture, frame, attributes) {
    super(scene, x, y, texture, frame);
    this.attributes = attributes;

  }  
}
