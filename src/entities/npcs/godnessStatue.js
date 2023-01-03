import Phaser from 'phaser'
import NPC from './npc';


/**
 * Clase que representa al NPC Diosa.
 */
export default class GodnessStatue extends NPC {

  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la diosa
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   */
  constructor(scene, x, y) {
    super(scene, x, y, 'empty64x', 0, "godness");
    this.setScale(0.5);
  }

  //Open his dialogue when interacted
  interact() {
    this.scene.openDialogue("godnesstatue1", "green", this.dialogueFlagEnds.bind(this), this.scene.NPCs);
  }
  
}