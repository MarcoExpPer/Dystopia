import Phaser from 'phaser'
import Coin from '../entities/floorActivables/coin';
import HearthResource from '../entities/floorActivables/hearthResource';
import Souls from '../entities/floorActivables/souls';

/**
 * Clase que maneja los eventos de la escena
 */
export default class EventManager {

  /**
   * @param {Phaser.Scene} scene Escena de la que gestionara los eventos
   */
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;

    this.allEventsArray = new Array();
    // NPC events
    const blacksmithEvent = 'changedata-blacksmithLvl';
    const druidEvent = 'changedata-druidLvl';
    const maskedEvent = 'changedata-maskedLvl'

    this.scene.registry.events.on(blacksmithEvent, () => {
      this.scene.blacksmith.setLevel(this.scene.registry.get('blacksmithLvl'));
      this.gameState.saveGame(this.scene.registry.values);
    }, this);
    this.scene.registry.events.on(druidEvent, () => {
      this.scene.druid.setLevel(this.scene.registry.get('druidLvl'));
      this.gameState.saveGame(this.scene.registry.values);
    }, this);
    this.scene.registry.events.on(maskedEvent, () => {
      this.scene.masked.setLevel(this.scene.registry.get('maskedLvl'));
      this.gameState.saveGame(this.scene.registry.values);
    }, this);

    this.allEventsArray.push(blacksmithEvent);
    this.allEventsArray.push(druidEvent);
    this.allEventsArray.push(maskedEvent);

    // Resource events
    const soulsEvent = 'changedata-souls';
    const coinEvent = 'changedata-coins';
    const keyEvent = 'changedata-keys';

    this.scene.registry.events.on(soulsEvent, () => {
      if (this.scene.hasOwnProperty("soulsManager")) this.scene.soulsManager.amountChange(this.scene.registry.values.souls);
      this.gameState.saveGame(this.scene.registry.values);
    }, this);
    this.scene.registry.events.on(coinEvent, () => {
      if (this.scene.hasOwnProperty("coinsManager")) this.scene.coinsManager.amountChange(this.scene.registry.values.coins);
    }, this);
    this.scene.registry.events.on(keyEvent, () => {
      if (this.scene.hasOwnProperty("keysManager")) this.scene.keysManager.amountChange(this.scene.registry.values.keys);
    }, this);

    this.allEventsArray.push(soulsEvent);
    this.allEventsArray.push(coinEvent);
    this.allEventsArray.push(keyEvent);

    // Option events
    const soundEvent = 'changedata-sound';
    const textSpeedEvent = 'changedata-textSpeed';
    const chestAnimationsEvent = 'changedata-chestAnimations';

    this.scene.registry.events.on(soundEvent, () => this.gameState.saveGame(this.scene.registry.values), this);
    this.scene.registry.events.on(textSpeedEvent, () => this.gameState.saveGame(this.scene.registry.values), this);
    this.scene.registry.events.on(chestAnimationsEvent, () => this.gameState.saveGame(this.scene.registry.values), this);

    this.allEventsArray.push(soundEvent);
    this.allEventsArray.push(textSpeedEvent);
    this.allEventsArray.push(chestAnimationsEvent);

    // Enemy events
    this.scene.events.on("enemydead", (loot, x, y) => {
      this.dropLoot(loot, x, y);
    });

    // Generic events
    const playerTypeEvent = 'changedata-playerType';
    this.scene.registry.events.on(playerTypeEvent, () => this.gameState.saveGame(this.scene.registry.values), this);
    this.allEventsArray.push(playerTypeEvent);

    // Shutdown
    const shutdownEvent = "shutdown";
    this.scene.events.on(shutdownEvent, () => this.disable());
    this.allEventsArray.push(shutdownEvent);
  }

  disable() {
    for (let eventName of this.allEventsArray) {
      this.scene.registry.events.off(eventName);
      this.scene.events.off(eventName);
    }
  }

  dropLoot(loot, x, y) {
    const random = Phaser.Math.Between(0, 100);
    let i = 0;

    while(i < loot.length){
      const item = loot[i];
      if (random < item.chance) {
        this.spawn(item.item, x, y);
        i = loot.length;
      }
      i++;
    }
  }

  spawn(item, x, y) {
    switch (item) {
      case "coin1":
        this.scene.add.existing(new Coin(this.scene, x, y, 0));
        break;
      case "coin2":
        this.scene.add.existing(new Coin(this.scene, x, y, 1));
        break;
      case "hearth":
        this.scene.add.existing(new HearthResource(this.scene, x, y));
        break;
      case "soul":
        this.scene.add.existing(new Souls(this.scene, x, y));
        break;
    }
  }

  addEvent(key, callback){
    this.scene.events.on(key, callback);
    this.allEventsArray.push(key);
  }
}
