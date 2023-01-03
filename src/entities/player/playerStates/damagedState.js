
export default class DamagedState {
    constructor(player, controller) {
        this.player = player;
        this.controller = controller;
        this.doneOnce = false;
    }

    execute(dt) {
        if (this.knockback !== null) {
            if (this.doneOnce === false) {
                this.player.setVelocity(0, 0);
                this.doneOnce = true;
                this.player.applyForce(this.knockback.direction);

                this.player.scene.time.addEvent({
                    delay: this.knockback.duration * 1000,
                    callback: this.endExecution,
                    callbackScope: this,
                    loop: false
                });
            }

        } else {
            this.endExecution();
        }

    }

    start(knockback = null) {
        this.player.setFrictionAir(0.03);


        if(this.player.checkDeath() === true){
            this.player.play("player_dead"+this.player.facing);
        }
        else{
            this.player.play("player_hit"+this.player.facing);
        }
        this.knockback = knockback;
        this.doneOnce = false;
    }

    endState() {
        this.knockback = null;
        this.player.setFrictionAir(0);
    }

    endExecution() {
        this.controller.advanceStateTo("move");
        this.endState();
    }

    getTransitionStates() {
        let transitionsAvailables = new Array();
        transitionsAvailables.push("move");

        return transitionsAvailables;
    }

    getName() {
        return "damaged";
    }
}