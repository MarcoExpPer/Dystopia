import Phaser from 'phaser'
import Entity from '../entity';


/**
 * Clase que representa cosas en el suelo, sin colision, que se activan al caminar por encima
 */
export default class FloorActivable extends Entity {
  
  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {string} texture Textura con la que renderiza la entidad
   * @param {frame} frame Marco de la textura con la que renderiza la entidad, por defecto 0
   */
  constructor(scene, x, y, texture, frame = 0) {
    super(scene, x, y, texture, frame);
    this.label = "intheFloor";
    this.setSensor(true);
  }  

}