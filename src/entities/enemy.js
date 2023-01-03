import Phaser from 'phaser'
import Attributable from './attributable';

/**
 * Clase que representa la base para las enemigos del juego
 */
export default class Enemy extends Attributable {

  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {string} texture Textura con la que renderiza la entidad
   * @param {frame} frame Marco de la textura con la que renderiza la entidad, por defecto 0
   */
  constructor(scene, x, y, texture, frame, attributes, room = { x: 0, y: 0 }) {
    super(scene, x, y, texture, frame, attributes);
    this.label = "enemy";
    this.room = room;
    this.roomXoffset = room.x;
    this.roomYoffset = room.y;

    this.graphics = this.scene.add.graphics();
  }

  velocityToTarget = (from, to, speed = 1, edit = true) => {
    const direction = Math.atan((to.x - from.x) / (to.y - from.y));
    const speed2 = to.y >= from.y ? speed : -speed;

    const velX = speed2 * Math.sin(direction);
    const velY = speed2 * Math.cos(direction);
    if (edit) {
      this.velX = velX
      this.velY = velY
    }else{
      return {x: velX,y: velY};
    }
  };

  //DEBUG TOOL 
  drawPath(path) {
    this.graphics.destroy();
    this.graphics = this.scene.add.graphics();
    this.graphics.fillStyle(0xFF00FF, 1);

    path.forEach(
      element => {
        let point = new Phaser.Geom.Point(element.x * 32 + 16 + this.roomXoffset, element.y * 32 + 16 + this.roomYoffset);
        this.graphics.fillPointShape(point, 8);
      }
    )
  }

  changeOffset() {
    if (this.changeXoffset)
      this.changeXOffset();
    else
      this.changeYOffset();

    this.changeXoffset = !this.changeXoffset
  }
  changeXOffset() {
    switch (this.xOffset) {
      case 0:
        this.xOffset = 32;
        break;
      case 32:
        this.xOffset = -32;
        break;
      case -32:
        this.xOffset = 64;
        break;
      case 64:
        this.xOffset = -64
        break;
      case -64:
        console.log("End of xOffset changes")
        break;
    }
  }
  changeYOffset() {
    switch (this.yOffset) {
      case 0:
        this.yOffset = 32;
        break;
      case 32:
        this.yOffset = -32;
        break;
      case -32:
        this.yOffset = 64;
        break;
      case 64:
        this.yOffset = -64
        break;
      case -64:
        console.log("End of yOffset changes")
        break;
    }
  }

}
