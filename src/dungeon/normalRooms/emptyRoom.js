import Archer from "../../entities/enemies/archer";
import Bat from "../../entities/enemies/bat";
import SkeletonGroup from "../../entities/enemies/skeletonGroup";
import Slime from "../../entities/enemies/slime";
import Key from "../../entities/floorActivables/key";

import Floor from "../floor";
import Room from "../room";

/**
 * Class that represents a dungeon room
*/
export default class EmptyRoom extends Room {

    /**
     * Room constructor
     * @param {Floor} floor The floor this room is contained in
     * @param {number} number The number of room inside the floor
     * @param {string} type The type of room
     */
    constructor(floor, number, type, hasKey) {
        super(floor, number, type, hasKey);

    }

    create() {
        super.create("roomEmpty")
    }

    placeEnemies() {
        let i = 1;
        switch (Phaser.Math.Between(0, 4)) {
            case 0: //BATS
                for (const obj of this.map.getObjectLayer('SpawnAtCorners').objects) {
                    this.numberOfEnemies++;
                    new Bat(this.scene, this.x + obj.x + 16, this.y + obj.y - 16, this);
                }
                break;
            case 1: //SLIMES
                for (const obj of this.map.getObjectLayer('SpawnAtInternalCorners').objects) {
                    this.numberOfEnemies += 3; //1 + 2
                    new Slime(this.scene, this.x + obj.x + 16, this.y + obj.y, "blue", 2, this);
                }
                break;
            case 2: //SKELETONs
                let skeletonCoordinates = new Array();

                for (const obj of this.map.getObjectLayer('SpawnPairAtCenter').objects) {
                    this.numberOfEnemies++;
                    skeletonCoordinates.push({ x: this.x + obj.x, y: this.y + obj.y });
                }
                new SkeletonGroup(this.scene, skeletonCoordinates, this);
                break;
            case 3: //Archers
                for (const obj of this.map.getObjectLayer('SpawnAtCorners').objects) {
                    if (i % 2) {
                        this.numberOfEnemies++;
                        new Archer(this.scene, this.x + obj.x + 16, this.y + obj.y, this);
                    }
                    i++;
                }
                break;
            case 4: //Archers and Slimes
                for (const obj of this.map.getObjectLayer('SpawnAtCorners').objects) {
                    if (i % 3 === 0) {
                        this.numberOfEnemies++;
                        new Archer(this.scene, this.x + obj.x + 16, this.y + obj.y, this);
                    }
                    i++;
                }
                for (const obj of this.map.getObjectLayer('SpawnPairAtCenter').objects) {
                    this.numberOfEnemies += 7; //1 + 2 + 4
                    new Slime(this.scene, this.x + obj.x + 16, this.y + obj.y, "blue", 3, this);
                }
                break;
        }
    }
}