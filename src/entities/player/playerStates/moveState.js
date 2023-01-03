
export default class MoveState {
    constructor(player) {
        this.player = player;
        this.diagonalCorrection = Math.cos(45);

    }

    start() {
        this.lastFacingUpdate = Date.now();
    }

    execute(dt) {
        dt = dt / 16;
        let updateFacing = ((Date.now() - 35) >= this.lastFacingUpdate);

        const playerMaxSpeed = this.player.attributes.maxSpeed;


        if (this.player.cursors.up.isDown && this.player.cursors.right.isDown) {  //North East movement
            if (this.player.facing !== 3)
                this.player.setVelocity(0, 0);

            this.player.facing = 3; this.player.isIdle = false;
            this.player.applyForce({ x: this.diagonalCorrection * dt * +this.player.attributes.acceleration, y: this.diagonalCorrection * dt * -this.player.attributes.acceleration });
            this.lastFacingUpdate = ((Date.now()));

        } else if (this.player.cursors.up.isDown && this.player.cursors.left.isDown) {  //North West movement
            if (this.player.facing !== 5)
                this.player.setVelocity(0, 0);

            this.player.facing = 5; this.player.isIdle = false;
            this.player.applyForce({ x: this.diagonalCorrection * dt * -this.player.attributes.acceleration, y: this.diagonalCorrection * dt * -this.player.attributes.acceleration });
            this.lastFacingUpdate = ((Date.now()));

        } else if (this.player.cursors.up.isDown && updateFacing) { //North movement
            if (this.player.facing !== 4)
                this.player.setVelocity(0, 0);

            this.player.facing = 4; this.player.isIdle = false;
            this.player.applyForce({ x: 0, y: dt * -this.player.attributes.acceleration });

        } else if (this.player.cursors.down.isDown && this.player.cursors.right.isDown) {  //South East movement
            if (this.player.facing !== 1)
                this.player.setVelocity(0, 0);

            this.player.facing = 1; this.player.isIdle = false;
            this.player.applyForce({ x: this.diagonalCorrection * dt * +this.player.attributes.acceleration, y: this.diagonalCorrection * dt * +this.player.attributes.acceleration });
            this.lastFacingUpdate = ((Date.now()));

        } else if (this.player.cursors.down.isDown && this.player.cursors.left.isDown) {  //South West movement
            if (this.player.facing !== 7)
                this.player.setVelocity(0, 0);

            this.player.facing = 7; this.player.isIdle = false;
            this.player.applyForce({ x: this.diagonalCorrection * dt * -this.player.attributes.acceleration, y: this.diagonalCorrection * dt * +this.player.attributes.acceleration });
            this.lastFacingUpdate = ((Date.now()));

        } else if (this.player.cursors.down.isDown && updateFacing) { //South
            if (this.player.facing !== 0)
                this.player.setVelocity(0, 0);

            this.player.facing = 0; this.player.isIdle = false;
            this.player.applyForce({ x: 0, y: dt * this.player.attributes.acceleration });

        } else if (this.player.cursors.right.isDown && updateFacing) {  //East
            if (this.player.facing !== 2)
                this.player.setVelocity(0, 0);

            this.player.facing = 2; this.player.isIdle = false;
            this.player.applyForce({ x: dt * this.player.attributes.acceleration, y: 0 });


        } else if (this.player.cursors.left.isDown && updateFacing) {  //West
            if (this.player.facing !== 6)
                this.player.setVelocity(0, 0);

            this.player.facing = 6; this.player.isIdle = false;
            this.player.applyForce({ x: dt * -this.player.attributes.acceleration, y: 0 });

        } else if (this.player.cursors.left.isUp && this.player.cursors.right.isUp && this.player.cursors.down.isUp && this.player.cursors.up.isUp) {  //Idle
            this.player.isIdle = true;
            this.player.setVelocity(0, 0);
        }

        if (this.player.isIdle === false)
            this.player.play("player_walk" + this.player.facing, true);
        else {
            this.player.setTexture("player_"+this.player.heroDesign, "Player_"+this.player.heroDesign+"-"+(0 + 24 * this.player.facing) + ".png");
        }

        //Limit max speed in main axis
        if (this.facing % 2 == 0) {
            if (this.player.body.velocity.x > playerMaxSpeed) this.player.setVelocity(playerMaxSpeed, this.player.body.velocity.y);
            else if (this.player.body.velocity.x < -playerMaxSpeed) this.player.setVelocity(-playerMaxSpeed, this.player.body.velocity.y);

            if (this.player.body.velocity.y > playerMaxSpeed) this.player.setVelocity(this.player.body.velocity.x, playerMaxSpeed);
            else if (this.player.body.velocity.y < -playerMaxSpeed) this.player.setVelocity(this.player.body.velocity.x, -playerMaxSpeed);
        //Limit max speed in intercardinal axis
        }else{
            if (this.player.body.velocity.x > this.diagonalCorrection*playerMaxSpeed) this.player.setVelocity(this.diagonalCorrection*playerMaxSpeed, this.player.body.velocity.y);
            else if (this.player.body.velocity.x < -this.diagonalCorrection*playerMaxSpeed) this.player.setVelocity(-this.diagonalCorrection*playerMaxSpeed, this.player.body.velocity.y);

            if (this.player.body.velocity.y > this.diagonalCorrection*playerMaxSpeed) this.player.setVelocity(this.player.body.velocity.x, this.diagonalCorrection*playerMaxSpeed);
            else if (this.player.body.velocity.y < -this.diagonalCorrection*playerMaxSpeed) this.player.setVelocity(this.player.body.velocity.x, -this.diagonalCorrection*playerMaxSpeed);

        }

    }
    endState() { }

    getTransitionStates() {
        let transitionsAvailables = new Array();
        transitionsAvailables.push("sword");
        transitionsAvailables.push("aim");
        transitionsAvailables.push("damaged");

        return transitionsAvailables;
    }

    getName() {
        return "move";
    }
}