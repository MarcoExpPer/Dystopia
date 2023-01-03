import FireEssenceFloor from '../../entities/floorActivables/fireEssenceFloor';
import PassiveItem from './passiveItem';

export default class FireEssence extends PassiveItem {

  constructor(scene) {
    super(scene, "fireEssence", "small_fire_loop", 2, "fireEssence1");
    this.damage = 1;
  }

  equip(player, multiplier) {
    super.equip(player, multiplier);
  }

  activate(originX, originY, direction, type) {
    new FireEssenceFloor(this.scene, originX, originY, this.damage, direction, type);
  }
}
