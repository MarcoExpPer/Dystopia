import Item from "../item";

export default class PassiveItem extends Item {

  constructor(scene, label, texture, frame, dialogueID) {
    super(scene, label, texture, frame, dialogueID);
    this.isActive = false;
  }

  // Make this passive item ready to work and apply to the player any buff if necesary
  equip(player, multiplier){
    this.damage = Phaser.Math.CeilTo(this.damage * multiplier);
    this.player = player;
  }

  // If the passive item can be activated, it should override this
  activate() {}
}
