import Phaser from 'phaser'

/**
 * Clase que representa la base para las entidades del juego
 */
export default class Entity extends Phaser.GameObjects.Sprite {
  
  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {string} texture Textura con la que renderiza la entidad
   * @param {frame} frame Marco de la textura con la que renderiza la entidad, por defecto 0
   */
  constructor(scene, x, y, texture, frame = 0) {
    super(scene, x, y, texture, frame);
    this.scene.add.existing(this);
    this.scene.matter.add.gameObject(this);
    this.setFixedRotation();
  }

  /**
   * Función que deben implementar las entidades para gestionar sus colisiones
   */
  handleCollisionWith(body) {}
}
