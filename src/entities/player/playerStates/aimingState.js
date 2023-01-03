
export default class AimingState {
    constructor(player, controller) {
        this.player = player;
        this.controller = controller;
        this.finishing = false;

        this.texture = {
            sword: 4,
            bow: 8,
            staff: 12,
            none: 15
        }

    }

    start(name, aimEndCallback) {
        this.name = name;
        this.endCallback = aimEndCallback;
        this.finishing = false;

        this.player.setVelocity(0, 0);
    }
    execute() {
        if (this.finishing === false) {
            this.player.setVelocity(0, 0);
            if (this.player.cursors.up.isDown && this.player.cursors.right.isDown) {  //North East movement
                this.player.facing = 3;

            } else if (this.player.cursors.up.isDown && this.player.cursors.left.isDown) {  //North West movement
                this.player.facing = 5;

            } else if (this.player.cursors.up.isDown) { //North movement         
                this.player.facing = 4;

            } else if (this.player.cursors.down.isDown && this.player.cursors.right.isDown) {  //South East movement
                this.player.facing = 1;

            } else if (this.player.cursors.down.isDown && this.player.cursors.left.isDown) {  //South West movement
                this.player.facing = 7;

            } else if (this.player.cursors.down.isDown) { //South
                this.player.facing = 0;

            } else if (this.player.cursors.right.isDown) {  //East
                this.player.facing = 2;

            } else if (this.player.cursors.left.isDown) {  //West
                this.player.facing = 6;
            }

            this.player.setTexture("player_"+this.player.heroDesign, "Player_"+this.player.heroDesign+"-"+(this.texture[this.name] + 24 * this.player.facing) + ".png");

            if (Phaser.Input.Keyboard.JustUp(this.player.cursors.useItem)) {
                this.finishing = true;
                this.endCallback();
            } 
        }
    }

    endState(){
        this.finishing = true;

    }

    getTransitionStates(){
        let transitionsAvailables = new Array();
        transitionsAvailables.push("move");
        transitionsAvailables.push("damaged");

        return transitionsAvailables;
    }

    getName(){
        return "aim";
    }
}