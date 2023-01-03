import Phaser from 'phaser'
import Entity from '../entity';

/**
 * Clase que representa la base para los NPCs del juego
 */
export default class NPC extends Entity {

  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {string} texture Textura con la que renderiza la entidad
   * @param {frame} frame Marco de la textura con la que renderiza la entidad
   * @param {number} level Nivel del NPC, si es 0 el npc no sera visible ingame
   */
  constructor(scene, x, y, texture, frame, name, level = 0) {
    super(scene, x, y, texture, frame);
    this.isActive = false;
    this.name = name;
    this.level = level;

    this.setLevel(level);

    this.setStatic(true);
  }

  //Set the new NPC lvl and spawn it of necesary
  setLevel(newLvl) {
    if(this.level === 0 && newLvl > 0) this.flagFirstLevelUp();
    this.level = newLvl;

    if (newLvl > 0){
      this.spawnNPC();
    }else{
      this.despawnNPC();
    }

  }
  
  flagFirstLevelUp(){}

  //Make the npc visible and interactuable
  spawnNPC() {
    this.setSensor(false);
    this.setVisible(true);
    this.setActive(true);

    this.exist = true;
  }
  //Despawn the ACtor
  despawnNPC(){
    this.setSensor(true);
    this.setVisible(false);
    this.setActive(false);

    this.exist = false;
  }

  //Returns the name of the NPC to 
  getName() {
    return this.name;
  }

  //If the NPC wanna do something when the dialogue ends, needs to overwrite this
  dialogueFlagEnds() {}

  //IF the NPC (or anything tbh) want to be interactuable with player E, needs to overwrite this
  interact(){}
}
