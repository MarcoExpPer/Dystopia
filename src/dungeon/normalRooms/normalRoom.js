import plusRoom from "./bossRoom";
import ColumnRoom from "./columnRoom";
import EmptyRoom from "./emptyRoom";

/**
 * Class that represents a dungeon room
 */
export default class normalRoom {
  
  /**
   * Room constructor
   * @param {Floor} floor The floor this room is contained in
   * @param {number} number The number of room inside the floor
   * @param {string} type The type of room
   */
  constructor(floor, number, type, hasKey) {
      this.floor = floor;
      this.number = number;
      this.type = type;
      this.hasKey = hasKey;

      if(hasKey) console.log("Algun lugar de la mazmorra oculta la llave");
  }

  getRoom() {
    let room;
    switch(Phaser.Math.Between(0,2)){
        case 0:
            room = new EmptyRoom(this.floor, this.number, this.type, this.hasKey);
            break;
        case 1:
            room = new ColumnRoom(this.floor, this.number, this.type, this.hasKey);
            break;
        case 2:
            room = new plusRoom(this.floor, this.number, this.type, this.hasKey);
            break;
    }

    return room;
  }
}
