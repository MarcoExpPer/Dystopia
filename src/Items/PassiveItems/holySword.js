import HolySwordProjectile from './holySwordProjectile';
import PassiveItem from './passiveItem';


// Clase que maneja el arco y dispara flechas cuando se activa
export default class HolySword extends PassiveItem {

  constructor(scene) {
    super(scene, "holySword", "holy_sword", 0, "holysword1");

    this.speed = 0.4;
    this.damage = 4;
  }

  equip(player, multiplier){
    super.equip(player, multiplier);

    this.usable = true;
    this.swordReady = true;

    this.scene.managers.eventManager.addEvent("playerDamaged", this.playerDamaged.bind(this));
  }

  activate(passiveList) {
    if ( this.swordReady === true && (this.player.attributes.maxHealth === this.player.attributes.health || this.usable === true) ) {
      this.calculateSpawningXY()

      this.swordReady = false;
      const sword = new HolySwordProjectile(this.scene, this.xRef, this.yRef, this.speed, this.player.facing, this.damage, "holy_sword", 0, this.player, this);

      for (let i of passiveList) {
        if (i.label === "fireEssence") {
          sword.addFireEffect(i);
        }
      }
    }
  }

  playerDamaged(){
    this.usable = false;
  }
}
