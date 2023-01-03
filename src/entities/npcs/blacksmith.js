import Phaser from 'phaser'
import NPC from './npc';
/**
 * Clase que representa al NPC herrero.
 */
export default class Blacksmith extends NPC {

  /**
   * Constructor del herrero
   * @param {Phaser.Scene} scene Escena a la que pertenece el Herrero
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   */
  constructor(scene, x, y, level) {
    super(scene, x, y, 'npc_1', 0, "herrero", level);
    
    this.prepareHitBox();
    this.prepareAnimations();

    
  }

  //Make the smith stop working and open his dialogue
  interact() {
    if (this.exist === true) {
      //Look to the player
      let facing = 2; //N
      if (this.scene.player.getLeftCenter().x+5 > this.getRightCenter().x)
        facing = 1;   //E
      else if (this.scene.player.getRightCenter().x-5 < this.getLeftCenter().x)
        facing = 3;   //W
      else if (this.scene.player.getCenter().y > this.getCenter().y)
        facing = 0;   //S

      this.setTexture("npc_1", facing*3 + ".png");

      this.scene.openDialogue("blacksmith1", "green", this.dialogueFlagEnds.bind(this));
    }
  }
  //When the dialogue ends, the smith starts to work again
  dialogueFlagEnds() {}

  flagFirstLevelUp(){
    this.scene.queueDialogue("blacksmithbuy", this.dialogueFlagEnds.bind(this));
  }

  //Set the new level of the NPC and also increase player max hp based on that
  setLevel(newLevel) {
    super.setLevel(newLevel);

    this.scene.player.attributes.maxHealth = 12 + 4 * newLevel;
    this.scene.player.attributes.health = this.scene.player.attributes.maxHealth;

    this.scene.player.healthBarManager.increaseMaxHp(this.scene.player.attributes.maxHealth, true);
    
  }

  //Prepare the hitbox of this NPC
  prepareHitBox() {
    this.setScale(2);
    this.setTexture("npc_1", "3" + ".png");

  }

  //Prepare the animations of this NPC
  prepareAnimations() {
    for (let i = 0; i < 4; i++) {
      this.scene.anims.create({
        key: "walk" + (i * 2),
        frameRate: 4,
        frames: this.anims.generateFrameNames("npc_1", {
          suffix: ".png",
          start: 1 + i * 3,
          end: 2 + i * 3,
        }),
        repeat: -1
      });
    }
  }
}