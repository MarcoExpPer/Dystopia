import Phaser from 'phaser'
import DruidLevelingData from './druidLevelingData';
import NPC from './npc';
/**
 * Clase que representa al NPC Druid.
 */
export default class Druid extends NPC {

  /**
   * Constructor del Druid
   * @param {Phaser.Scene} scene Escena a la que pertenece el Druid
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   */
  constructor(scene, x, y, level) {
    super(scene, x, y, 'npc_3', 0, "druida", level);

    this.utils = new DruidLevelingData();

    this.prepareHitBox();
    this.prepareAnimations();
  }

  //Make the Druid stop working and open his dialogue
  interact() {
    if (this.exist === true) {
      //Look to the player
      let facing = 2; //N
      if (this.scene.player.getLeftCenter().x + 5 > this.getRightCenter().x)
        facing = 1;   //E
      else if (this.scene.player.getRightCenter().x - 5 < this.getLeftCenter().x)
        facing = 3;   //W
      else if (this.scene.player.getCenter().y > this.getCenter().y)
        facing = 0;   //S

      this.setTexture("npc_3", facing * 3 + ".png");

      this.scene.openDialogue("druid1", "green", this.dialogueFlagEnds.bind(this));
    }
  }

  flagFirstLevelUp(){
    this.scene.queueDialogue("druidbuy", this.dialogueFlagEnds.bind(this));
  }
  //Set the new level of the NPC and also set the player potions to the required level
  setLevel(newLevel) {
    super.setLevel(newLevel);

    this.scene.player.attributes.potions.max = this.getPotions(newLevel);
    this.scene.player.attributes.potions.number = this.getPotions(newLevel);
    this.scene.player.attributes.potions.potency = this.getPotionPotency(newLevel);

  }

  //Returns the number of potions that lvl parameter gives
  getPotions(lvl) {
    if(this.utils === undefined) this.utils = new DruidLevelingData();

    return this.utils.getPotions(lvl);
  }

  //Returns the potion potency that lvl parameter gives
  getPotionPotency(lvl) {
    if(this.utils === undefined) this.utils = new DruidLevelingData();

    return this.utils.getPotionPotency(lvl);
  }

  //Returns the potion frame potency that lvl parameter gives
  getPotionFramePotency(lvl) {
    if(this.utils === undefined) this.utils = new DruidLevelingData();

    return this.utils.getPotionFramePotency(lvl);
  }

  //Prepare the hitbox of this NPC
  prepareHitBox() {
    this.setScale(2);
    this.setTexture("npc_3", "0" + ".png");
  }

  //Prepare the animations of this NPC
  prepareAnimations() {
    for (let i = 0; i < 4; i++) {
      this.scene.anims.create({
        key: "walk" + (i * 2),
        frameRate: 4,
        frames: this.anims.generateFrameNames("npc_3", {
          suffix: ".png",
          start: 1 + i * 3,
          end: 2 + i * 3,
        }),
        repeat: -1
      });
    }
  }
  
}