import Phaser from 'phaser'
import KnockbackObject from '../knockbackObject';
import Enemy from '../enemy';

/**
 * Clase que representa a los enemigos de tipo esqueleto.
 * 
 * El esqueleto tiene 2 estados.
 * -Idle donde espera a que el heroe se acerque a una distancia minima.
 *      Cuando el heroe se acerca, el esqueleto se activa y gotoPlayer
 * 
 * -GoToPlayer tiene otros dos estados
 *      -Moverse hacia el jugador lentamente. Es especialmente lento en el movimiento vertical
 *          ya que la idea de derrotarle es rodearle por arriba o por abajo.
 * 
 *      -Atacar cuando el jugador entra a un rango de deteccion. Ataca lentamente y pega mucho
 *          ya que la idea es que se esquive.
 * 
 * Solo puede recibir daño por la espalda y recibe muy poco knockback
 */
export default class Skeleton extends Enemy {

    constructor(scene, x, y, skeletonGroup = null, room, spriteSize = 2) {
        super(scene, x, y, 'skeleton', 0, null, room);

        this.attributes = {
            maxHealth: 12,
            health: 12,
            speed: 0,
            maxSpeed: 1,
            damage: 6
        }
          
        this.prepareAnimations();
        this.prepareHitBox(x, y, spriteSize);
        this.prepareLoot();

        this.skeletonHit = this.scene.sound.add("skeletonHit");

        //Movement parameters
        this.goingRight = true;
        this.minimumDistance = 250; //minimum distance to trigger skeleton reaction
        this.acelerationTween = null;

        this.updatePathTimer = null;

        this.velX = 0;
        this.velY = 0;
        this.path = null;

        //attack Parameters 
        this.preparingAttacktimer = null
        this.attackState = 0;
        this.attackLoopTimer = 0.3; //Time that the skeleton will hold the loop attack animation rdy to attack. In seconds
        this.attacking = false; //Prevent the start of a new attack while current attack is being played
        this.damageEvent = this.damageEvent;

        //Revive Parameters. They are only effective when there is a group, otherwise skeleton wont revive
        if (skeletonGroup !== null) {
            this.reviveTime = skeletonGroup.timer;
            this.isReviving = false; //Tracks if the current skeleton is waiting for revive
            this.group = skeletonGroup;
        }

        this.states = [
            "idle",
            "moveToPlayer",
            "attack",
            "hit",
            "dead",
        ]

        this.currentState = this.states[0];
    }

    prepareLoot() {
        this.loot = new Array();
        this.loot.push({ chance: 5, item: "soul" })
        this.loot.push({ chance: 10, item: "coin2" })
        this.loot.push({ chance: 20, item: "hearth" })
        this.loot.push({ chance: 30, item: "coin1" })

    }

    /*
    *   Idle state related functions
    */

    //Wait until player is at a minimumDistance to react and start the hunt
    idle() {
        if (Phaser.Math.Distance.BetweenPoints(this.scene.player, this) < this.minimumDistance)
            this.play("skeleton_react", true);
        else
            this.play("skeleton_idle", true);
    }

    acelerate() {
        this.attributes.speed = 0.001;   //necesary to evade a bug

        if (this.updatePathTimer !== null) this.updatePathTimer.remove(false);

        this.updatePathTimer = this.scene.time.addEvent({
            callback: () => {
                this.updatePathMethod();
            },
            repeat: -1,
            delay: 300
        })

        this.updatePathMethod();

        this.acelerationTween = this.scene.tweens.addCounter({
            from: 0,
            to: this.attributes.maxSpeed,
            duration: 2000,
            ease: Phaser.Math.Easing.Sine.In,
            repeat: 0,
            onUpdate: (tween) => {
                this.attributes.speed = tween.getValue();
            }
        });
    }

    /*
    *   Move to player state related functions
    */

    //Update the path to target the player
    updatePathMethod() {
        const targetX = Math.floor((this.scene.player.x - this.roomXoffset) / 32);
        const targetY = Math.floor((this.scene.player.y - this.roomYoffset) / 32);
        
        const fromX = Math.floor( (this.getCenter().x - this.roomXoffset) / 32);
        const fromY = Math.floor((this.getCenter().y + this.height / 2 - this.roomYoffset) / 32);

        this.scene.pathFinder.findPath(fromX, fromY, targetX, targetY, this.findPathCallback.bind(this))
        this.scene.pathFinder.calculate();

    }

    findPathCallback(path) {
        if (path === null) {
            this.pathIndex++;
            this.moveAlongThePath();
        } else {
            this.path = path;
            this.pathIndex = 0;
            this.moveAlongThePath();
        }
    }

    moveAlongThePath() {
        this.pathIndex++;
        this.moveToTargetInPath();

    }

    moveToTargetInPath(){
        if (this.pathIndex <= this.path.length - 1) {
            const targetX = (this.path[this.pathIndex].x * 32) + 16 + this.roomXoffset; this.targetX = targetX;
            const targetY = (this.path[this.pathIndex].y * 32) + 16 + this.roomYoffset; this.targetY = targetY;
            const fromX = this.getCenter().x;
            const fromY = this.getCenter().y + this.height / 2;

            this.velocityToTarget({ x: fromX, y: fromY }, { x: targetX, y: targetY }, this.attributes.speed);
        }

    }
    //To rotate the Matter box we need to use setScale(-2,2)
    moveToPlayer() {
        this.attacking = false; //While moving is not attacking

        this.setVelocity(this.velX, this.velY);
        this.play("skeleton_walk", true);

        if (this.path !== null)
            if (this.getCenter().x - 20 <= this.targetX && this.getCenter().x + 20 >= this.targetX
                && this.getCenter().y - 20 <= this.targetY && this.getCenter().y + 20 >= this.targetY) {

                this.pathIndex++;
                this.moveAlongThePath();
            }else{
                this.moveToTargetInPath();
            }

        if (this.scene.player.x - 20 > this.getCenter().x){
            this.setScale(2, 2);
            this.goingRight = true;
        }else if( this.scene.player.x + 20 < this.getCenter().x) {
            this.setScale(-2, 2);
            this.goingRight = false;
        }
            this.setFixedRotation();

    }

    /*
    *   Attack state related functions
    */
    //Check if the x are in front of the skeleton
    isInFront(x) {
        if (this.goingRight && x > this.getCenter().x
            || !this.goingRight && x < this.getCenter().x)
            return true;

        return false
    }
    //Reproduce the corresponding attack state animation
    attack() {
        this.setVelocity(0, 0); //Esto no hace nada ahora mismo porque es estatico.
        this.play("skeleton_attack" + this.attackState, true);
    }

    //Check if the player has collisioned with the detect area, we check if its right in front of us to start the attack
    detectPlayer(player, me) {
        if (player.label === "playerBody" && me.label === "detectArea" && this.isInFront(player.position.x)) {
            if (this.attacking === false) {

                this.attackState = 0;
                this.attacking = true;

                this.currentState = this.states[2];

                return true;
            }
        }
        return false;
    }

    //Check if the player has collisioned with the damage Area while we are in the attackState that can damage him
    damagePlayer(player, me) {
        if (player.label === "playerBody" && me.label === "damageArea" && this.isInFront(player.position.x) && this.attackState === 2) {

            if (this.anims.currentFrame.index === 1) {
                const knockbackForce = 1.5;
                const knockbackDuration = 1.5;
                const direction = new Phaser.Math.Vector2(player.gameObject.x - this.getCenter().x, player.gameObject.y - this.getCenter().y).normalize();

                player.gameObject.damageEvent(this.attributes.damage, "slashing", new KnockbackObject(direction, knockbackForce, knockbackDuration));
                return true;
            }
        }
        return false;
    }

    //Check if the player has collisioned with the damage Area while we are in the attackState that can damage him
    collisionWithPlayer(player, me) {
        if (player.label === "playerBody" && (me.label === "hitable" || me.label === "hitbox") ) {

            const knockbackForce = 0.5;
            const knockbackDuration = 0.5;
            const direction = new Phaser.Math.Vector2(player.gameObject.x - this.getCenter().x, player.gameObject.y - this.getCenter().y).normalize();

            player.gameObject.damageEvent(this.attributes.damage / 3, "slashing", new KnockbackObject(direction, knockbackForce, knockbackDuration));

        }
        return false;
    }

    /*
    *   Hit states related functions
    */
    //Check if the attack is from behind the skeleton, from where the skeleton is not looking
    isAttackFromBehind(x, y) {
        if (this.goingRight && x < this.getCenter().x
            || !this.goingRight && x > this.getCenter().x)
            return true;

        return false;

    }
    damageEvent(amount, type, knockbackObject = null, sourceX, sourceY) {

        if (this.isAttackFromBehind(sourceX, sourceY)) {
            //update animations, tweens and timers
            if( this.acelerationTween !== null) this.acelerationTween.stop();
            if( this.updatePathTimer !== null) this.updatePathTimer.remove(false);
            if( this.preparingAttacktimer !== null ) this.scene.time.removeEvent(this.preparingAttacktimer);
            
            
            //update other states parameters
            this.goingRight = !this.goingRight; //To dont let the player multihit the skeleton from behind each time
            this.attackState = 0;

            //Update stats
            this.attributes.health -= amount;
            if (this.attributes.health <= 0) {
                this.setVelocity(0, 0);
                this.currentState = this.states[4];
                this.setCollisionCategory(null);
                this.play("skeleton_dead");

            } else {
                this.currentState = this.states[3];
                this.play("skeleton_hit");

            }
            //Skeleton cant be knockbacked
        }

        this.skeletonHit.volume = this.scene.registry.values.sound/10;
        this.skeletonHit.play();
    }
    /*
    *   Dead states related functions
    */

    //Starts the final death and destroy of this skeleton
    startDeath() {
        this.acelerationTween.stop();
        this.scene.time.removeEvent(this.preparingAttacktimer);
        this.scene.time.removeEvent(this.reviveTimer);

        this.updatePathTimer.remove(false);

        this.setActive(false);
        this.setCollisionCategory(null);

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
    /*
    *   Collisions with the player and other objects
    */

    handleCollisionWith(other, me) {
        if (this.collisionWithPlayer(other, me))
            return;

        if (this.damagePlayer(other, me))
            return;

        if (this.detectPlayer(other, me))
            return;


    }

    //State machine
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
                this.attack();
                break;
            //Dummy states 
            case this.states[3]:
                break;
            case this.states[4]:
                break;
        }
    }


    prepareHitBox(x, y, size) {
        const bodies = Phaser.Physics.Matter.Matter.Bodies;
        const hitbox = bodies.rectangle(0, 14, 26, 26, { label: "hitbox", isSensor: false, density: 0 });
        const rect = bodies.rectangle(0, 0, 30, 55, { label: "hitable", isSensor: true });
        const detectArea = bodies.rectangle(50, 0, 70, 55, { label: "damageArea", isSensor: true, density: 0 });
        const damageArea = bodies.rectangle(40, 0, 45, 55, { label: "detectArea", isSensor: true, density: 0 });

        var compoundBody = Phaser.Physics.Matter.Matter.Body.create({
            parts: [hitbox, rect, damageArea, detectArea],
            frictionStatic: 0,
            frictionAir: 0,
            friction: 0,
            render: { sprite: { xOffset: 0.5, yOffset: 0.6 } }
        });

        this.scale = size;
        this.spriteSize = size;

        this.setExistingBody(compoundBody).setPosition(x, y);
        this.setMass(30);
        this.setFixedRotation();
    }

    prepareAnimations() {
        //Maquina de estados de las animaciones del esqueleto
        this.on("animationcomplete", (event) => {
            switch (event.key) {
                case "skeleton_react":
                    this.acelerate();
                    this.currentState = this.states[1];
                    break;
                case "skeleton_attack0":    //Start of the attack animation
                    this.attackState++;

                    this.preparingAttacktimer = this.scene.time.addEvent({
                        delay: this.attackLoopTimer * 1000,
                        callback: () => {
                            this.attackState++;
                        },
                        callbackScope: this,
                        loop: false
                    });
                    break;

                case "skeleton_attack1":    //loop with the weapon ready to attack
                    break;

                case "skeleton_attack2":    //Animation that can damage the player
                    this.attackState++;
                    break;

                case "skeleton_attack3":    //Last animation of the attack
                case "skeleton_hit":
                    this.acelerate();
                    this.currentState = this.states[1];
                    break;

                case "skeleton_dead":
                    if (this.group === null) {  //If there is no skeleton group, the it dies normaly
                        this.startDeath();
                    } else {
                        if (this.isReviving === false) {
                            //If is not reviving, it means it has been killed. We start a timer to reverse the dead and tell the group that it has been revivied

                            this.reviveTimer = this.scene.time.addEvent({
                                delay: this.reviveTime * 1000,
                                callback: () => {
                                    this.isReviving = true;
                                    this.group.reviveEvent();
                                    this.playReverse("skeleton_dead");
                                },
                                callbackScope: this,
                                loop: false
                            });
                            this.group.deadEvent();
                        } else {
                            //If it is reviving, it means the skeleton is ready to play again
                            this.isReviving = false;
                            this.attributes.health = this.attributes.maxHealth;
                            this.setCollisionCategory(1);

                            this.acelerate();
                            this.currentState = this.states[1];
                        }
                    }
            }
        })

        this.scene.anims.create({
            key: "skeleton_attack0",
            frameRate: 7,
            frames: this.anims.generateFrameNames("skeleton", {
                prefix: "attack",
                suffix: ".png",
                start: 0,
                end: 6,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "skeleton_attack2",
            frameRate: 7,
            frames: this.anims.generateFrameNames("skeleton", {
                prefix: "attack",
                suffix: ".png",
                start: 7,
                end: 12,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "skeleton_attack3",
            frameRate: 7,
            frames: this.anims.generateFrameNames("skeleton", {
                prefix: "attack",
                suffix: ".png",
                start: 13,
                end: 17,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "skeleton_attack1",
            frameRate: 7,
            frames: this.anims.generateFrameNames("skeleton", {
                prefix: "attack",
                suffix: ".png",
                start: 5,
                end: 6,
            }),
            repeat: -1
        });
        this.scene.anims.create({
            key: "skeleton_idle",
            frameRate: 7,
            frames: this.anims.generateFrameNames("skeleton", {
                prefix: "idle",
                suffix: ".png",
                start: 0,
                end: 10,
            }),
            repeat: -1
        });
        this.scene.anims.create({
            key: "skeleton_react",
            frameRate: 7,
            frames: this.anims.generateFrameNames("skeleton", {
                prefix: "react",
                suffix: ".png",
                start: 0,
                end: 3,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "skeleton_walk",
            frameRate: 7,
            frames: this.anims.generateFrameNames("skeleton", {
                prefix: "walk",
                suffix: ".png",
                start: 0,
                end: 12,
            }),
            repeat: -1
        });
        this.scene.anims.create({
            key: "skeleton_dead",
            frameRate: 7,
            frames: this.anims.generateFrameNames("skeleton", {
                prefix: "dead",
                suffix: ".png",
                start: 0,
                end: 14,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "skeleton_hit",
            frameRate: 7,
            frames: this.anims.generateFrameNames("skeleton", {
                prefix: "hit",
                suffix: ".png",
                start: 0,
                end: 7,
            }),
            repeat: 0
        });
    }
}