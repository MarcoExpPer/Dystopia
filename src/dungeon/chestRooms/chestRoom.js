import ChestA from "./chestA";

/**
 * Class that represents a dungeon room
 */
export default class chestRoom {

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
      switch(Phaser.Math.Between(0,0)){
          case 0:
              room = new ChestA(this.floor, this.number, this.type);
              break;
      }
  
      return room;
    }


}
