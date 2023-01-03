import Phaser from 'phaser'
import Entity from '../entity';
import KnockbackObject from '../knockbackObject';
/**
 * Clase que representa una flecha que avanza en la direccion indicada hasta que choca con algo.
 */
export default class GhostSwing extends Entity {

    /**
     * Constructor del jugador
     * @param {Phaser.Scene} scene Escena a la que pertenece la flecha
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     * @param {number} speed Velocidad de la flecha
     * @param {string} direction Punto cardinal de la direccion/orientacion de la flecha
     */
    constructor(scene, x, y, speed, goingRight, damage, type) {
        super(scene, x, y, "ghost_swing" + type, 0);

        this.speed = speed;
        this.damage = damage;

        this.label = "proyectile";

        this.configureMatter(x, y, goingRight, type);
        this.originalX = this.getCenter().x;

        if (!goingRight)
            this.speed = -this.speed;


    }


    //Configure matter parameters
    configureMatter(x, y, goingRight, type) {
        let shape;
        if (type === 1)
            shape = this.scene.cache.json.get("ghost_swing1_shape").swing_1;
        else
            shape = this.scene.cache.json.get("ghost_swing2_shape").swing_2;

        this.setBody(shape);

        if (!goingRight)
            this.setScale(-1, 1);

        this.setPosition(x, y);
        this.setFixedRotation();
    }

    handleCollisionWith(body) {
        //if it impacts with the nothingness of the void
        if (body.gameObject === null) {
            this.x += 2000;

        } else if (body.gameObject.label !== "intheFloor") { //Dont impact with the looteables

            if (body.gameObject.hasOwnProperty("damageEvent") && body.label === "playerBody") {
                const knockbackForce = 0.5;
                const knockbackDuration = 0.5;
                const direction = new Phaser.Math.Vector2(body.gameObject.x - this.x, body.gameObject.y - this.y).normalize();

                body.gameObject.damageEvent(this.damage, "piercing", new KnockbackObject(direction, knockbackForce, knockbackDuration), this.x, this.y);
                this.x += 2000;
            }
            
        }
    }

    movement(dt) {
        this.setVelocity(this.speed * dt, 0);
    }

    checkIfDespawn() {
        if (Math.abs(this.getCenter().x - this.originalX) >= 150)
            this.destroy();
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        this.movement(dt);
        this.checkIfDespawn();
    }


}