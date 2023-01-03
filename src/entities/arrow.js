import Phaser from 'phaser'
import Entity from '../entities/entity';
import KnockbackObject from './knockbackObject';
/**
 * Clase que representa una flecha que avanza en la direccion indicada hasta que choca con algo.
 */
export default class Arrow extends Entity {

  /**
   * Constructor del jugador
   * @param {Phaser.Scene} scene Escena a la que pertenece la flecha
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {number} speed Velocidad de la flecha
   * @param {string} direction Punto cardinal de la direccion/orientacion de la flecha
   */
  constructor(scene, x, y, speed, direction, damage, source, axis_direction = true, intangible = false, hitPlayer = false) {
    super(scene, x, y, "bow_ss", 2);
    this.speed = speed;
    this.scene = scene;
    this.direction = direction;
    this.source = source;
    this.damage = damage;
    this.hitPlayer = hitPlayer;

    this.fire = null;
    this.intangible = intangible;

    this.label = "proyectile";
    this.axis_direction = axis_direction;

    this.lifetime = 0;

    this.configureMatter(x, y);


    if (axis_direction && direction % 2 !== 0)
      this.diagonalCorrection = Math.cos(45);

    this.movement(0);
    
    
  }
  calculateAngle() {

    if (!this.axis_direction)
      this.angle = this.direction.angle;
  }

  addFireEffect(fireEssence) {
    //this.setTexture("fireholy_sword");
    this.fire = fireEssence;
  }
  //Configure matter parameters
  configureMatter(x, y) {
    let bodies = Phaser.Physics.Matter.Matter.Bodies;
    let wood = bodies.rectangle(x, y, 22, 8);

    this.setExistingBody(wood);
    this.setSensor(true);

    this.calculateAngle();
    this.setFixedRotation();

  }

  handleCollisionWith(body) {
    //if it impacts with the nothingness of the void
    if (body.gameObject === null) {
      if (this.intangible === false)
        this.destroy();


    } else if (body.gameObject.label !== "intheFloor") { //Dont impact with the looteables

      if (body.gameObject !== this.source && this.hitPlayer === false) {
        if (body.gameObject.hasOwnProperty("damageEvent") && (body.label === "hitable" || body.label === "playerBody")) {
          const knockbackForce = 0.5;
          const knockbackDuration = 0.5;
          const direction = new Phaser.Math.Vector2(body.gameObject.x - this.x, body.gameObject.y - this.y).normalize();

          body.gameObject.damageEvent(this.damage, "piercing", new KnockbackObject(direction, knockbackForce, knockbackDuration), this.x, this.y);
          this.destroy();
        }
        if (this.fire !== null)
          this.fire.activate(this.x, this.y, this.direction, 0);

        if (this.intangible === false)
          this.destroy();
      } else

        if (body.gameObject !== this.source && this.hitPlayer === true) {
          if (body.gameObject.hasOwnProperty("damageEvent") && body.label === "playerBody") {
            const knockbackForce = 0.5;
            const knockbackDuration = 0.5;
            const direction = new Phaser.Math.Vector2(body.gameObject.x - this.x, body.gameObject.y - this.y).normalize();

            body.gameObject.damageEvent(this.damage, "piercing", new KnockbackObject(direction, knockbackForce, knockbackDuration), this.x, this.y);
            this.destroy();
          }
          if (this.fire !== null)
            this.fire.activate(this.x, this.y, this.direction, 0);

          if (this.intangible === false)
            this.destroy();
        }
    }


  }
  axis_movement(dt) {
    if (this.direction === 3) {  //North East movement
      this.angle = -45;
      this.setVelocity(this.diagonalCorrection * dt * +this.speed, this.diagonalCorrection * dt * -this.speed);

    } else if (this.direction === 5) {  //North West movement
      this.angle = -135;
      this.setVelocity(this.diagonalCorrection * dt * -this.speed, this.diagonalCorrection * dt * -this.speed);

    } else if (this.direction === 4) { //North movement         
      this.angle = -90;
      this.setVelocity(0, dt * -this.speed);

    } else if (this.direction === 1) {  //South East movement
      this.angle = +45;
      this.setVelocity(this.diagonalCorrection * dt * +this.speed, this.diagonalCorrection * dt * +this.speed);

    } else if (this.direction === 7) {  //South West movement
      this.angle = +135;
      this.setVelocity(this.diagonalCorrection * dt * -this.speed, this.diagonalCorrection * dt * +this.speed);

    } else if (this.direction === 0) { //South
      this.angle = +90;
      this.setVelocity(0, dt * this.speed);

    } else if (this.direction === 2) {  //East
      this.angle = 0;
      this.setVelocity(dt * this.speed, 0);

    } else if (this.direction === 6) {  //West
      this.angle = +180;
      this.setVelocity(dt * -this.speed, 0);
    }
  }
  movement(dt) {
    if (this.axis_direction === true)
      this.axis_movement(dt);
    else {
      this.setVelocity(this.direction.x * dt, this.direction.y * dt);
    }

    this.lifetime += dt;

    if (this.lifetime >= 10000)
      this.destroy();

  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);
    this.movement(dt);
  }


}