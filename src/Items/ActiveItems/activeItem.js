import Item from "../item";

export default class ActiveItem extends Item {

  constructor(scene, label, texture, frame, dialogueID, ammo) {
    super(scene, label, texture, frame, dialogueID);
    this.usable = true;

    this.currentAmmo = ammo;
    this.maxAmmo = ammo;
    this.isActive = true;
  }

  // Functions that needs to be overwrited for an active item to be activated and used
  activate(player) {
    this.player = player;
  }

  // When the long cooldown ends, we recharge all ammo
  cooldownEnds() {
    this.usable = true;
    this.currentAmmo = this.maxAmmo;
    this.player.itemManager.ammoChange(this.currentAmmo);
  }

  getAmmo() {
    return this.currentAmmo;
  }
}
