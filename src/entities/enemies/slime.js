import Phaser from 'phaser'
import KnockbackObject from '../knockbackObject';
import Enemy from '../enemy';

/**
 * Clase que representa a los enemigos de tipo murciélago.
 */
export default class Slime extends Enemy {

    constructor(scene, x, y, color, size, room) {
        super(scene, x, y, color + "slime", 0, null, room);

        this.attributes = {
            health: 1,
            speed: 1,
            maxSpeed: 1,
            size: size,
        }
         
        this.size = this.attributes.size;
        this.color = color;     //blue, green or red
        this.prepareAnimations(color);
        this.prepareHitBox(x, y, this.size);
        this.prepareLoot();

        //Movement parameters
        this.jumpState = 0;
        this.velX = 0;
        this.velY = 0;

        //Attack parameters
        this.damage = 2;
        this.damageEvent = this.damageEvent;

        //Receive damage parameters
        this.dead = false;
        this.creating = true;

        this.states = [
            "idle",
            "moveToPlayer",
            "hit",
        ]
        this.playReverse("slime_dead" + this.color)
        this.currentState = -1; //To start doing the reverse animation
    }

    prepareLoot() {
        this.loot = new Array();
        this.loot.push({ chance: 5, item: "coin2" })
    }

    /*
    *   Idle state related functions
    */

    idle() {
        this.jumpState = 0;
        this.setVelocity(0, 0);
        this.play("slime_idle" + this.color, true);
    }

    /*
    *   Move to player state related functions
    */

    moveToPlayer() {
        if (this.jumpState === 0) {
            this.play("slime_jump" + this.jumpState + this.color, true);

            this.jumpState = -1;
            this.setVelocity(0, 0);
            
            const toX = Math.floor( (this.scene.player.getCenter().x - this.roomXoffset) / 32);
            const toY = Math.floor( (this.scene.player.getCenter().y - this.roomYoffset) / 32);
            const fromX = Math.floor( (this.getCenter().x - this.roomXoffset) / 32);
            const fromY = Math.floor( (this.getCenter().y - this.roomYoffset) / 32);

            this.scene.pathFinder.findPath(fromX, fromY, toX, toY, this.findPathCallback.bind(this))
            this.scene.pathFinder.calculate();
            
        } else if (this.jumpState === 1) {
            this.play("slime_jump" + this.jumpState + this.color, true);
            this.setVelocity(this.velX, this.velY);
        } else if (this.jumpState === 2) {
            this.play("slime_jump" + this.jumpState + this.color, true);
            this.setVelocity(0, 0);
        }


    }

    findPathCallback(path) {
        if (path === null) {
            this.velocityToTarget({ x: this.getCenter().x, y: this.getCenter().y }, { x: this.scene.player.getCenter().x, y: this.scene.player.getCenter().y }, this.attributes.speed);
        } else {
            if (path.length < 4) {
                this.velocityToTarget({ x: this.getCenter().x, y: this.getCenter().y }, { x: this.scene.player.getCenter().x, y: this.scene.player.getCenter().y }, this.attributes.speed);
            } else {
                const target = path[3];
                target.x = parseInt(target.x)*32 + parseInt(this.roomXoffset);
                target.y = parseInt(target.y)*32 + parseInt(this.roomYoffset);


                this.velocityToTarget({ x: this.getCenter().x, y: this.getCenter().y }, { x: target.x, y: target.y }, this.attributes.speed);
            }
        }
    }

    /*
    *   Hit states related functions
    */

    damageEvent(amount, type, knockbackObject = null, sourceX, sourceY) {
        if (this.dead === false) {
            this.jumpState = 0;

            this.dead = true;

            //Update stats
            this.attributes.health -= amount;
            if (this.attributes.health <= 0) {
                this.currentState = this.states[2];
                this.play("slime_dead" + this.color);
            }

            this.knockbackObject = knockbackObject;
        }
    }

    hit() {
        if (this.knockbackObject != null) {
            this.applyForce(this.knockbackObject.direction);
            this.knockbackObject = null;
        }
    }

    //Spawn 2 new children if the size is not the minimum
    spawnSlimeChildren() {
        this.room.enemyDead();

        this.attributes.size--;
        if (this.attributes.size !== 0) {
            new Slime(this.scene, this.scene.player.getCenter().x+10, this.scene.player.getCenter().y+10, this.color, this.attributes.size, this.room);
            new Slime(this.scene, this.scene.player.getCenter().x-10, this.scene.player.getCenter().y -10, this.color, this.attributes.size, this.room);
        }
        this.scene.events.emit('enemydead', this.loot, this.getCenter().x, this.getCenter().y);
        this.destroy();

    }

    /*
    *   Collisions with the player and other objects
    */
    handleCollisionWith(other) {
        if (other.label === "playerBody" && !this.creating) {

            const knockbackForce = 0.5;
            const knockbackDuration = 0.5;
            const direction = new Phaser.Math.Vector2(other.gameObject.x - this.getCenter().x, other.gameObject.y - this.getCenter().y).normalize();

            other.gameObject.damageEvent(this.attributes.size, "bludgeoning", new KnockbackObject(direction, knockbackForce, knockbackDuration));
        }
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        switch (this.currentState) {
            case this.states[0]:
                this.idle();
                break;
            case this.states[1]:
                this.moveToPlayer();
                break;
            case this.states[2]:
                this.hit();
                break;
        }
    }

    prepareHitBox(x, y, size) {
        let bodies = Phaser.Physics.Matter.Matter.Bodies;
        let mainBody = bodies.rectangle(0, 0, 20, 13, { label: "hitable" });


        this.setExistingBody(mainBody).setPosition(x, y).setOrigin(0.52, 0.85);
        this.setMass(15 + 10 * size);
        this.setScale(size);
        this.setFixedRotation();

    }

    prepareAnimations(color) {
        this.on("animationcomplete", (event) => {
            switch (event.key.slice(0, -this.color.length)) {
                case "slime_idle":
                    this.currentState = this.states[1];
                    break;
                case "slime_jump0":
                    this.setCollisionCategory(null);
                    this.jumpState = 1;
                    break;
                case "slime_jump1":
                    this.jumpState = 2;
                    this.setCollisionCategory(1);
                    break;

                case "slime_jump2":
                    this.currentState = this.states[0];
                    break;

                case "slime_dead":
                    if (this.currentState === this.states[2])
                        this.spawnSlimeChildren();
                    else {
                        this.currentState = this.states[0];
                        this.creating = false;
                    }
                    break;
            }
        });

        this.scene.anims.create({
            key: "slime_dead" + color,
            frameRate: 8,
            frames: this.anims.generateFrameNames(color + "slime", {
                prefix: "death",
                suffix: ".png",
                start: 1,
                end: 10,
            }),
            repeat: 0
        });
        this.scene.anims.create({   //Unused
            key: "slime_attack" + color,
            frameRate: 7,
            frames: this.anims.generateFrameNames(color + "slime", {
                prefix: "attack",
                suffix: ".png",
                start: 1,
                end: 14,
            }),
            repeat: -1
        });
        this.scene.anims.create({
            key: "slime_idle" + color,
            frameRate: 7,
            frames: this.anims.generateFrameNames(color + "slime", {
                prefix: "idle",
                suffix: ".png",
                start: 1,
                end: 4,
            }),
            repeat: 3
        });
        this.scene.anims.create({
            key: "slime_jump0" + color,
            frameRate: 7,
            frames: this.anims.generateFrameNames(color + "slime", {
                prefix: "jump",
                suffix: ".png",
                start: 1,
                end: 4,
            }),
            repeat: 0
        });
        this.scene.anims.create({   //In the air animation
            key: "slime_jump1" + color,
            frameRate: 7,
            frames: this.anims.generateFrameNames(color + "slime", {
                prefix: "jump",
                suffix: ".png",
                start: 5,
                end: 13,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "slime_jump2" + color,
            frameRate: 7,
            frames: this.anims.generateFrameNames(color + "slime", {
                prefix: "jump",
                suffix: ".png",
                start: 14,
                end: 18,
            }),
            repeat: 0
        });
    }
}