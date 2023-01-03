import Key from "../entities/floorActivables/key";
import FireEssence from "../Items/PassiveItems/fireEssence";
import GodHearth from "../Items/PassiveItems/godHearth";
import HolySword from "../Items/PassiveItems/holySword";
import ControlTips from "../UI/controlsTip";
import Door from "./door";
import { Directions, DoorTypes, RoomTypes } from "./enums";

import Floor from "./floor";

/**
 * Class that represents a dungeon room
*/
export default class Room {

  /**
   * Room constructor
   * @param {Floor} floor The floor this room is contained in
   * @param {number} number The number of room inside the floor
   * @param {string} type The type of room
   */
  constructor(floor, number, type, hasKey) {
    this.scene = floor.scene;
    this.floor = floor;
    this.number = number;
    this.column = number % 10;
    this.row = ~~(number / 10);
    this.x = this.column * 768;
    this.y = this.row * 512;
    this.type = type;

    this.doors = new Array();
    this.tilesetImages = new Array();

    this.enemies = new Array();
    this.numberOfEnemies = 0;
    this.cleared = false;

    this.hasKey = hasKey;

    this.create();
  }

  create(key) {
    this.map = this.scene.make.tilemap({
      key: key,
    })

    this.tilesetImages.push(this.map.addTilesetImage('base_dungeon', 'baseDungeon_tileset'));
    this.tilesetImages.push(this.map.addTilesetImage('animated_torchs', 'animatedTorchs_tileset'));

    this.groundLayer = this.map.createLayer("background", this.tilesetImages, this.x, this.y);
    this.decorationLayer = this.map.createLayer("decorations", this.tilesetImages, this.x, this.y);

    this.groundLayer.setCollisionFromCollisionGroup(true);
    this.scene.matter.world.convertTilemapLayer(this.groundLayer);

    this.scene.animatedTiles.init(this.map);


    if(this.type === RoomTypes.START){
      const coords = this.getCenter();
      const text = new Phaser.GameObjects.Text(this.scene, coords.x, coords.y, "Encuentra la llave para abrir la puerta al jefe")
      text.setOrigin(0.5).setAlpha(0.5);
      text.setAlign("center");
      text.setWordWrapWidth(300);

      this.scene.add.existing(text );
      this.scene.add.existing(new ControlTips(this.scene, 250 + this.x, 350 + this.y).setAlpha(0.5));
    }
  }

  createDoors() {
    let roomData = this.getDoorData(-10);
    this.doors[2] = new Door(this, Directions.NORTH, roomData.target, roomData.doortype);

    roomData = this.getDoorData(+10);
    this.doors[0] = new Door(this, Directions.SOUTH, roomData.target, roomData.doortype);

    roomData = this.getDoorData(+1);
    this.doors[1] = new Door(this, Directions.EAST, roomData.target, roomData.doortype);

    roomData = this.getDoorData(-1);
    this.doors[3] = new Door(this, Directions.WEST, roomData.target, roomData.doortype);

  }

  getDoorData(offset) {
    const data = {};

    data.target = this.floor.getRooms().get(this.number + offset)

    if (data.target === undefined) {
      data.doortype = DoorTypes.NONE
    } else if (data.target.type === RoomTypes.BOSS) {
      data.doortype = DoorTypes.BOSS;
    } else
      data.doortype = DoorTypes.NORMAL;
      
    return data;
  }

  openDoors() {
    for (const door of this.doors) {
      door.open();
    }
  }

  activateDoors() {
    for (const door of this.doors) {
      door.activate();
    }
  }

  desactivateDoors() {
    for (const door of this.doors) {
      door.activate();
    }
  }

  desactivate() {
    this.desactivateDoors();
  }

  getCenter() {
    return this.groundLayer.getBottomRight();
  }

  getStartingPosition() {
    return this.getCenter();
  }

  enemyDead() {
    this.numberOfEnemies--;
    if (this.numberOfEnemies === 0) {
      this.openDoors();
      this.cleared = true;

      if (this.hasKey) {
        const coord = this.getStartingPosition();
        new Key(this.scene, coord.x, coord.y);
      }
    }
  }

  getSellablePassiveItems() {
    const output = new Array();

    output.push(new FireEssence(this.scene));
    output.push(new HolySword(this.scene));
    output.push(new GodHearth(this.scene));

    for (const passiveItem of this.scene.player.listPassiveItems) {
      const item = output.find((element) => {
        element.label = passiveItems.label;
      })
      if (item !== -1) {
        output.splice(passiveItem.indexOf(item), 1)
      }

    }
    return output;
  }

  activate() {
    this.scene.activatepahtfinding(this.map, this.tilesetImages[0]);

    this.scene.cameras.main.centerOn(this.getCenter().x, this.getCenter().y);

    switch (this.type) {
      case RoomTypes.NORMAL:
        if (!this.cleared) {
          this.placeEnemies();
        }
        break;
      case RoomTypes.LOOT:
        if (!this.cleared) {
          this.cleared = true;
          this.placeChest();
        }
        this.openDoors();
        break;

      case RoomTypes.START:
        this.openDoors();
        break;

      case RoomTypes.SHOP:
        if (!this.cleared) {
          this.cleared = true;
          this.placeItems();
        }
        this.openDoors();
        break;
      case RoomTypes.BOSS:
        if (!this.cleared) {
          this.bossAreaActivation();
        }
        break;
        

    }
    //FLAG FOR ITEMS 
    if (!this.cleared) {
      this.scene.events.emit("newroom");
    }

    this.activateDoors();
  }

}