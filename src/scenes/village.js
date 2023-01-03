import Phaser from 'phaser'

import Player from './../entities/player/player.js';
import SoulsManager from '../UIManagers/SoulsManager.js';
import DungeonTP from './../entities/dungeonTP.js';

import BaseScene from './baseScene.js';

import GodnessStatue from '../entities/npcs/godnessStatue.js';
import Blacksmith from '../entities/npcs/blacksmith.js';
import Druid from '../entities/npcs/druid.js';
import Masked from '../entities/npcs/masked.js';
import MaskedLevelingData from '../entities/npcs/maskedLevelingData.js';
import ControlTips from '../UI/controlsTip.js';


/**
 * Escena de la aldea.
 * @extends Phaser.Scene
 */
export default class Village extends BaseScene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'village' });
  }
  /**
   * Inicializa los datos de la escena
   */
  init(data) {

    this.registry.set('currencyTemp', 0);
    this.registry.set('insideDungeon', false);
  }

  /**
   * Creación de los elementos
   */
  create() {
    super.create();
    this.matter.world.setBounds();
    this.map = this.make.tilemap({
      key: 'vg_tilemap',
      tileWidth: 32,
      tileHeight: 32
    })

    this.sound.stopAll();
    this.music = this.sound.add("villageMusic");
    this.music.volume = this.registry.values.sound/10;
    this.music.play();

    this.registry.events.on('changedata-sound', () => this.changeVolume(this.registry.values.sound/10), this);

    const tileset = [];
    tileset[0] = this.map.addTilesetImage('grass_village', 'vg_tileset_grass');
    tileset[1] = this.map.addTilesetImage('ground_village', 'vg_tileset_ground');
    tileset[2] = this.map.addTilesetImage('plant_village', 'vg_tileset_plant');
    tileset[3] = this.map.addTilesetImage('props_village', 'vg_tileset_props');
    tileset[4] = this.map.addTilesetImage('struct_village', 'vg_tileset_struct');
    tileset[5] = this.map.addTilesetImage('wall_village', 'vg_tileset_wall');

    this.groundLayer = this.map.createLayer('ground', tileset);
    this.structuresLayer = this.map.createLayer('structures', tileset);
    this.decorationsLayer = this.map.createLayer('decorations', tileset);

    this.decorationsLayer.setDepth(2);

    this.structuresLayer.setCollisionFromCollisionGroup(true);
    this.decorationsLayer.setCollisionFromCollisionGroup(true);

    this.matter.world.convertTilemapLayer(this.structuresLayer);
    this.matter.world.convertTilemapLayer(this.decorationsLayer);

    // Gestionar el intento de interacción
    this.isPaused = false;

    // Gestión del jugador
    const playerAttributes = new MaskedLevelingData().getPlayerStats(this.registry.values.playerType)
    this.player = new Player(this, 192, 128, playerAttributes);

    //Gestion UI
    this.soulsManager = new SoulsManager(this, 40, 490, this.registry.values.souls);

    // Gestión de los NPCs
    this.blacksmith = new Blacksmith(this, 40, 250, this.registry.values.blacksmithLvl);
    this.druid = new Druid(this, 375, 50, this.registry.values.druidLvl);
    this.masked = new Masked(this, 720, 475, this.registry.values.maskedLvl)
    this.statue = new GodnessStatue(this, 111, 79, 1);

    this.NPCs = new Array();
    this.NPCs.push(this.blacksmith);
    this.NPCs.push(this.masked);
    this.NPCs.push(this.druid);

    this.interactuables.push(this.blacksmith);
    this.interactuables.push(this.druid);
    this.interactuables.push(this.masked);
    this.interactuables.push(this.statue);


    this.tp = new DungeonTP(this, 655, 85);
    this.interactuables.push(this.tp);

    this.dialogueQueue = new Array();

    this.add.existing(new ControlTips(this, 250, 450));
  }

  changeVolume(newVolume){
    this.music.volume = newVolume;
  }

  goToDungeon(typeOfEnemy = null) {
    let data = {
      playerAttributes: this.player.attributes
    };

    if (typeOfEnemy !== null)
      data.enemiesTypes = typeOfEnemy

    this.sound.stopAll();
    this.scene.start("dungeon", data);
  }

  changePlayerType(newtype, newattributes) {
    this.registry.values.playerType = newtype;

    this.player.changeHeroDesign(newtype, newattributes);

    this.NPCs.forEach(npc => {
      npc.setLevel(npc.level);
    });
  }

  queueDialogue(key, callback){
    this.dialogueQueue.push({key: key, callback: callback});
  }


  update(t, dt){
    super.update(t, dt);

    if(this.dialogueQueue.length >= 1){
      let data = this.dialogueQueue.shift();
      this.openDialogue(data.key, "green", data.callback);
    }
      

  }
}
