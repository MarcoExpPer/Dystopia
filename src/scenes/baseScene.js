import Phaser from 'phaser'
import GameState from '../gameState';
import CollisionManager from '../managers/CollisionManager';
import EventManager from '../managers/EventManager';

/**
 * Clase que representa la base para las escenas del juego
 */
export default class BaseScene extends Phaser.Scene {

  /**
   * @param config Scene specific configuration settings.
   */
  constructor(config, hasinput = false) {
    super(config);
    this.hasinput = hasinput
  }


  create() {
    this.gameState = new GameState();

    //Generic Managers for real play scenes
    if (this.hasinput === false ) {
      this.managers = {};

      this.managers.collisionManager = new CollisionManager(this);
      this.managers.eventManager = new EventManager(this, this.gameState);

    }

    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      accept: Phaser.Input.Keyboard.KeyCodes.SPACE,
      interact: Phaser.Input.Keyboard.KeyCodes.E,
      useItem: Phaser.Input.Keyboard.KeyCodes.K,
      attack: Phaser.Input.Keyboard.KeyCodes.J,
      fullscreen: Phaser.Input.Keyboard.KeyCodes.F11,
      pause: Phaser.Input.Keyboard.KeyCodes.P,
      escape: Phaser.Input.Keyboard.KeyCodes.ESC
    });

    //PAUSE
    this.cursors.pause.on('down', () => this.togglePause(), this);
    this.cursors.escape.on('down', () => this.togglePause(), this);

    //FULLSCREEN
    this.cursors.fullscreen.on('down', () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    }, this);

    //INTERACT
    //Array of items that will be interactuable by the player with the E keybind
    this.interactuables = new Array();
    this.cursors.interact.on('down', () => this.playerInteract(), this);

  }
  // Executed when this scene is told to shutdown
  shutdown() {
    this.managers.eventManager.disable(this);
    this.sound.stopAll();
    console.log("1");
  }

  // Handle player death
  playerDeath() {
    this.updateablesArray = new Array();  //So the dungeon stop updating thingies when we are restarting the scene
    
    this.player.listPassiveItems.forEach((element) =>{
      element = null;
    });
    
    this.registry.values.coins = 0;
    this.scene.start('village');
  }

  // Pause current scene and open pause menu
  togglePause() {
    this.scene.launch('pauseMenu', this);
    this.scene.pause();
    this.sound.pauseAll();
  }



  /**
   * INTERACT
   */

  // Interact with something nearby 
  playerInteract() {
    const maxInteractDistance = 65;

    const interactuable = this.getnearestInteractuable(this.interactuables, this.player, maxInteractDistance);
    if (interactuable) {
      interactuable.interact();
    }
  }

  // Get the nearest interactuables inside a maxDistance
  getnearestInteractuable(interactuables, player, maxInteractDistance) {
    let result;
    let distance = Number.MAX_VALUE;

    for (let element of interactuables) {
      let ed = Phaser.Math.Distance.BetweenPoints(player, element);

      if (ed <= maxInteractDistance && ed < distance) {
        distance = ed;
        result = element;
      }
    }
    return result;
  }
  //Interact with a chest
  openChest(chest) {
    if (this.registry.values.chestAnimations === true) {
      this.currentChest = chest;
      chest.startAnimation();
    } else {
      chest.openWithoutAnimation();
    }
  }

  // Pause currentScene and open the dialogue menu
  openDialogue(id, color, onEnd, extraParameters = null) {
    let data = {
      id: id,
      mainScene: this,
      color: color,
      onEnd: onEnd,
      parameters: extraParameters
    };
    this.scene.launch('dialogue', data);
    this.scene.pause();
  }
}
