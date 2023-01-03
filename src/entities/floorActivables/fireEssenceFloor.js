
import Phaser from 'phaser'
import FloorActivable from './floorActivable';


/**
 * Clase que representa un fuego que hace daño al pisarlo
 */
export default class FireEssenceFloor extends FloorActivable {

  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {string} texture Textura con la que renderiza la entidad
   * @param {frame} frame Marco de la textura con la que renderiza la entidad, por defecto 0
   */
  constructor(scene, x, y, damage, direction, type) {
    super(scene, x, y, "small_fire_loop", 0);

    this.damage = damage;

    this.prepareAnimations();
    this.makeHitbox(x, y);

    this.counter = 0;
    this.secondsAlive = 3;

    this.thingsHit = new Array();

    this.damageTick = this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.thingsHit = new Array();
        this.counter++;
      },
      loop: true
    })

    this.addImpulse(direction, type);

    this.anims.play("small_fire_start");
  }

  handleCollisionWith(other) {
    if (other.isSensor === false) {
      if (other.gameObject !== null && other.gameObject.hasOwnProperty("damageEvent") &&
        this.thingsHit.find(element => element === other.gameObject) === undefined) {

        this.thingsHit.push(other.gameObject);

        other.gameObject.damageEvent(this.damage, "fire");

      }
    }
  }

  addImpulse(direction, type) {
    const speed = 0.005;
    const deviation = Phaser.Math.FloatBetween(0.5, 1);

    switch (direction) {
      case 0:
        switch (type) {
          case 0:
            this.thrustRight(speed);
            this.thrust(speed * deviation);
            break;
          case 1:
            this.thrustRight(speed);
            this.thrustBack(speed * deviation);
            break;
          case 2:
            this.thrustRight(speed);
            break;
        }

        break;
      case 1:
        switch (type) {
          case 0:
            this.thrustRight(speed);
            this.thrust(speed * deviation*2);
            break;
          case 1:
            this.thrustRight(speed * deviation*2);
            this.thrust(speed);
            break;
          case 2:
            this.thrustRight(speed);
            this.thrust(speed);
            break;
        }
        break;
      case 2:
        switch (type) {
          case 0:
            this.thrust(speed);
            this.thrustRight(speed * deviation);
            break;
          case 1:
            this.thrust(speed);
            this.thrustLeft(speed * deviation);
            break;
          case 2:
            this.thrust(speed);
            break;
        }
        break;
      case 3:
        switch (type) {
          case 0:
            this.thrustLeft(speed);
            this.thrust(speed * deviation*2);
            break;
          case 1:
            this.thrustLeft(speed * deviation*2);
            this.thrust(speed);
            break;
          case 2:
            this.thrustLeft(speed);
            this.thrust(speed);
            break;
        }
        break;
      case 4:
        switch (type) {
          case 0:
            this.thrustLeft(speed);
            this.thrust(speed * deviation);
            break;
          case 1:
            this.thrustLeft(speed);
            this.thrustBack(speed * deviation);
            break;
          case 2:
            this.thrustLeft(speed);
            break;
        }
        break;
      case 5:
        switch (type) {
          case 0:
            this.thrustLeft(speed);
            this.thrustBack(speed * deviation*2);
            break;
          case 1:
            this.thrustLeft(speed * deviation*2);
            this.thrustBack(speed);
            break;
          case 2:
            this.thrustLeft(speed);
            this.thrustBack(speed);
            break;
        }
        break;
      case 6:
        switch (type) {
          case 0:
            this.thrustBack(speed);
            this.thrustRight(speed * deviation);
            break;
          case 1:
            this.thrustBack(speed);
            this.thrustLeft(speed * deviation);
            break;
          case 2:
            this.thrustBack(speed);
            break;
        }
        break;
      case 7:
        switch (type) {
          case 0:
            this.thrustRight(speed);
            this.thrustBack(speed * deviation*2);
            break;
          case 1:
            this.thrustRight(speed * deviation*2);
            this.thrustBack(speed);
            break;
          case 2:
            this.thrustRight(speed);
            this.thrustBack(speed);
            break;
        }
        break;

    }
  }
  makeHitbox(x, y) {
    const bodies = Phaser.Physics.Matter.Matter.Bodies;

    var triangle = Phaser.Physics.Matter.Matter.Vertices.fromPath('-3 0 0 -8 3 0');
    var body = bodies.fromVertices(x, y, triangle, { isSensor: true });
    body.render.sprite = { xOffset: 0.2, yOffset: 0.1 };

    this.setExistingBody(body);
    this.setMass(0.5);
    this.setScale(2.5);
  }

  prepareAnimations() {
    this.on("animationcomplete", (event) => {
      switch (event.key) {
        case "small_fire_start":
          this.anims.play("small_fire_loop");
          break;
        case "small_fire_end":
          this.damageTick.remove();
          this.destroy();
          break;
      }
    })

    this.scene.anims.create({
      key: "small_fire_start",
      frames: this.scene.anims.generateFrameNumbers("small_fire_start", { start: 0, end: 1 }),
      frameRate: 7,
      repeat: 0
    });
    this.scene.anims.create({
      key: "small_fire_loop",
      frames: this.scene.anims.generateFrameNumbers("small_fire_loop", { start: 0, end: 3 }),
      frameRate: 7,
      repeat: -1
    });
    this.scene.anims.create({
      key: "small_fire_end",
      frames: this.scene.anims.generateFrameNumbers("small_fire_end", { start: 0, end: 1 }),
      frameRate: 7,
      repeat: 0
    });

  }



  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    if (this.counter === this.secondsAlive) {
      this.anims.play("small_fire_end");
      this.counter++;
    }
  }
}