import Phaser, { Animations } from 'phaser'

import Attributable from '../attributable';
import ActiveItemSlotManager from '../../UIManagers/activeItemSlotManager';
import HealthBarManager from '../../UIManagers/healthBarManager.js';
import playerController from './playerStates/playerController';
import SwordAttackManager from './swordAttackManager.js';


/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando los cursores.
 */
export default class Player extends Attributable {

  /**
   * Constructor del jugador
   * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   */
  constructor(scene, x, y, attributes) {
    super(scene, x, y, 'player_0', 0, attributes);
    this.attributes = attributes;

    this.cursors = this.scene.cursors;
    this.swapItemKey = this.scene.input.keyboard.addKey('R');

    this.label = "player";
    this.invulnerabilityTimer;
    this.lastDamage = Date.now();
    this.dead = false;
    this.damageEvent = this.damageEvent;

    //Used to calculate where the player is currently facing
    this.facing = 0;
    this.isIdle = true;

    this.canUseActive = true;
    this.canMove = true;
    this.canAttack = true;
    this.canTurn = true;

    //Active items
    this.currentActiveItem = null;
    this.listActiveItems = new Array();

    //Pasive items
    this.listPassiveItems = new Array();


    //UI managers
    this.itemManager = new ActiveItemSlotManager(scene, 745, 20);

    this.playerActiveTime = 0;

    this.healthBarManager = new HealthBarManager(scene, 20, 15, attributes.maxHealth, attributes.shield, attributes.health);
    
    this.attackManager = new SwordAttackManager(this.scene, this);
    this.swordAttacking = false;

    /* Hay 4 tipos de heroe. Simplemente cambiando la id de HeroDesign y llamando a makeAnimations se actualizan todos los sprites
    El de antes, un caballero, de tres colores. Sus ids son 0 1 y 2
    Uno que parece robinhood o un mosquetero. Sus ids son 3 y 4
    Uno que es como un mago. Sus ids son 5 y 6.
    Uno que es como un guerrero. Sus ids son 7 y 8.
    */
    this.heroDesign = this.scene.registry.values.playerType;

    this.makeAnimations(true);
    this.makeAnimations();
    
    this.hitboxAndSensors(x, y);

    
    this.playerHitSound = this.scene.sound.add("playerHit");
    this.swordSwing = this.scene.sound.add("swordSwing");

    this.controller = new playerController(this);
  }

  changeHeroDesign(newType, attributes) {
    this.attributes = attributes;
    this.scene.registry.values.playerType = newType;
    this.heroDesign = newType;

    this.makeAnimations(true);
    this.makeAnimations();
  }
  //Equip a passive item
  equipPassiveItem(item) {
    this.listPassiveItems.push(item);
    item.equip(this, this.attributes.itemDamageMultiplier)
  }

  //Give a new active item to the player and equip it
  addActiveItem(item) {
    this.listActiveItems.push(item);
    this.equipItem(item.label);
  }

  //Equip the player with the owned active item with whose label equals the label parameter
  equipItem(label) {
    this.currentActiveItem = this.listActiveItems.find(element => element.label == label);
    this.itemManager.changeItem(this.currentActiveItem.texture, this.currentActiveItem.frame, this.currentActiveItem.getAmmo());
  }

  //Equips next item of the active item list
  equipNextItem() {
    let item = this.listActiveItems.indexOf(this.currentActiveItem);
    let next = this.listActiveItems.find((item + 1) % this.listActiveItems.length());
    this.equipItem(next.label);
  }

  //Receive damage and check if the player is dead. Has an internal timer to not spam the damageEvent
  damageEvent(amount, type, knockBack = null) {
    if ((Date.now() - 750) >= this.lastDamage && this.dead === false) {

      let damagePostArmor = Math.ceil(amount * this.attributes.armor);

      if (this.attributes.shield === 0 && type !== "truedamage") {

        if( this.attributes.health >= damagePostArmor)
          this.attributes.health = this.attributes.health - damagePostArmor;
        else{
          damagePostArmor = this.attributes.health;
          this.attributes.health = 0;
        }
       
        this.healthBarManager.playerHealthChange(-damagePostArmor);
      }else{
        this.attributes.shield--;
        this.healthBarManager.reduceShields(1);
      }
      this.lastDamage = Date.now();

      this.controller.advanceStateTo("damaged", knockBack);

      this.scene.events.emit("playerDamaged");
      this.playerHitSound.volume = this.scene.registry.values.sound/10;
      this.playerHitSound.play();
    }
  }

  usePotion() {
    if (this.attributes.potions.number > 0) {
      this.attributes.potions.number--;
      this.healEvent(this.attributes.potions.potency);
    }
  }

  addShield(amount){
    this.healthBarManager.addShield(amount);
  }
  //Heals the player by the quantity specified
  healEvent(amount, type) {
 
    const originalHp = this.attributes.health;
    this.attributes.health = Math.min(this.attributes.health + amount, this.attributes.maxHealth);

    const realHealing = this.attributes.health - originalHp;
    this.healthBarManager.playerHealthChange(realHealing);
  }

  //Check if the player is dead 
  checkDeath() {
    if (this.attributes.health <= 0) {
      this.dead = true;
      return true;
    }else{
      return false
    }
  }

  //Executed when player death dialogue ends
  dialogueFlagEnds() {
    this.scene.playerDeath();
    this.destroy();
  }

  //Stop all player movement and make it unable to move
  stopMovement() {
    this.setVelocity(0, 0);
    this.canMove = false;
  }

  //Use que currentActive item if it exists
  useActiveItem() {
    if (this.currentActiveItem !== null) {
      this.currentActiveItem.activate(this, this.attributes.itemDamageMultiplier, this.listPassiveItems);
    }
  }

  /**
   * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
   * @override
   */
  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    this.controller.execute(dt);

    if (Phaser.Input.Keyboard.JustDown(this.cursors.attack) && this.canAttack) {
      this.controller.advanceStateTo("sword");
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.useItem) && this.canUseActive) {
      this.useActiveItem();
    }

    if (this.scene.registry.values.insideDungeon === false)
      if (this.y < 55)
        this.setDepth(1);
      else
        this.setDepth(3);

    this.playerActiveTime += dt;
    this.itemManager.updateCooldown(this.playerActiveTime);
  }

  makeAnimations(removeKeys = false) {
    this.on("animationcomplete", (event) => {
      switch (event.key.slice(0, -1)) {
        case "player_hit":
          this.setTexture("player_" + this.heroDesign, "Player_" + this.heroDesign + "-" + (0 + 24 * this.facing) + ".png");
          break;
        case "player_dead":
          this.scene.openDialogue("playerdeath1", "green", this.dialogueFlagEnds.bind(this));
          break;
      }

    })

    if (!removeKeys) {
      for (let i = 0; i < 8; i++) {
        this.scene.anims.create({
          key: "player_walk" + i,
          frameRate: 10,
          frames: this.anims.generateFrameNames("player_" + this.heroDesign, {
            prefix: "Player_" + this.heroDesign + "-",
            suffix: ".png",
            start: 0 + 24 * i,
            end: 3 + 24 * i,
            zeroPad: 1
          }),
          repeat: 0
        });
      }

      for (let i = 0; i < 8; i++) {
        this.scene.anims.create({
          key: "player_sword" + i,
          frameRate: 12,
          frames: this.anims.generateFrameNames("player_" + this.heroDesign, {
            prefix: "Player_" + this.heroDesign + "-",
            suffix: ".png",
            start: 4 + 24 * i,
            end: 7 + 24 * i,
            zeroPad: 1
          }),
          repeat: 0
        });
      }

      for (let i = 0; i < 8; i++) {
        this.scene.anims.create({
          key: "player_bow" + i,
          frameRate: 7,
          frames: this.anims.generateFrameNames("player_" + this.heroDesign, {
            prefix: "Player_" + this.heroDesign + "-",
            suffix: ".png",
            start: 8 + 24 * i,
            end: 11 + 24 * i,
            zeroPad: 1
          }),
          repeat: 0
        });
      }

      for (let i = 0; i < 8; i++) {
        this.scene.anims.create({
          key: "player_bowend" + i,
          frameRate: 7,
          frames: this.anims.generateFrameNames("player_" + this.heroDesign, {
            prefix: "Player_" + this.heroDesign + "-",
            suffix: ".png",
            start: 9 + 24 * i,
            end: 11 + 24 * i,
            zeroPad: 1
          }),
          repeat: 0
        });
      }

      for (let i = 0; i < 8; i++) {
        this.scene.anims.create({
          key: "player_staff" + i,
          frameRate: 7,
          frames: this.anims.generateFrameNames("player_" + this.heroDesign, {
            prefix: "Player_" + this.heroDesign + "-",
            suffix: ".png",
            start: 12 + 24 * i,
            end: 14 + 24 * i,
            zeroPad: 1
          }),
          repeat: 0
        });
      }
      for (let i = 0; i < 8; i++) {
        this.scene.anims.create({
          key: "player_staffend" + i,
          frameRate: 7,
          frames: this.anims.generateFrameNames("player_" + this.heroDesign, {
            prefix: "Player_" + this.heroDesign + "-",
            suffix: ".png",
            start: 13 + 24 * i,
            end: 14 + 24 * i,
            zeroPad: 1
          }),
          repeat: 0
        });
      }
      for (let i = 0; i < 8; i++) {
        this.scene.anims.create({
          key: "player_generic" + i,
          frameRate: 7,
          frames: this.anims.generateFrameNames("player_" + this.heroDesign, {
            prefix: "Player_" + this.heroDesign + "-",
            suffix: ".png",
            start: 15 + 24 * i,
            end: 17 + 24 * i,
            zeroPad: 1
          }),
          repeat: 0
        });
      }
      for (let i = 0; i < 8; i++) {
        this.scene.anims.create({
          key: "player_genericend" + i,
          frameRate: 7,
          frames: this.anims.generateFrameNames("player_" + this.heroDesign, {
            prefix: "Player_" + this.heroDesign + "-",
            suffix: ".png",
            start: 16 + 24 * i,
            end: 17 + 24 * i,
            zeroPad: 1
          }),
          repeat: 0
        });
      }
      for (let i = 0; i < 8; i++) {
        this.scene.anims.create({
          key: "player_hit" + i,
          frameRate: 6,
          frames: this.anims.generateFrameNames("player_" + this.heroDesign, {
            prefix: "Player_" + this.heroDesign + "-",
            suffix: ".png",
            start: 19 + 24 * i,
            end: 20 + 24 * i,
            zeroPad: 0
          }),
          repeat: 0
        });
      }
      for (let i = 0; i < 8; i++) {
        this.scene.anims.create({
          key: "player_dead" + i,
          frameRate: 6,
          frames: this.anims.generateFrameNames("player_" + this.heroDesign, {
            prefix: "Player_" + this.heroDesign + "-",
            suffix: ".png",
            start: 19 + 24 * i,
            end: 23 + 24 * i,
            zeroPad: 0
          }),
          repeat: 0
        });
      }
    } else {

      for (let i = 0; i < 8; i++) {
        this.scene.anims.remove("player_dead" + i);
        this.scene.anims.remove("player_hit" + i);
        this.scene.anims.remove("player_genericend" + i);
        this.scene.anims.remove("player_generic" + i);
        this.scene.anims.remove("player_staffend" + i);
        this.scene.anims.remove("player_staff" + i);
        this.scene.anims.remove("player_bowend" + i);
        this.scene.anims.remove("player_bow" + i);
        this.scene.anims.remove("player_sword" + i);
        this.scene.anims.remove("player_walk" + i);
      }
    }
  }

  hitboxAndSensors(x, y) {
    const bodies = Phaser.Physics.Matter.Matter.Bodies;
    this.hitbox = bodies.rectangle(0, -50, 23, 20, { label: "playerBody", sprite: { xOffset: 0, yOffset: 0.2 } });

    this.setExistingBody(this.hitbox).setPosition(x, y).setFixedRotation();
    this.setOrigin(0.5, 0.7);
    this.setMass(50);

    this.setDepth(2);
  }


  handleCollisionWith(other, me) {
    //Colisiones para hacer daño con la espada se tratan en swordSwing.js
  }
}
