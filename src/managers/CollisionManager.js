import Phaser from 'phaser'
import Entity from '../entities/entity';
import Sensor from '../entities/sensor';

/**
 * Clase maneja las colisiones de la escena
 */
export default class CollisionManager {

  /**
   * @param {Phaser.Scene} scene Escena de la que gestionara las colisiones
   */
  constructor(scene) {
    this.scene = scene;
    scene.matter.world.on(Phaser.Physics.Matter.Events.COLLISION_ACTIVE, this.handleCollision, this);
  }

  handleCollision(event) {
    for(const pair of event.pairs) {

      this._handleCollision(pair.bodyA, pair.bodyB);
      this._handleCollision(pair.bodyB, pair.bodyA);
    }
  }

  _handleCollision(one, another) {
    if (one.gameObject instanceof Entity) {
      one.gameObject.handleCollisionWith(another, one);
    } else if (one.gameObject instanceof Sensor) {
      one.gameObject.handleCollisionWith(another);
    }
  }
}
