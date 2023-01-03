import shopFloorLooteable from "../../entities/floorActivables/shopFloorLooteable";
import FireEssence from "../../Items/PassiveItems/fireEssence";
import GodHearth from "../../Items/PassiveItems/godHearth";
import HolySword from "../../Items/PassiveItems/holySword";
import ShopA from "./shopA";

/**
 * Class that represents a dungeon room
 */
export default class shopRoom {

    /**
     * Room constructor
     * @param {Floor} floor The floor this room is contained in
     * @param {number} number The number of room inside the floor
     * @param {string} type The type of room
     */
     constructor(floor, number, type) {
        this.floor = floor;
        this.number = number;
        this.type = type;
    }

    getRoom() {
        let room;
        switch (Phaser.Math.Between(0, 0)) {
            case 0:
                room = new ShopA(this.floor, this.number, this.type);
                break;

        }

        return room;
    }



}
