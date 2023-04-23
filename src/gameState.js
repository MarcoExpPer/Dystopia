/**
 * Class that represents a saved Game State
 */
export default class GameState {

  constructor() { }

  saveGame(values) {
    localStorage.setItem('saveFile' + values.saveslot, JSON.stringify(values));
  }

  loadFile(saveSlot) {
    let data = JSON.parse(localStorage.getItem('saveFile' + saveSlot));
    if (data === null) data = this.newFile(saveSlot);
    return data;
  }

  deleteSlot(slotdata, scene) {
    slotdata = this.newFile(slotdata.saveslot);
    localStorage.setItem('saveFile' + slotdata.saveslot, JSON.stringify(slotdata));
    scene.scene.start('mainmenu');
  }

  parseFileIntoRegistry(registry, file) {
    for (const [key, value] of Object.entries(file)) {
      registry.set(key, value);
    }
  }

  // Create a few file game in the saveSlot
  newFile(saveSlot) {
    let newFile = {};
    // Save data
    newFile.saveslot = saveSlot;
    newFile.savename = "Nueva Partida";
    newFile.isnewgame = true;

    // Player Options
    newFile.sound = 1;
    newFile.textSpeed = 35;
    newFile.chestAnimations = true;

    // Resources
    newFile.souls = 0;
    newFile.coins = 0;
    newFile.keys = 0;

    // NPC Levels
    newFile.blacksmithLvl = 0;
    newFile.druidLvl = 0;
    newFile.maskedLvl = 0;

    // Generic
    newFile.playerType = 0;
    newFile.insideDungeon = false;

    return newFile;
  }
}
