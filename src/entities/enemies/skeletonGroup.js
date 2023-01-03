import Skeleton from "./skeleton";

//Manage a group of skeleton that revive unless all of them are killed

export default class SkeletonGroup{

    constructor(scene, coordinates, room){
        this.scene = scene;

        this.alive = 0;
        this.timer = 10;
        this.members = new Array();
        this.room = room;

        this.createSkeletons(coordinates);


    }

    createSkeletons(coordinates){
        coordinates.forEach(element => {
            let skeleton = new Skeleton(this.scene, element.x, element.y, this, this.room);
            this.members.push(skeleton);
            this.alive++;
        });
    }

    deadEvent(){
        this.alive--;
        if(this.alive === 0){
            this.members.forEach(element => {
                this.room.enemyDead();
                element.startDeath();
            })
        }
    }

    reviveEvent(){
        this.alive++;
    }
}