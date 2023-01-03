import Phaser from 'phaser'

import BoomerangData from '../DialogueData/itemsDialogues/boomerangData';
import bowData from '../DialogueData/itemsDialogues/bowData';
import HolySwordData from '../DialogueData/itemsDialogues/holySwordData';

import chooseDungeonData from '../DialogueData/chooseDungeonData';
import DruidData from '../DialogueData/druidData';

import godnessStatueData from '../DialogueData/godnessStatueData';
import MaskedData from '../DialogueData/maskedData';
import onPlayerDeathData from '../DialogueData/onPlayerDeathData';
import SmithData from '../DialogueData/smithData';
import GodHearthData from '../DialogueData/itemsDialogues/godhearthData';

import CustomeMenu from '../UI/customeMenu';

import Dialogue from '../UI/dialogue';
import GodShop from '../UI/godshop/godShop';
import FireEssenceData from '../DialogueData/itemsDialogues/fireEssenceData';
import KeyboardInput from './keyboardInput';
import SmithBuyData from '../DialogueData/firstBuyDialogues/smithBuyData';
import DruidBuyData from '../DialogueData/firstBuyDialogues/druidBuyData';
import MaskedBuyData from '../DialogueData/firstBuyDialogues/maskedBuyData';


/**
 * Escena de dialogo.
 * @extends Phaser.Scene
 */
export default class DialogueScene extends KeyboardInput {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'dialogue' });
    this.prepareDialogueData();
  }

  //We only create this map one time.
  prepareDialogueData() {
    this.dialogueData = new Map();

    this.dialogueData.set("blacksmithbuy", new SmithBuyData());
    this.dialogueData.set("blacksmith1", new SmithData());
    
    this.dialogueData.set("druidbuy", new DruidBuyData());
    this.dialogueData.set("druid1", new DruidData());

    this.dialogueData.set("maskedbuy", new MaskedBuyData());
    this.dialogueData.set("masked1", new MaskedData());

    this.dialogueData.set("godnesstatue1", new godnessStatueData());
    this.dialogueData.set("chooseDungeon", new chooseDungeonData());
    
    this.dialogueData.set("playerdeath1", new onPlayerDeathData());
  
    this.dialogueData.set("bow1", new bowData());
    this.dialogueData.set("boomerang1", new BoomerangData());

    this.dialogueData.set("holysword1", new HolySwordData());
    this.dialogueData.set("godHearth1", new GodHearthData());
    this.dialogueData.set("fireEssence1", new FireEssenceData());

    
  }

  /**
   * Inicializa los datos de la escena
   */
  init(data) {
    this.id = data.id;
    this.color = data.color;
    this.mainScene = data.mainScene;
    this.sourceEnd = data.onEnd;
    this.parameters = data.parameters;
  }

  create() {
    super.create();

    //Make a copy of the data so we are not overwriting the same data every single time
    let dialogueData = JSON.parse(JSON.stringify(this.dialogueData.get(this.id)));

    this.dialogue = new Dialogue(this, 160, 335, this.color, dialogueData, 20);
    this.add.existing(this.dialogue);
    
    this.dialogue.initMessages();
  }

  // Function executed when the dialogue is told to end
  onEnd() {
    this.sourceEnd(); // Function of the actor that created this dialogue

    // Resume the scene that started this dialogue
    this.scene.resume(this.mainScene);
    this.scene.stop();
  }

  // Open godess shop
  openStatueShop() {
    this.selectables = new Array();

    this.godShop = new GodShop(this, 384, 250, this.color, this.parameters);
    this.add.existing(this.godShop);

    this.dialogue.hideDialogue();

    this.row = 0;
    this.col = 0;
    this.select(1, 1);
  }

  goToDungeon(typeEnemy) {

    this.dialogue.destroy();
    this.scene.resume(this.mainScene);
    this.mainScene.goToDungeon(typeEnemy);
    this.scene.stop();

  }

  openCustomeMenu() {
    this.selectables = new Array();

    this.customeMenu = new CustomeMenu(this, 384, 250, this.color, this.parameters.find((element) => element.getName() === "majora"));
    this.add.existing(this.customeMenu);

    this.dialogue.hideDialogue();

    this.row = 0;
    this.col = 0;

    this.select(0, 0)

  }

  update(t, dt) {
    super.update(t, dt);

    if (this.godShop !== undefined && this.godShop.isActive )
      this.godShop.preUpdate(t, dt);
  }

  togglePause(){}

  playerInteract(){
    if( this.godShop !== undefined) this.godShop.isActive = false;
    if( this.customeMenu !== undefined) this.customeMenu.destroy();

    this.onEnd();

  }

  executeSelected(row, col){
    if(!this.dialogue.active || this.dialogue.typewriteTimer.getOverallProgress() === 1)
      this.selectables[row][col].execute();
    else
      this.dialogue.skipText();
  }
}
