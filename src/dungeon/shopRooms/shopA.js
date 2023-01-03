import shopFloorLooteable from "../../entities/floorActivables/shopFloorLooteable";
import Boomerang from "../../Items/ActiveItems/boomerang";
import Bow from "../../Items/ActiveItems/bow";
import Chest from "../../Items/chests/chest";

import Floor from "../floor";
import Room from "../room";

/**
 * Class that represents a dungeon room
*/
export default class ShopA extends Room {

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
        super.create("roomShop")
    }

    placeItems(){   
        let items = this.getSellablePassiveItems();
        
        for (const obj of this.map.getObjectLayer('items').objects) {
            const index = Phaser.Math.Between(0, items.length-1);

            new shopFloorLooteable(this.scene, obj.x+16+this.x, obj.y-32-16+this.y, items[index]);

            items.splice(index, 1);
        }
    }
}