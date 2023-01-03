import Arrow from '../../entities/arrow';
import ActiveItem from './activeItem';

/**
 * Clase que maneja el arco y dispara flechas cuando se activa
 */
export default class Bow extends ActiveItem {

  constructor(scene) {
    super(scene, "bow", "bow_ss", 0, "bow1", 3);

    this.speed = 0.5;
    this.damage = 12;
    this.cooldown = 20;

    this.bowShotSound = this.scene.sound.add("bowShotSound");
  }

  activate(player, multiplier, passiveItemList) {
    super.activate(player);
    this.damage = Math.floor(this.damage * multiplier);

    if (this.usable === true) {
      this.fire = null;
      for (let i of passiveItemList) {
        if (i.label === "fireEssence") {
          this.fire = i;
        }
      }
      this.player.controller.advanceStateTo("aim", "bow", this.shoot.bind(this));
    }
  }

  // Shoot the arrow and update the cooldown and the ammo
  shoot() {
    // Permitimos que se use de nuevo cuando se acabe el cooldown
    this.cooldownTiming = this.scene.time.addEvent({
      delay: (this.cooldown * 1000),
      callback: this.cooldownEnds,
      callbackScope: this,
      loop: false
    });

    this.currentAmmo--;
    if (this.currentAmmo == 0) this.usable = false;

    // Actualizamos el cooldown y la municion en la UI
    this.player.itemManager.startCooldown(this.cooldown, this.player.playerActiveTime);
    this.player.itemManager.ammoChange(this.currentAmmo);

    this.calculateSpawningXY(this.player.x, this.player.y, this.player.facing);
    this.player.play("player_bowend" + this.player.facing);
    const arrow = new Arrow(this.scene, this.xRef, this.yRef, this.speed, this.player.facing, this.damage, this.player, true , false);
    if (this.fire !== null) arrow.addFireEffect(this.fire);

    this.scene.time.addEvent({
      delay: 280,
      callback: this.shootEnds,
      callbackScope: this,
      loop: false
    });

    this.bowShotSound.volume = this.scene.registry.values.sound / 10;
    this.bowShotSound.play();
  }

  // Tell the state machine to return to normal
  shootEnds() {
    this.player.controller.advanceStateTo("move");
  }
}
