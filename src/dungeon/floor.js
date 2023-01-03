import { RoomTypes } from "./enums";
import FloorPlanner from "./floorPlanner";
import Room from "./room";

import normalRoom from '../dungeon/normalRooms/normalRoom.js';
import chestRoom from '../dungeon/chestRooms/chestRoom.js';
import shopRoom from '../dungeon/shopRooms/shopRoom.js';
import plusRoom from '../dungeon/normalRooms/bossRoom.js';
import EmptyRoom from "./normalRooms/emptyRoom";
import BossRoom from "./bossRooms/bossRoom";
/**
 * Class that represents a dungeon floor
 */
export default class Floor {

  /**
   * Class constructor
   * @param {Phaser.Scene} scene The scene this floor belongs to
   */
  constructor(scene) {
    this.scene = scene;
    this.rooms = new Map();
    this.bossRoomOpen = false;
  }

  /**
   * Prepare a floor plan and place the rooms
   */
  placeRooms() {
    this.floorplan = new FloorPlanner().run();

    //CHECK HOW MANY ROOMS TO GIVE THE KEY TO ANY ROOM
    let roomsleft = 0;
    for (let idx = 0; idx < this.floorplan.rooms.length; idx++) {
      if(this.floorplan.rooms[idx]) roomsleft++;
    }
    roomsleft -= 4; //BOSS, SHOP, LOOT AND START ROOM CANT HAVE KEY
    let keyChance = 1 / roomsleft;

    for (let idx = 0; idx < this.floorplan.rooms.length; idx++) {

      const roll = Phaser.Math.FloatBetween(0, 1);
      let hasKey = false;
      if (roll <= keyChance )
        hasKey = true;

      if (this.floorplan.rooms[idx]) {
        switch (idx) {
          case 55:
            this.rooms.set(idx, this.selectRoom(RoomTypes.START, idx));
            break;
          case this.floorplan.specialRooms.boss:
            this.rooms.set(idx, this.selectRoom(RoomTypes.BOSS, idx));
            break;
          case this.floorplan.specialRooms.reward:
            this.rooms.set(idx, this.selectRoom(RoomTypes.LOOT, idx));
            break;
          case this.floorplan.specialRooms.shop:
            this.rooms.set(idx, this.selectRoom(RoomTypes.SHOP, idx));
            break;
          default:

            if (keyChance !== 0 && !hasKey) {
              roomsleft--;
              keyChance = 1 / roomsleft;
            }else{
              keyChance = 0;
            }

            this.rooms.set(idx, this.selectRoom(RoomTypes.NORMAL, idx, hasKey));
            break;
        }
      }
    }


    for (const room of this.rooms.values()) {
      room.createDoors();
    }

  }

  selectRoom(roomType, idx, hasKey = false) {
    let room;
    switch (roomType) {
      case RoomTypes.NORMAL: //NORMAL BASIC ROOM
        room = (new normalRoom(this, idx, roomType, hasKey)).getRoom();
        break;
      case RoomTypes.START:
        room = (new normalRoom(this, idx, roomType)).getRoom();
        break;
      case RoomTypes.BOSS:
        room = (new BossRoom(this, idx, roomType)).getRoom();
        break;
      case RoomTypes.LOOT:
        room = (new chestRoom(this, idx, roomType)).getRoom();
        break;
      case RoomTypes.SHOP:
        room = (new shopRoom(this, idx, roomType)).getRoom();
        break;

    }

    return room;
  }
  /**
   * Gets the starting room
   * @returns The starting room
   */
  getStartingRoom() {
    return this.rooms.get(55);
  }

  /**
   * Gets a map of the rooms of this floor keyed by their number
   * @returns The map of rooms
   */
  getRooms() {
    return this.rooms;
  }
}
