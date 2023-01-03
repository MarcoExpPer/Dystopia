import Phaser from 'phaser'
const easystarjs = require('easystarjs');

import Player from '../entities/player/player.js';

import SoulsManager from '../UIManagers/SoulsManager.js';
import CoinsManager from '../UIManagers/CoinsManager.js';

import Floor from '../dungeon/floor.js';
import BaseScene from './baseScene.js';

import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles';
import KeysManager from '../UIManagers/keysManager.js';

/**
 * Escena de la mazmorra para realizar pruebas
 * @extends Phaser.Scene
 */
export default class Dungeon extends BaseScene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'dungeon' });
  }

  /**
   * Inicializa los datos de la escena
   */
  init(data) {
    this.playerAttributes = data.playerAttributes;
    this.playerAttributes.potions.number = this.playerAttributes.potions.max;
    this.registry.values.insideDungeon = true;

    this.registry.values.coins = 0;
    this.registry.values.keys = 0;
  }

  /**
   * Carga de los assets del juego
   */
  preload() {
    this.load.scenePlugin('AnimatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
  }

  /**
   * Creación de los elementos
   */
  create() {
    super.create();

    this.updateablesArray = new Array();

    this.sound.stopAll();
    this.music = this.sound.add("dungeonMusic");
    this.music.volume = this.registry.values.sound / 10;
    this.music.play();

    this.registry.events.on('changedata-sound', () => this.changeVolume(this.registry.values.sound / 10), this);
    this.player = new Player(this, 0, 0, this.playerAttributes, false);

    this.floor = new Floor(this);
    this.floor.placeRooms();

    let startingRoom = this.floor.getStartingRoom();
    let startingPos = startingRoom.getStartingPosition();

    startingRoom.activate();

    this.player.setPosition(startingPos.x, startingPos.y)


    // Init UI
    this.soulsManager = new SoulsManager(this, 100, 490, this.registry.values.souls, true);
    this.coinsManager = new CoinsManager(this, 40, 490, this.registry.values.coins, false);
    this.keysManager = new KeysManager(this, 750, 490);
  }

  changeVolume(newVolume) {
    this.music.volume = newVolume;
  }

  playerDamageEvent(Amount, type) {
    this.healthBarManager.playerDamageEvent
  }

  openDialogue(id, color, onEnd) {
    let data = {
      id: id,
      mainScene: this,
      color: color,
      onEnd: onEnd
    };
    this.scene.launch('dialogue', data);
    this.scene.pause();
  }

  activatepahtfinding(map, tiles) {
    this.pathFinder = new easystarjs.js(true);
    this.pathFinder.enableDiagonals();

    const grid = new Array();
    for (let y = 0; y < map.height; y++) {
      let col = new Array;
      for (let x = 0; x < map.width; x++) {
        col.push(map.getTileAt(x, y, true, 0).index);
      }
      grid.push(col);
    }
    this.pathFinder.setGrid(grid);

    //WALKABLE TILES
    const tileset = map.tilesets[0];
    const properties = tileset.tileProperties;
    const acceptableTiles = [];

    for (let i = tileset.firstgid - 1; i < tiles.total; i++) { // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
      if (!properties.hasOwnProperty(i)) {
        acceptableTiles.push(i + 1);
        continue;
      }
      if (!properties[i].collide) acceptableTiles.push(i + 1);
      if (properties[i].cost) this.pathFinder.setTileCost(i + 1, properties[i].cost); // If there is a cost attached to the tile, let's register it
    }
    this.pathFinder.setAcceptableTiles(acceptableTiles);
  }

  addUpdateable(gameObject) {
    this.updateablesArray.push(gameObject);
  }

  removeUpdateable(gameObject) {
    const index = this.updateablesArray.indexOf(gameObject);
    this.updateablesArray.splice(index, 1);
  }
  update(t, dt) {
    super.update(t, dt);

    this.updateablesArray.forEach((element) => {
      element.update(t, dt);
    });
  }
}
