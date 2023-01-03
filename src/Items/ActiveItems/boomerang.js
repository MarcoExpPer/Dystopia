import ActiveItem from "./activeItem";
import BoomerangProjectile from "./boomerangProjectile";

export default class Boomerang extends ActiveItem {

  constructor(scene) {
    super(scene, "boomerang", "boomerang_ss", 0, "boomerang1", null);

    this.speed = 0.35;
    this.damage = 6;
    this.range = 140;
    this.cooldown = 7;
  }

  activate(player, multiplier, passiveItemList) {
    super.activate(player);
    this.damage = Math.floor( this.damage * multiplier);

    if (this.usable === true) {
      this.fire = null;

      for (let i of passiveItemList) {
        if (i.label === "fireEssence") {
          this.fire = i;
        }
      }

      this.player.controller.advanceStateTo("aim", "none", this.throw.bind(this));
      this.calculateSpawningXY(this.player.x, this.player.y, this.player.facing);
    }
  }

  throw() {
      this.usable = false;
      // Permitimos que se use de nuevo cuando se acabe el cooldown
      this.cooldownTiming = this.scene.time.addEvent({
          delay: (this.cooldown * 1000),
          callback: this.cooldownEnds,
          callbackScope: this,
          loop: false
      });
      // Actualizamos el cooldown en la UI
      this.player.itemManager.startCooldown(this.cooldown, this.player.playerActiveTime);

      this.player.play("player_genericend" + this.player.facing, true);

      this.scene.time.addEvent({
          delay: 320,
          callback: this.throwend,
          callbackScope: this,
          loop: false
      });

      this.calculateSpawningXY(this.player.x, this.player.y, this.player.facing);
      this.player.cursors.useItem
  }

  // Cuando la animacion termina lanzamos el boomerang y avisamos al jugador de que se puede mover
  throwend() {
    const boomerang = new BoomerangProjectile(this.scene, this.xRef, this.yRef, this.speed, this.player.facing, this.damage, this.range);
    if (this.fire !== null) boomerang.addFireEffect(this.fire);
    this.player.controller.advanceStateTo("move");
  }
}
