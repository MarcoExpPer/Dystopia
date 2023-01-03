import PassiveItem from './passiveItem';

/**
 * 
 * Godheart. El heroe obtiene un escudo que le protege del proximo daño recibido. 
 * Cuando pasa de sala recupera el escudo si lo habia gastado anteriormente
*/
export default class GodHearth extends PassiveItem {

  constructor(scene) {
    super(scene, "godHearth", "hearths_ss", 5, "godHearth1");
    this.damage = 0;
  }

  equip(player, multiplier) {
    super.equip(player, multiplier);

    this.scene.player.attributes.shield++;
    this.scene.player.addShield(1);

    this.usable = false;

    this.scene.managers.eventManager.addEvent("playerDamaged", this.playerDamaged.bind(this));
    this.scene.managers.eventManager.addEvent("newroom", this.newRoom.bind(this));

  }

  playerDamaged() {
    this.usable = true
  }

  newRoom() {
    if (this.usable === true) {
      this.usable = false;
      this.scene.player.attributes.shield++;
      this.scene.player.addShield(1);
    }
  }
}
