import Phaser from 'phaser'
import Entity from '../../entities/entity';
import KnockbackObject from '../../entities/knockbackObject';

/**
 * Clase que representa un boomerang que avanza en linea recta un rango, espera ahi unos segundos, y vuelve a donde este el jugador
 */
export default class BoomerangProjectile extends Entity {

  /**
   * Constructor del jugador
   * @param {Phaser.Scene} scene Escena
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {number} speed Velocidad del boomerang
   * @param {string} direction Punto cardinal de la direccion/orientacion
   * @param {number} daño Daño del boomerang
   * @param {number} range Rango antes de que empiece a volver
   */
  constructor(scene, x, y, speed = 7, direction, damage, range) {
    super(scene, x, y, "boomerang_ss", 0);

    this.speed = speed;
    this.scene = scene;
    this.direction = direction;
    this.damage = damage;
    this.label = "proyectile";
    this.range = range;
    this.thingsHit = new Array();

    this.fire = null;

    this.scene.anims.create({
      key: 'boomerang_anim',
      frames: this.scene.anims.generateFrameNumbers('boomerang_ss', { start: 0, end: 7 }),
      frameRate: 20,
      repeat: -1
    });

    this.play("boomerang_anim");
    this.going = true;

    this.on(Phaser.Input.Events.DESTROY, this.onDestroy, this);

    this.configureMatter(x, y);
    this.calculateTarget(this.x, this.y, true);
  }

  onDestroy() {
    this.scene.time.removeEvent(this.hoverTiming);
  }

  addFireEffect(fireEssence) {
    this.fire = fireEssence;
  }

  // Configure matter parameters
  configureMatter(x, y) {
    let bodies = Phaser.Physics.Matter.Matter.Bodies;
    let wood = bodies.circle(x, y, 16);

    this.setFixedRotation();
    this.setFrictionAir(0.0);
    this.setExistingBody(wood);
    this.setMass(30);
    this.setSensor(true);
  }

  calculateTarget(targetx, targety, addRange) {
    this.target = { x: targetx, y: targety };

    if (addRange === true) {
      switch (this.direction) {
        case 4:
          this.target.y = this.target.y - this.range;
          break;
        case 3:
          this.target.y = this.target.y - this.range;
          this.target.x = this.target.x + this.range;
          break;
        case 2:
          this.target.x = this.target.x + this.range;
          break;
        case 1:
          this.target.y = this.target.y + this.range;
          this.target.x = this.target.x + this.range;
          break;
        case 0:
          this.target.y = this.target.y + this.range;
          break;
        case 7:
          this.target.y = this.target.y + this.range;
          this.target.x = this.target.x - this.range;
          break;
        case 6:
          this.target.x = this.target.x - this.range;
          break;
        case 5:
          this.target.y = this.target.y - this.range;
          this.target.x = this.target.x - this.range;
      }
    }

    this.targetV = this.velocityToTarget({ x: this.x, y: this.y }, this.target, this.speed);
  }

  handleCollisionWith(body) {
    if (body.gameObject === null) {
      this.destroy();
    } else if (body.gameObject.label !== "intheFloor") {
      if (body.gameObject !== this.scene.player) {
        if (body.gameObject.hasOwnProperty("damageEvent") && body.label === "hitable" && this.thingsHit.find(element => element === body.gameObject) === undefined) {
          const knockbackForce = 0.5;
          const knockbackDuration = 0.5;
          const direction = new Phaser.Math.Vector2(body.gameObject.x - this.x, body.gameObject.y - this.y).normalize();
          body.gameObject.damageEvent(this.damage, "piercing", new KnockbackObject(direction, knockbackForce, knockbackDuration), this.x, this.y);
          this.thingsHit.push(body.gameObject);
        }
      } else if (this.going === false && body.label === "playerBody") {
        this.destroy();
      }
    }
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    if (this.x >= (this.target.x - 10) && this.x <= (this.target.x + 10) && this.y >= (this.target.y - 10) && this.y <= (this.target.y + 10)) {
      this.setVelocity(0, 0);

      if (this.going === true) {
        const random = Phaser.Math.Between(0,7);
        if (this.fire !== null) this.fire.activate(this.x, this.y, random, 0);
        this.hoverTiming = this.scene.time.addEvent({
          delay: 1500,
          callback: () => {
            this.returnToPlayer();
            const random = Phaser.Math.Between(0,7);
            if (this.fire !== null) this.fire.activate(this.x, this.y, random, 0);
          },
          callbackScope: this,
          loop: false
        });
        this.going = false;
      }
    } else if (this.going === true) {
      this.setVelocity(this.targetV.velX * dt, this.targetV.velY * dt);
    } else {
      this.setVelocity(this.targetV.velX * dt, this.targetV.velY * dt);
      this.calculateTarget(this.scene.player.x, this.scene.player.y, false);
    }
  }

  returnToPlayer() {
    this.calculateTarget(this.scene.player.x, this.scene.player.y, false)
    this.thingsHit = new Array();
  }

  velocityToTarget = (from, to, speed = 1) => {
      const direction = Math.atan((to.x - from.x) / (to.y - from.y));
      const speed2 = to.y >= from.y ? speed : -speed;

      return { velX: speed2 * Math.sin(direction), velY: speed2 * Math.cos(direction) };
  };
}
