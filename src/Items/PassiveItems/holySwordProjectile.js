import Entity from '../../entities/entity';

/**
 * Clase que representa una espada sagrada que avanza en linea recta hasta golpear una pared o un enemigo
 */
export default class HolySwordProjectile extends Entity {

  constructor(scene, x, y, speed, direction, damage, texture, frame, source, managerRef) {
    super(scene, x, y, texture, frame);

    this.source = source;
    this.damage = damage;
    this.label = "proyectile";
    this.direction = direction;
    this.managerRef = managerRef;

    this.fire = null;

    this.configureMatter(x, y);
    this.calculateSpeed(direction, speed);
  }

  addFireEffect(fireEssence) {
    this.setTexture("fireholy_sword");
    this.fire = fireEssence;
  }

  calculateSpeed(direction, speed) {
    const diagonalCorrection = Math.cos(45);

    switch (direction) {
      case 0:
        this.xVel = 0;
        this.yVel = speed;
        this.angle = 90;
        break;
      case 1:
        this.xVel = speed * diagonalCorrection;
        this.yVel = speed * diagonalCorrection;
        this.angle = 45;
        break;
      case 2:
        this.xVel = speed;
        this.yVel = 0;
        this.angle = 0;
        break;
      case 3:
        this.xVel = speed * diagonalCorrection;
        this.yVel = -speed * diagonalCorrection;
        this.angle = -45;
        break;
      case 4:
        this.xVel = 0;
        this.yVel = -speed;
        this.angle = -90;
        break;
      case 5:
        this.xVel = -speed * diagonalCorrection;
        this.yVel = -speed * diagonalCorrection;
        this.angle = -135;
        break;
      case 6:
        this.xVel = -speed;
        this.yVel = 0;
        this.angle = -180;
        break;
      case 7:
        this.xVel = -speed * diagonalCorrection;
        this.yVel = speed * diagonalCorrection;
        this.angle = 135;
        break;
    }
  }

  // Configure matter parameters
  configureMatter(x, y) {
    this.setFixedRotation();
    this.setSensor(true);
  }


  handleCollisionWith(body) {
    if (body.gameObject === null) {
      
      this.managerRef.swordReady = true;
      this.destroy();

    } else if (body.gameObject.label !== "intheFloor" && body.gameObject.label !== "swordSwing") {
      if (body.gameObject !== this.source) {
        if (body.gameObject.hasOwnProperty("damageEvent") && body.label === "hitable" && body.gameObject !== this.source) {
          body.gameObject.damageEvent(this.damage, "piercing", null, this.x, this.y);
        }
        if (this.fire !== null) this.fire.activate(this.x, this.y, this.direction, 0);

        this.managerRef.swordReady = true;
        this.destroy();
      }
    }
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);
    this.setVelocity(this.xVel * dt, this.yVel * dt);
  }
}
