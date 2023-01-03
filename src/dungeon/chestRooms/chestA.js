import Boomerang from "../../Items/ActiveItems/boomerang";
import Bow from "../../Items/ActiveItems/bow";
import Chest from "../../Items/chests/chest";

import Floor from "../floor";
import Room from "../room";

/**
 * Class that represents a dungeon room
*/
export default class ChestA extends Room {

    /**
     * Room constructor
     * @param {Floor} floor The floor this room is contained in
     * @param {number} number The number of room inside the floor
     * @param {string} type The type of room
     */
    constructor(floor, number, type) {
        super(floor, number, type);

    }

    create() {
        super.create("roomChest")
    }

    placeChest(){
        const coordinates = this.map.getObjectLayer('chest').objects[0];
        
        let reward;
        switch(Phaser.Math.Between(0, 1)){
            case 0:
                reward = new Bow(this.scene);
                break;
            case 1:
                reward = new Boomerang(this.scene);
                break;
        }

        const chest = new Chest(this.scene, coordinates.x + 32 + this.x, coordinates.y + this.y, 7, reward, this);
        this.scene.interactuables.push(chest);
    }
}