import SwordSwing from "../swordSwing";

export default class SwordAttackState {
    constructor(player, controller) {
        this.player = player;
        this.controller = controller;
        this.attacking = false;
    }

    execute(dt) {
        this.player.setVelocity(0, 0);

        if (this.attacking === false) {
            this.attacking = true;

            this.player.play("player_sword" + this.player.facing, true);
            this.player.scene.time.addEvent({
                delay: 500,
                callback: this.endExecution,
                callbackScope: this,
                loop: false
            });
        }

        if (this.player.anims.currentFrame.index === 3) {
            this.player.swordAttacking = true;
            if (this.player.swing === null) {
                this.player.attackManager.attack();
            }
        }
    }

    start() {
        this.attacking = false;
        this.player.canAttack = false;
        this.player.canUseActive = false;
        this.player.swing = null;

        this.player.setVelocity(0, 0);
    }

    endState() {
        this.player.canAttack = true;
        this.player.canUseActive = true;
        this.player.swordAttacking = false;
        this.player.thingsHit = new Array();

        this.player.swing = null;
    }
    endExecution() {
        this.controller.advanceStateTo("move");
        this.endState();
    }

    getTransitionStates() {
        let transitionsAvailables = new Array();
        transitionsAvailables.push("move");
        transitionsAvailables.push("damaged");

        return transitionsAvailables;
    }

    getName() {
        return "sword";
    }


}