import Phaser from 'phaser'
import KnockbackObject from '../knockbackObject';
import Enemy from '../enemy';
import Arrow from '../arrow';

/**
 * Clase que representa a los enemigos de tipo murciélago.
 */
export default class Archer extends Enemy {

    constructor(scene, x, y, room) {
        super(scene, x, y, "archer", 0, null, room);

        this.bowShotSound = this.scene.sound.add("bowShotSound");

        this.attributes = {
            health: 12,
            speed: 0.08,
            damage: 2,
            arrowSpeed: 0.5
        }

        //PATH
        this.path = null;
        this.updatePathTimer = null;
        this.pathIndex = 0;

        //MOVEMENT TARGET
        this.targetX = null;
        this.targetY = null;

        this.velX = 0;
        this.velY = 0;
        
        //ATTACK
        this.attackReady = true;
        this.attackState = 0;

        this.prepareAnimations();
        this.prepareHitBox(x, y);
        this.prepareLoot();

        this.damageEvent = this.damageEvent;

        this.states = [
            "moveToPlayer",
            "attack",
            "aimAttack",
            "dash",
            "dead"
        ]
        this.currentState = this.states[0];


        this.updatePath();

    }
    /**
     * 
     * PATH FUNCTIONS
     * 
     */
    updatePath() {
        if (this.updatePathTimer !== null) this.updatePathTimer.remove(false);

        this.updatePathTimer = this.scene.time.addEvent({
            callback: () => {
                this.updatePath();
            },
            repeat: -1,
            delay: 200
        })

        const targetX = this.targetX;
        const targetY = this.targetY;

        const fromX = Math.floor((this.getCenter().x - this.roomXoffset) / 32);
        const fromY = Math.floor((this.getCenter().y + this.height/2 - this.roomYoffset) / 32);

        if (targetX !== null && targetY !== null) {
            this.scene.pathFinder.findPath(fromX, fromY, targetX, targetY, this.findPathCallback.bind(this))
            this.scene.pathFinder.calculate();
        }
    }

    findPathCallback(path) {
        this.path = path;

        if (this.path.length > 7 && (this.currentState === this.states[0] || this.currentState === this.states[1])) {  //Si esta lejos y no esta cargando el ataque apuntado
            this.pathIndex = 0;
            this.moveAlongThePath();
            this.currentState = this.states[0];
        } else if (this.currentState === this.states[3]) {
            this.pathIndex = 0;
            this.moveAlongThePath();
        }

    }
    moveAlongThePath() {
        this.pathIndex++;
        if (this.pathIndex <= this.path.length - 1) {

            const targetX = (this.path[this.pathIndex].x * 32) + 16 + this.roomXoffset; this.targetPathX = targetX;
            const targetY = (this.path[this.pathIndex].y * 32) + 16 + this.roomYoffset; this.targetPathY = targetY;
            const fromX = this.getCenter().x;
            const fromY = this.getCenter().y;

            this.velocityToTarget({ x: fromX, y: fromY }, { x: targetX, y: targetY }, this.attributes.speed);
        }

    }

    //MOVE TO PLAYER
    isInPathTarget() {
        return this.getCenter().x - 40 <= this.targetPathX && this.getCenter().x + 40 >= this.targetPathX
            && this.getCenter().y - 40 <= this.targetPathY && this.getCenter().y + 40 >= this.targetPathY;;
    }

    isPlayerInAxis() {
        return (this.scene.player.getCenter().x - 32 <= this.getCenter().x && this.scene.player.getCenter().x + 32 >= this.getCenter().x)
            || (this.scene.player.getCenter().y - 32 <= this.getCenter().y && this.scene.player.getCenter().y + 32 >= this.getCenter().y)
    }

    moveToPlayer() {
        this.targetX = Math.floor((this.scene.player.x - this.roomXoffset) / 32);
        this.targetY = Math.floor((this.scene.player.y - this.roomYoffset) / 32);

        if (this.path !== null) {

            if (this.isInPathTarget()) {
                this.moveAlongThePath();
            }

            if (this.path.length < 7) {
                this.attackState = 0;
                this.currentState = this.states[1];
            } else
                if (this.isPlayerInAxis())
                    this.currentState = this.states[2];

            this.setVelocity(this.velX_real, this.velY_real);
            this.play("archer_run", true);
        }
    }

    /**
     * RAPID ATTACK
     */
    rapidAttack() {
        this.setVelocity(0, 0);
        this.targetX = Math.floor((this.scene.player.x - this.roomXoffset) / 32);
        this.targetY = Math.floor((this.scene.player.y - this.roomYoffset) / 32);

        if (this.attackState === 0) {
            this.play("archer_normalAttack", true);

            if (this.anims.currentFrame.index === 8) {
                if (this.attackReady) {
                    this.attackReady = false;
                    this.shootArrow(false);
                }
            } else {
                this.attackReady = true;
            }
        } else if (this.attackState === 1) {
            this.play("archer_normalAttack_loop", true);

            if (this.anims.currentFrame.index === 6) {
                if (this.attackReady) {
                    this.attackReady = false;
                    this.shootArrow(false);
                }
            } else {
                this.attackReady = true;
            }
        }
    }


    shootArrow(isAimed) {
        const targetX = this.scene.player.getCenter().x;
        const targetY = this.scene.player.getCenter().y;
        const fromX = this.getCenter().x;
        const fromY = this.getCenter().y;

        let angle = Phaser.Math.Angle.Between(fromX, fromY, targetX, targetY);
        angle = angle * 180 / Math.PI;

        const arrowSpeed = this.velocityToTarget({ x: fromX, y: fromY }, { x: targetX, y: targetY }, this.attributes.arrowSpeed, false);

        if (isAimed)
            new Arrow(this.scene, this.getCenter().x, this.getCenter().y, 1, { x: arrowSpeed.x, y: arrowSpeed.y, angle: angle }, this.attributes.damage * 2, this, false, true, true);
        else
            new Arrow(this.scene, this.getCenter().x, this.getCenter().y, 1, { x: arrowSpeed.x, y: arrowSpeed.y, angle: angle }, this.attributes.damage * 2, this, false, false, true);

        this.bowShotSound.volume = this.scene.registry.values.sound / 10;
        this.bowShotSound.play();
    }
    //AIM ATTACK

    aimAttack() {
        this.setVelocity(0, 0);
        this.play("archer_lowAttack", true);

        if (this.anims.currentFrame.index === 10) {
            if (this.attackReady) {
                this.attackReady = false;
                this.shootArrow(true);
            }
        } else {
            this.attackReady = true;
        }

    }

    //HIT & DASH
    damageEvent(amount, type, knockbackObject = null, sourceX, sourceY) {

        if (this.currentState !== this.states[3] && this.currentState !== this.states[4]) {
            this.attributes.health -= amount;
            this.anims.stop();

            this.setCollisionCategory(null);

            if (this.attributes.health <= 0) {
                this.currentState = this.states[4];

                this.play("archer_death");

            } else {
                this.currentState = this.states[3];
                this.dashState = 0;
                this.readyToDash = false;

                this.play("archer_hit");

                this.calculateDashTarget();
            }
            this.applyForce(knockbackObject.direction);
        }

    }
    calculateDashTarget() {
        const player = { x: (this.scene.player.getCenter().x - this.roomXoffset) / 32, y: (this.scene.player.getCenter().y - this.roomYoffset) / 32 };

        const points = new Array();
        points.push({ x: 2, y: 2 });
        points.push({ x: 2, y: (512 / 32) - 3 });
        points.push({ x: (768 / 32) - 3, y: (512 / 32) - 3 });
        points.push({ x: (768 / 32) - 3, y: 2 });

        let closestPoint = points[0];
        let closestDistance = Phaser.Math.Distance.BetweenPoints(player, { x: points[0].x, y: points[0].y });

        for (let i = 1; i < 4; i++) {
            const distance = Phaser.Math.Distance.BetweenPoints(player, { x: points[i].x, y: points[i].y });

            if (distance < closestDistance) { closestPoint = points[i]; closestDistance = distance; }
        }

        const index = points.indexOf(closestPoint);
        points.splice(index, 1);

        closestPoint = points[Phaser.Math.Between(0, 2)];

        this.targetX = closestPoint.x;
        this.targetY = closestPoint.y;
    }

    startDeath() {
        if (this.updatePathTimer !== null) this.updatePathTimer.remove(false);

        this.room.enemyDead();
        this.setActive(false);

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
    calculateStartDashSpeed() {
        switch (this.anims.currentFrame.index) {
            case 0:
                this.setVelocity(0, 0);
                break;
            case 1:
                const vel1 = 0.3;
                this.setVelocity(this.velX_real * vel1, this.velY_real * vel1);
                break;
            case 2:
                const vel2 = 0.6;
                this.setVelocity(this.velX_real * vel2, this.velY_real * vel2);
                break;
            case 3:
                const vel3 = 1
                this.setVelocity(this.velX_real * vel3, this.velY_real * vel3);
                break;
            case 4:
                const vel4 = 2;
                this.setVelocity(this.velX_real * vel4, this.velY_real * vel4);
                break;
            case 5:
                const vel5 = 3;
                this.setVelocity(this.velX_real * vel5, this.velY_real * vel5);
                break;
            case 6:
                const vel6 = 3.5;
                this.setVelocity(this.velX_real * vel6, this.velY_real * vel6);
                break;

        }
    }

    calcualteLoopDashSpeed() {
        const vel0 = 3.5;

        switch (this.anims.currentFrame.index) {
            case 0:
                this.setVelocity(this.velX_real * vel0, this.velY_real * vel0);
                break;
            case 1:
                const vel1 = 4.5;
                this.setVelocity(this.velX_real * vel1, this.velY_real * vel1);
                break;
            case 2:
                this.setVelocity(this.velX_real * vel0, this.velY_real * vel0);
                break;
        }
    }

    dash() {
        if (this.readyToDash) {

            if (this.isInPathTarget()) {
                this.moveAlongThePath();
            }

            if (this.dashState === 0) {
                this.play("archer_dash", true);
                this.calculateStartDashSpeed();

            } else if (this.dashState === 1) {
                this.play("archer_dash_loop", true);
                this.calcualteLoopDashSpeed();
            }

            if (this.path.length <= 2) {
                this.setAlpha(1);
                this.setCollisionCategory(1);
                this.setVelocity(0, 0);
                this.currentState = this.states[0];
            }
        }

    }

    faceTarget() {
        if (this.currentState === this.states[1] || this.currentState === this.states[2]) {
            if (this.scene.player.getCenter().x > this.getCenter().x)
                this.setScale(1, 1);
            else
                this.setScale(-1, 1);

        } else {
            if (this.velX > 0)
                this.setScale(1, 1);
            else
                this.setScale(-1, 1);
        }
        this.setFixedRotation();
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        this.faceTarget();

        this.velX_real = this.velX * dt;
        this.velY_real = this.velY * dt;

        switch (this.currentState) {
            case this.states[0]:
                this.moveToPlayer();
                break;
            case this.states[1]:
                this.rapidAttack();
                break;
            case this.states[2]:
                this.aimAttack();
                break;
            case this.states[3]:
                this.dash();
                break;
        }
    }

    prepareHitBox(x, y) {

        let bodies = Phaser.Physics.Matter.Matter.Bodies;
        let mainBody = bodies.rectangle(0, 0, 25, 25, { label: "hitable" });

        this.setExistingBody(mainBody).setPosition(x, y).setOrigin(0.42, 0.60);
        this.setFixedRotation();
    }

    prepareAnimations() {
        //Maquina de estados de las animaciones del arquero
        this.on("animationcomplete", (event) => {
            switch (event.key) {
                case "archer_normalAttack":
                    this.attackState = 1;

                    break;
                case "archer_lowAttack":
                    this.currentState = this.states[0];
                    break;

                case "archer_normalAttack_loop":
                    break;

                case "archer_death":
                    this.startDeath();
                    break;

                case "archer_hit":
                    this.readyToDash = true;
                    this.setAlpha(0.5);

                    this.pathIndex = 0;
                    this.moveAlongThePath();
                    break;

                case "archer_dash":
                    this.dashState = 1;
                    break;
            }
        })

        this.scene.anims.create({
            key: "archer_dash",
            frameRate: 7,
            frames: this.anims.generateFrameNames("archer", {
                prefix: "dash_",
                suffix: ".png",
                start: 0,
                end: 6,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "archer_dash_loop",
            frameRate: 7,
            frames: this.anims.generateFrameNames("archer", {
                prefix: "dash_loop_",
                suffix: ".png",
                start: 0,
                end: 2,
            }),
            repeat: -1
        });
        this.scene.anims.create({
            key: "archer_death",
            frameRate: 7,
            frames: this.anims.generateFrameNames("archer", {
                prefix: "death_",
                suffix: ".png",
                start: 0,
                end: 9,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "archer_hit",
            frameRate: 7,
            frames: this.anims.generateFrameNames("archer", {
                prefix: "death_",
                suffix: ".png",
                start: 0,
                end: 2,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "archer_hightAttack",
            frameRate: 7,
            frames: this.anims.generateFrameNames("archer", {
                prefix: "HA_",
                suffix: ".png",
                start: 0,
                end: 12,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "archer_hightAttack_loop",
            frameRate: 7,
            frames: this.anims.generateFrameNames("archer", {
                prefix: "HA_loop_",
                suffix: ".png",
                start: 0,
                end: 5,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "archer_idle",
            frameRate: 4,
            frames: this.anims.generateFrameNames("archer", {
                prefix: "idle_",
                suffix: ".png",
                start: 0,
                end: 1,
            }),
            repeat: -1
        });
        this.scene.anims.create({
            key: "archer_run",
            frameRate: 7,
            frames: this.anims.generateFrameNames("archer", {
                prefix: "run_",
                suffix: ".png",
                start: 0,
                end: 7,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "archer_duck",
            frameRate: 7,
            frames: this.anims.generateFrameNames("archer", {
                prefix: "duck_",
                suffix: ".png",
                start: 0,
                end: 2,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "archer_duck_out",
            frameRate: 7,
            frames: this.anims.generateFrameNames("archer", {
                prefix: "duck_out_",
                suffix: ".png",
                start: 0,
                end: 2,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "archer_lowAttack",
            frameRate: 6,
            frames: this.anims.generateFrameNames("archer", {
                prefix: "LA_",
                suffix: ".png",
                start: 0,
                end: 14,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "archer_lowAttack_loop",
            frameRate: 7,
            frames: this.anims.generateFrameNames("archer", {
                prefix: "LA_loop_",
                suffix: ".png",
                start: 0,
                end: 5,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "archer_normalAttack",
            frameRate: 7,
            frames: this.anims.generateFrameNames("archer", {
                prefix: "NA_",
                suffix: ".png",
                start: 0,
                end: 9,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "archer_normalAttack_loop",
            frameRate: 4.5,
            frames: this.anims.generateFrameNames("archer", {
                prefix: "NA_loop_",
                suffix: ".png",
                start: 0,
                end: 5,
            }),
            repeat: 0
        });
    }
    prepareLoot() {
        this.loot = new Array();
        this.loot.push({ chance: 5, item: "soul" })
        this.loot.push({ chance: 10, item: "coin2" })
        this.loot.push({ chance: 20, item: "hearth" })
        this.loot.push({ chance: 50, item: "coin1" })

    }
}