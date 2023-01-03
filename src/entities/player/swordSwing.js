import Phaser from 'phaser'
import Entity from '../entity';
import KnockbackObject from '../knockbackObject';

/**
 * Clase que representa un boomerang que avanza en linea recta un rango, espera ahi unos segundos, y vuelve a donde este el jugador
 */
export default class SwordSwing extends Entity {

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
    constructor(scene, player) {
        super(scene, player.x, player.y, "swordSwing_image", 0);
        this.player = player;

        this.player.swing = this;
        this.label = "swordSwing";

        //Damage with the sword targets
        this.thingsHit = new Array();

        this.prepareHitbox(player.facing);
        this.changePosition(player.x, player.y, player.facing);
        
        this.startDespawn();

    }
    prepareHitbox(facing) {
        const shape = this.scene.cache.json.get("swordSwingShape").swordSwing;
        this.setBody(shape);

        this.body.label = facing;

    }
    startDespawn() {
        this.scene.tweens.addCounter({
            from: 0,
            to: 10,
            duration: 550,
            ease: Phaser.Math.Easing.Cubic.In,
            repeat: 0,
            onUpdate: (tween) => {
                let newAlpha = (10 - tween.getValue()) / 10;
                this.setAlpha(newAlpha);
            },
            onComplete: () => {
                this.destroy();
            },
        })
    }
    changePosition(x, y, facing) {
        let angle = 0;

        switch (facing) {
            case 0:
                y += 30;
                break;
            case 1:
                x += 20;
                y += 20;
                angle = -45;
                break;
            case 2:
                x += 30;
                angle = -90;
                break;
            case 3:
                x += 23;
                y -= 23;
                angle = -90 - 45;
                break;
            case 4:
                y -= 35;
                angle = 180;
                break;
            case 5:
                x -= 23;
                y -= 23;
                angle = -180 - 45;
                break;
            case 6:
                x -= 25;
                angle = 90;
                break;
            case 7:
                x -= 20;
                y += 20;
                angle = 45;
                break;
        }
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.setVisible(true);
    }

    handleCollisionWith(other, me) {
        if (this.player.swordAttacking === true && this.player.swing === this) {
            if (other.gameObject !== null && other.label === "hitable" && other.gameObject.hasOwnProperty("damageEvent") && this.thingsHit.find(element => element === other.gameObject) === undefined) {
                this.thingsHit.push(other.gameObject);

                const knockbackForce = 1;
                const knockbackDuration = 1;
                const direction = new Phaser.Math.Vector2(other.gameObject.x - this.x, other.gameObject.y - this.y).normalize();

                other.gameObject.damageEvent(this.player.attributes.damage, "slashing", new KnockbackObject(direction, knockbackForce, knockbackDuration), this.player.getCenter().x, this.player.getCenter().y);
            }

        }

    }
}   