import Phaser from 'phaser'
import Entity from './entity';

/**
 * El "altar de tp" esta mal colocado en la Z del mundo. Aun asi, habria que hacer ese objeto un objeto como tal, no dentro del tileset. Y que la imagen de esta
 * clase sea esa. Ahora mismo lo del blacksmith lo he puesto para coger un tamaño de 64/64
 */
export default class DungeonTP extends Entity {

  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   */
  constructor(scene, x, y) {
    super(scene, x, y, "empty64x", 0);
    this.setSensor(true);
  }

  dialogueFlagEnds() {}

  disable() {}
  
  interact() {
    this.scene.goToDungeon();
  }
}
