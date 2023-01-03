import Phaser from 'phaser'
import KnockbackObject from '../knockbackObject';
import Enemy from '../enemy';
import GhostSwing from './ghostSwing';
import GhostSummoning from './ghostSummoning';

/**
 * Clase que representa a los enemigos de tipo murciélago.
 */
export default class Ghost extends Enemy {

    constructor(scene, spawnPoints, room) {
        super(scene, 0, 0, 'ghost', 0, null, room);

        this.spawnPoints = spawnPoints;

        this.vulnerableTimer = null;

        this.summoningsArray = new Array();
        this.summonNumber = 3;
        this.currentSummonNumber = 0;

        this.lookingRight = true;

        this.states = [
            "idle",
            "longTp",
            "smallTp",
            "attack1",
            "attack2",
            "attackEnd",
            "summon",
            "death",
        ]
        this.currentState = this.states[1];

        this.attributes = {
            health: 240,
            damage: 8,
            swingSpeed: 0.3,
        }

        this.prepareHitBox(0, 0);
        this.prepareAnimations();

        this.damageEvent = this.damageEvent;

        this.fadeChange = null;
        this.sendTimer = null;

        this.fadeInSpawnPoint(true);

    }

    //Long tp moves the ghost to the farthest spawn point and attack with summons
    longTeleport() {
        if (this.currentState !== this.states[7]) {
            this.currentState = this.states[1];

            this.scene.time.removeEvent(this.vulnerableTimer);
            this.vulnerableTimer = null;

            this.tpState = 1;

            this.fadeOut();

            this.play("ghost_skill_start", true);
        }
    }

    //Firts time in the combat that it fades in from a spawn Point, it does a melee attack
    fadeInSpawnPoint(initial = false) {
        let index = 1;
        if (this.scene.player.x - this.roomXoffset >= 350)
            index = 0;

        const x = this.spawnPoints[index].x + this.roomXoffset;
        const y = this.spawnPoints[index].y + this.roomYoffset;

        this.x = x;
        this.y = y;

        this.lookToPlayer();

        this.fadeChange = this.scene.add.tween({
            targets: [this],
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 0,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            },
            onComplete: () => {
                if (initial)
                    this.attack()
                else
                    this.summon();
            }
        });
    }

    fadeOut() {
        this.fadeChange = this.scene.add.tween({
            targets: [this],
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 0,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            }
        });
    }
    //Little tp moves the ghost to the player and melee attack him
    littleTeleport() {
        this.currentState = this.states[2];

        this.tpState = 0;

        this.fadeOut();

        this.play("ghost_skill_start", true);
    }

    fadeInCloseToPlayer() {
        let xOffset = 100;
        if (Phaser.Math.Between(0, 1))
            xOffset = -xOffset

        const x = this.scene.player.getCenter().x + xOffset;
        const y = this.scene.player.getCenter().y;

        this.x = x;
        this.y = y;

        this.lookToPlayer();

        this.fadeChange = this.scene.add.tween({
            targets: [this],
            ease: 'Sine.easeInOut',
            duration: 1000,
            delay: 0,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            },
            onComplete: () => {
                this.attack()
            }
        });
    }
    //When tp animation ends, tp starts
    tpExecution() {
        this.play("ghost_skill_executing");

        if (this.currentState === this.states[1])
            this.fadeInSpawnPoint();
        else
            this.fadeInCloseToPlayer();
    }
    /**
     * ATTACKS
     * 
     */
    attack() {
        this.currentState = this.states[3];

        this.play("ghost_attack1");
    }

    attack1Ends() {
        this.currentState = this.states[4];

        let xoffset = 100;
        if (!this.lookingRight)
            xoffset = -xoffset;

        new GhostSwing(this.scene, this.getCenter().x + xoffset, this.getCenter().y, this.attributes.swingSpeed, this.lookingRight, this.attributes.damage / 2, 1);

        this.play("ghost_attack2", true);
    }

    attack2Ends() {
        this.currentState = this.states[5];

        let xoffset = 100;
        if (!this.lookingRight)
            xoffset = -xoffset;

        new GhostSwing(this.scene, this.getCenter().x + xoffset, this.getCenter().y, this.attributes.swingSpeed, this.lookingRight, this.attributes.damage / 2, 2);

        this.play("ghost_attackends", true);
    }

    /**
     * COLISIONS
     */
    collisionWithPlayer(player, me) {
        if (player.label === "playerBody" && me.label === "hitable") {

            const knockbackForce = 0.5;
            const knockbackDuration = 0.5;
            const direction = new Phaser.Math.Vector2(player.gameObject.x - this.getCenter().x, player.gameObject.y - this.getCenter().y).normalize();

            player.gameObject.damageEvent(this.attributes.damage / 4, "slashing", new KnockbackObject(direction, knockbackForce, knockbackDuration));

        }
        return false;

    }

    damagePlayer(player, me) {
        if (player.label === "playerBody" && me.label === "damageArea"
            && ((this.currentState === this.states[3] && this.anims.currentFrame.index === 3)
                || (this.currentState === this.states[4] && this.anims.currentFrame.index === 7))) {

            const knockbackForce = 1.5;
            const knockbackDuration = 1.5;
            const direction = new Phaser.Math.Vector2(player.gameObject.x - this.getCenter().x, player.gameObject.y - this.getCenter().y).normalize();

            player.gameObject.damageEvent(this.attributes.damage, "slashing", new KnockbackObject(direction, knockbackForce, knockbackDuration));
            return true;

        }
        return false;
    }
    handleCollisionWith(other, me) {
        if (this.collisionWithPlayer(other, me))
            return;

        if (this.damagePlayer(other, me))
            return;

    }
    /**
     *  SUMMON FUNCTIONS
     */

    summon() {
        this.currentState = this.states[6];

        this.currentSummonNumber = 0;
        this.summoningsArray = new Array();

        const input = { r: this.width / 2, n: this.summonNumber, a: 0, cx: 0, cy: 0, round: 0 };
        this.calcPolygon(input)

        this.play("ghost_summon");
    }

    calcPolygon(input) {
        this.summonLocation = new Array();
        for (var i = 1; i <= input.n; i++) {
            this.summonLocation.push({
                x: ((input.r * Math.cos(input.a + 2 * i * Math.PI / input.n)) + input.cx).toFixed(input.round),
                y: ((input.r * Math.sin(input.a + 2 * i * Math.PI / input.n)) + input.cy).toFixed(input.round)
            })
        }
    }

    summonLoop() {
        if (this.currentSummonNumber < this.summonNumber) {
            this.createSummoning();
            this.currentSummonNumber++;

            this.play("ghost_summon", true);
        } else
            this.summonEnds();
    }

    summonEnds() {
        this.summonNumber++;
        this.sendSummonings();

    }

    createSummoning() {
        const x = parseInt(this.summonLocation[this.currentSummonNumber].x) + this.getCenter().x;
        const y = parseInt(this.summonLocation[this.currentSummonNumber].y) + this.getCenter().y;

        const summon = new GhostSummoning(this.scene, x, y, this.attributes.damage / 4, this.attributes.swingSpeed * 1);
        this.summoningsArray.push(summon);

    }

    sendSummonings() {
        if (this.currentSummonNumber > 0) {
            this.currentSummonNumber--;

            this.sendTimer = this.scene.time.addEvent({
                delay: Math.max(0, 330 - this.summonNumber * 10),
                callback: () => {
                    this.summoningsArray[this.currentSummonNumber].fly();
                    this.sendSummonings();
                },
                loop: false
            })
        } else {
            this.idle();
        }
    }
    /**
     * IDLE FUNCTIONS
     */

    idle() {
        this.currentState = this.states[0];

        this.play("ghost_idle", true);
    }

    damageEvent(damage) {
        if ((this.currentState === this.states[0] || this.currentState === this.states[3] || this.currentState === this.states[4] || this.currentState === this.states[5]) && this.attributes.health > 0) {
            this.attributes.health -= damage;

            if (this.attributes.health <= 0) {
                this.play("ghost_death", true);
                this.currentState = this.states[7];
            } else {
                this.play("ghost_hit");

                if (this.vulnerableTimer === null)
                    this.vulnerableTimer = this.scene.time.addEvent({
                        delay: 3000,
                        callback: () => {
                            this.longTeleport();
                        },
                        loop: false
                    })

            }
        }
    }

    nextStateFromIdle() {
        switch (Phaser.Math.Between(0, 3)) {
            case 0:
            case 1:
                this.littleTeleport();
                break;
            case 2:
                this.attack();
                break;
            case 3:
                this.summon();
                break;
        }
    }
    alignYwithPlayer() {
        if (this.currentState === this.states[0]
            || this.currentState === this.states[1]
            || this.currentState === this.states[2]) {

            const targetX = this.getCenter().x;
            const targetY = this.scene.player.getCenter().y;
            const fromX = this.getCenter().x;
            const fromY = this.getCenter().y;

            this.velocityToTarget({ x: fromX, y: fromY }, { x: targetX, y: targetY }, 2);

            const distance = Phaser.Math.Distance.BetweenPoints({ x: fromX, y: fromY }, { x: targetX, y: targetY });
            this.lookToPlayer();

            if (distance > 5)
                this.setVelocity(0, this.velY);
            else
                this.setVelocity(0, 0);

        } else {
            this.setVelocity(0, 0);
        }
    }

    startDeath() {
        if (this.fadeChange !== null) this.fadeChange.stop();
        if (this.sendTimer !== null) this.sendTimer.remove(false);

        this.summoningsArray.forEach((element) => {
            element.attack = false;
            element.play("summon_death");
        });

        this.room.bossDead();
        this.destroy();
    }

    lookToPlayer() {
        if (this.getCenter().x > this.scene.player.getCenter().x) {
            this.lookingRight = false;
            this.setScale(-1, 1);

        } else {
            this.lookingRight = true;
            this.setScale(1, 1);
        }

        this.setFixedRotation();
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        if (this.currentState !== this.states[7])
            this.alignYwithPlayer();
    }

    prepareHitBox(x, y) {
        const bodies = Phaser.Physics.Matter.Matter.Bodies;
        const hitbox = bodies.rectangle(-7, 0, 35, 50, { label: "hitable", isSensor: true });
        const damageArea = bodies.rectangle(7, 0, 75, 70, { label: "damageArea", isSensor: true, density: 0 });

        var compoundBody = Phaser.Physics.Matter.Matter.Body.create({
            parts: [hitbox, damageArea],
            frictionStatic: 0,
            frictionAir: 0,
            friction: 0,
            render: { sprite: { xOffset: 0.5, yOffset: 0.5 } }
        });

        this.setExistingBody(compoundBody).setPosition(x, y).setAlpha(0);
        this.setMass(30);
        this.setFixedRotation();
    }

    prepareAnimations() {
        //Maquina de estados de las animaciones del fantasma
        this.on("animationcomplete", (event) => {
            switch (event.key) {
                case "ghost_attack1":
                    this.attack1Ends();
                    break;
                case "ghost_attack2":
                    this.attack2Ends();
                    break;
                case "ghost_attackends":
                    this.idle();
                    break;
                case "ghost_death":
                    this.startDeath();
                    break;
                case "ghost_hit":
                    this.longTeleport();
                    break;
                case "ghost_idle":
                    this.nextStateFromIdle()
                    break;
                case "ghost_skill_start":
                    this.tpExecution();
                case "ghost_skill_executing":

                    break;
                case "ghost_summon":
                    this.summonLoop();
                    break;
            }
        })

        this.scene.anims.create({
            key: "ghost_attack1",
            frameRate: 7,
            frames: this.anims.generateFrameNames("ghost", {
                prefix: "attack_",
                suffix: ".png",
                start: 0,
                end: 2,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "ghost_attack2",
            frameRate: 7,
            frames: this.anims.generateFrameNames("ghost", {
                prefix: "attack_",
                suffix: ".png",
                start: 3,
                end: 9,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "ghost_attackends",
            frameRate: 5,
            frames: this.anims.generateFrameNames("ghost", {
                prefix: "attack_",
                suffix: ".png",
                start: 10,
                end: 12,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "ghost_death",
            frameRate: 7,
            frames: this.anims.generateFrameNames("ghost", {
                prefix: "death_",
                suffix: ".png",
                start: 0,
                end: 17,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "ghost_hit",
            frameRate: 4,
            frames: this.anims.generateFrameNames("ghost", {
                prefix: "hit_",
                suffix: ".png",
                start: 0,
                end: 2,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "ghost_idle",
            frameRate: 7,
            frames: this.anims.generateFrameNames("ghost", {
                prefix: "idle_",
                suffix: ".png",
                start: 0,
                end: 7,
            }),
            repeat: 2
        });
        this.scene.anims.create({
            key: "ghost_skill_start",
            frameRate: 9,
            frames: this.anims.generateFrameNames("ghost", {
                prefix: "skill_",
                suffix: ".png",
                start: 0,
                end: 4,
            }),
            repeat: 0
        });
        this.scene.anims.create({
            key: "ghost_skill_executing",
            frameRate: 9,
            frames: this.anims.generateFrameNames("ghost", {
                prefix: "skill_",
                suffix: ".png",
                start: 5,
                end: 9,
            }),
            repeat: 0
        });

        this.scene.anims.create({
            key: "ghost_summon",
            frameRate: 7,
            frames: this.anims.generateFrameNames("ghost", {
                prefix: "summon_",
                suffix: ".png",
                start: 0,
                end: 4,
            }),
            repeat: 0
        });
    }
}