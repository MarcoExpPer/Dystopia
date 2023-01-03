import Phaser from 'phaser'
import KnockbackObject from '../knockbackObject';
import Enemy from '../enemy';

/**
 * Clase que representa a los enemigos de tipo murciélago.
 */
export default class GhostSummoning extends Enemy {

    constructor(scene, x, y, damage, speed) {
        super(scene, x, y, 'summon', 0, null);

        this.damage = damage;
        this.speed = speed;

        this.attack = false;

        this.prepareHitBox(x, y);
        this.prepareAnimations();

        this.damageEvent = this.damageEvent;
    }

    damageEvent() {
        if (this.attack) {
            this.setVelocity(0, 0);

            this.play("summon_death");
            this.attack = false;
        }
    }

    startDeath() {
        this.destroy();
    }

    handleCollisionWith(body) {
        //if it impacts with the nothingness of the void
        if (body.gameObject === null) {

            this.play("summon_death");
            this.attack = false;

        } else if (body.gameObject.label !== "intheFloor") { //Dont impact with the looteables

            if (body.gameObject.hasOwnProperty("damageEvent") && body.label === "playerBody" && this.attack === true) {

                const knockbackForce = 0.5;
                const knockbackDuration = 0.5;
                const direction = new Phaser.Math.Vector2(body.gameObject.x - this.x, body.gameObject.y - this.y).normalize();

                body.gameObject.damageEvent(this.damage, "piercing", new KnockbackObject(direction, knockbackForce, knockbackDuration), this.x, this.y);

                this.play("summon_death");
                this.attack = false;
            }
        }
    }

    prepareHitBox() {
        this.setSensor(true);

        this.body.label = "hitable"
        this.label = "hitable";
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        if (this.attack) {
            this.setVelocity(this.velX * dt, this.velY * dt);
        }
    }

    fly() {
        this.attack = true;

        const targetX = this.scene.player.getCenter().x;
        const targetY = this.scene.player.getCenter().y + Phaser.Math.Between(-40, 40);
        const fromX = this.getCenter().x;
        const fromY = this.getCenter().y;

        this.velocityToTarget({ x: fromX, y: fromY }, { x: targetX, y: targetY }, this.speed);

    }

    prepareAnimations() {
        //Maquina de estados de las animaciones del fantasma
        this.on("animationcomplete", (event) => {
            switch (event.key) {
                case "summon_spawn":
                    this.play("summon_idle");
                    break;
                case "summon_death":
                    this.startDeath();
                    break;
            }
        })

        this.scene.anims.create({
            key: "summon_spawn",
            frameRate: 5,
            frames: this.anims.generateFrameNames("summon", {
                prefix: "spawn_",
                suffix: ".png",
                start: 0,
                end: 5,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "summon_idle",
            frameRate: 5,
            frames: this.anims.generateFrameNames("summon", {
                prefix: "idle_",
                suffix: ".png",
                start: 0,
                end: 3,
            }),
            repeat: -1
        });
        this.scene.anims.create({
            key: "summon_death",
            frameRate: 5,
            frames: this.anims.generateFrameNames("summon", {
                prefix: "death_",
                suffix: ".png",
                start: 0,
                end: 4,
            }),
            repeat: 0
        });


    }
}