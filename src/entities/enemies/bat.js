import Phaser from 'phaser'
import KnockbackObject from '../knockbackObject';
import Enemy from '../enemy';

/**
 * Clase que representa a los enemigos de tipo murciélago.
 */
export default class Bat extends Enemy {

    constructor(scene, x, y, room) {
        super(scene, x, y, 'bat_ss', 0, null, room);

        this.attributes = {
            health: 12,
            speed: 0,
            maxSpeed: 2,
            damage: 1
        }
        
        this.prepareAnimations();
        this.prepareLoot();

        this.batHit = this.scene.sound.add("batHit");

        //Movement parameters
        this.direction = 0; // 0 = S, 1 = E, 2 = N, 3 = W, 4 = fullStop
        this.directionTimer = Date.now();
        this.directionChangeTime = 2;   //Time to mantain current direction. In seconds

        this.movementOffset = 0;  //Adds a random offset to the movement despite the direction
        this.movementOffsetTimer = Date.now();
        this.movementOffsetChangeTime = 1; //Time to mantain current movement offset. In seconds

        this.timeToLand = 10; //Once bat start to fly, time for it to start to land again. In seconds
        this.timeToFly = 10; //Once bat start to land, time for it to start to fly again. In seconds

        //Receive Damage parameters
        this.damageEvent = this.damageEvent;
        this.body.label = "hitable";
        this.stunnedTime = 2; //Time that the bat will be without trying to fly when it gets hit. In seconds
        this.dead = false;

        //Matter parameters
        this.setMass(30);
        this.setFrictionAir(0.2);

        this.states = [
            "starting to fly",
            "fly",
            "start to land",
            "hit",
        ];
        this.currentState = this.states[0];
    }

    prepareLoot() {
        this.loot = new Array();
        this.loot.push({ chance: 10, item: "hearth" })
        this.loot.push({ chance: 30, item: "coin1" })
    }
    /*
    *   Movement states related functions
    */

    //Execute a tween that progresively increase the bat speed
    startingToFly() {
        this.attributes.speed = 0;
        this.setVelocity(0, 0);

        this.scene.time.removeEvent(this.startToFlyTimer);

        this.changeBehaviour = this.scene.time.addEvent({
            delay: this.timeToLand * 1000,
            callback: () => {
                this.currentState = this.states[2];
            },
            loop: false
        })

        this.changeSpeed = this.scene.tweens.addCounter({
            from: 0,
            to: this.attributes.maxSpeed,
            duration: 5000,
            ease: Phaser.Math.Easing.Sine.In,
            repeat: 0,
            onUpdate: (tween) => {
                let newspeed = tween.getValue();
                if (newspeed >= 0.10)
                    this.attributes.speed = tween.getValue();
                else {
                    this.attributes.speed = 0;
                }
            },
        })

        this.currentState = this.states[1];
    }

    //Execute a tween that progresively reduce the bat speed
    startToLand() {
        this.scene.time.removeEvent(this.startToLandTimer);

        this.changeBehaviour = this.scene.time.addEvent({
            delay: this.timeToFly * 1000,
            callback: () => {
                this.currentState = this.states[0];
            },
            loop: false
        })

        this.changeSpeed = this.scene.tweens.addCounter({
            from: this.attributes.maxSpeed,
            to: 0,
            duration: 5000,
            ease: Phaser.Math.Easing.Sine.In,
            repeat: 0,
            onUpdate: (tween) => {
                let newspeed = tween.getValue();
                if (newspeed >= 0.10)
                    this.attributes.speed = tween.getValue();
                else {
                    this.attributes.speed = 0;
                }
            },
        })

        this.currentState = this.states[1];

    }

    //Check the speed of the bat and make it fly at the expected speed
    fly() {
        if (this.attributes.speed === 0) {

            this.setTexture("bat_ss", 0);

        } else {

            const framesPerSecond = Math.ceil((this.attributes.speed / this.attributes.maxSpeed) * 10);

            let frameIndex = 0;
            if (this.anims.currentFrame !== null)
                frameIndex = this.anims.currentFrame.index - 1;

            this.play({ key: 'bat_fly' + framesPerSecond, startFrame: frameIndex }, true);
        }

        this.moveBat();
    }

    changeDirection() {
        let newDirection = Phaser.Math.Between(0, 3);
        while (newDirection === this.direction) {
            newDirection = Phaser.Math.Between(0, 3);
        }

        this.direction = newDirection;
        this.directionTimer = Date.now();
    }

    //Move the bat based on the direction parameter
    moveBat() {
        //Update the offset
        if (Date.now() - (this.movementOffsetChangeTime * 1000) > this.movementOffsetTimer) {
            this.movementOffset = Phaser.Math.FloatBetween(-this.attributes.speed * 2 / 3, this.attributes.speed * 2 / 3);
            this.movementOffsetTimer = Date.now();
        }

        //Update the direction
        if (Date.now() - (this.directionChangeTime * 1000) > this.directionTimer) {
            this.changeDirection();
        }

        if (this.attributes.speed === 0)
            this.direction = 4;

        switch (this.direction) {
            case 0:
                this.setVelocity(this.movementOffset, this.attributes.speed);
                break;
            case 1:
                this.setVelocity(this.attributes.speed, this.movementOffset);
                break;
            case 2:
                this.setVelocity(this.movementOffset, -this.attributes.speed);
                break;
            case 3:
                this.setVelocity(-this.attributes.speed, this.movementOffset);
                break
            case 4:
                this.setVelocity(0, 0);
                break;
        }
    }

    /*
    *   Hit states related functions
    */

    damageEvent(amount, type, knockbackObject = null, sourceX, sourceY) {
        //update animations, tweens and timers
        this.scene.time.removeEvent(this.changeBehaviour);
        this.changeSpeed.stop();

        this.play("bat_hit");
        this.setVelocity(0, 0);

        this.currentState = this.states[3];

        //Update stats
        this.attributes.health -= amount;
        if (this.attributes.health <= 0) {
            this.dead = true;
        }

        this.changeBehaviour = this.scene.time.addEvent({
            delay: this.stunnedTime * 1000,
            callback: () => {
                this.currentState = this.states[0];
            },
            loop: false
        })

        this.batHit.volume = this.scene.registry.values.sound / 10;
        this.batHit.play();

        this.knockbackObject = knockbackObject;
    }

    //Starts the death and destroy this bat
    startDeath() {
        this.setCollisionCategory(null);
        this.setActive(false);
        this.setVelocity(0, 0);

        this.scene.time.removeEvent(this.changeBehaviour);

        this.room.enemyDead();
        
        this.scene.add.tween({
            targets: [this],
            ease: 'Sine.easeInOut',
            duration: 2000,
            delay: 0,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            },
            onComplete: () => {
                this.scene.events.emit('enemydead', this.loot, this.getCenter().x, this.getCenter().y);
                this.destroy();
            }
        });
    }

    //Apply the knockback if we got hit by a knockback, otherwise is a dummy state waiting for the changeBehaviour to change the currentState
    hit() {
        if (this.knockbackObject != null) {
            this.applyForce(this.knockbackObject.direction);
            this.scene.time.removeEvent(this.changeBehaviour);

            this.changeBehaviour = this.scene.time.addEvent({
                delay: this.knockbackObject.duration * 1000,
                callback: () => {
                    this.currentState = this.states[0];
                },
                loop: false
            })

            this.knockbackObject = null;
        }
    }

    /*
    *   Collisions with the player and other objects
    */

    handleCollisionWith(other) {
        //Colision with the player real hitbox, ignoring his sensors
        if (other.label === "playerBody") {
            const knockbackForce = 0.5;
            const knockbackDuration = 1;
            const direction = new Phaser.Math.Vector2(other.gameObject.x - this.x, other.gameObject.y - this.y).normalize();

            other.gameObject.damageEvent(this.attributes.damage, "phys", new KnockbackObject(direction, knockbackForce, knockbackDuration));

            //Colision with !sensors change current direction of the bat
        } else if (other.isSensor === false) {
            this.changeDirection();
        } else if (other === null)
            this.changeDirection();
    }


    //State machine
    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        switch (this.currentState) {
            case this.states[0]:
                this.startingToFly();
                break;
            case this.states[1]:
                this.fly();
                break;
            case this.states[2]:
                this.startToLand();
                break;
            case this.states[3]:
                this.hit();
                break;
        }

    }


    //Prepare all the animations and control the animations state machine
    prepareAnimations() {
        this.on("animationcomplete", (event) => {
            switch (event.key) {
                case "bat_hit":
                    this.setTexture("bat_ss", 0);
                    if (this.dead === true)
                        this.startDeath();
                    break;
            }
        });

        for (let i = 1; i <= 10; i++) {
            this.scene.anims.create({
                key: 'bat_fly' + i,
                frames: this.scene.anims.generateFrameNumbers('bat_ss', { start: 1, end: 3 }),
                frameRate: i,
                repeat: -1
            });
        }

        this.scene.anims.create({
            key: "bat_hit",
            frames: this.scene.anims.generateFrameNumbers('bat_ss', { start: 5, end: 7 }),
            frameRate: 5,
            repeat: 0
        });

    }
}