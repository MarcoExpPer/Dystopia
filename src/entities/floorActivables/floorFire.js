
import Phaser from 'phaser'
import FloorActivable from './floorActivable';


/**
 * Clase que representa un fuego que hace daño al pisarlo
 */
export default class FloorFire extends FloorActivable {

  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {string} texture Textura con la que renderiza la entidad
   * @param {frame} frame Marco de la textura con la que renderiza la entidad, por defecto 0
   */
  constructor(scene, x, y, damage) {
    super(scene, x, y, "medium_fire_loop", 0);

    this.damage = damage;
    this.scene.anims.create({
      key: "medium_fire_loop",
      frames: this.scene.anims.generateFrameNumbers("medium_fire_loop", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.play("medium_fire_loop");

    this.makeHitbox(x, y);
  }

  handleCollisionWith(body) {
    if (body.label === "playerBody") {

      if (this.damage > 0)
        this.scene.player.damageEvent(this.damage, "fire");
      else if (this.damage < 0)
        this.scene.player.healEvent(-this.damage, "fire");
      else{
        this.scene.player.attributes.shield++;
        this.scene.player.addShield(1);
      }
    }
  }

  makeHitbox(x, y) {
    const bodies = Phaser.Physics.Matter.Matter.Bodies;

    var triangle = Phaser.Physics.Matter.Matter.Vertices.fromPath('-11 0 0 -40 11 0');
    var body = bodies.fromVertices(x, y, triangle, { isSensor: true });
    body.render.sprite = { xOffset: 0.1, yOffset: 0.1 };

    this.setExistingBody(body);
  }

}