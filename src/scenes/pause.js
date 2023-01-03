import Phaser from 'phaser'
import ItemsUI from '../UI/ItemsUI';
import RectangleAndText from '../UI/basicUI/rectangleAndText';
import UIutils from '../UI/uiutils';
import PotionsTrackerManager from '../UIManagers/potionsTrackerManager';
import Button from './../UI//basicUI/button';
import OptionsUtils from '../optionsUtils';
import KeyboardInput from './keyboardInput';

/**
 * Escena de pausa.
 * @extends Phaser.Scene
 */
export default class PauseMenu extends KeyboardInput {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'pauseMenu' });
  }
  /**
   * Inicializa los datos de la escena
   */
  init(data) {

    this.mainScene = data;
    this.dungeonUI = this.registry.values.insideDungeon;

  }

  /**
   * Creación de los elementos
   */
  create() {
    super.create();

    this.xRef = this.cameras.main.width / 2;
    this.yRef = this.cameras.main.height / 2 - 50;

    this.optionsUtils = new OptionsUtils(this);
    this.UIutils = new UIutils();

    this.color = this.UIutils.chooseColor(this.dungeonUI);
    this.fontColor = this.UIutils.chooseStyle(this.color);
    this.type = "large";

    this.ySpan = 55;

    this.createItemsUI();
    this.createPotionsUI();


    this.passiveItemsActive = false;
    let aux = this.itemsUI.getPassiveItemsButtons();
    let aux1 = new Array();
    for (let i = 0; i < aux.length; i++) {
      aux1.push(this.potionsUI);
    }

    this.passiveItemsButtons = new Array();
    this.passiveItemsButtons.push(aux1);
    this.passiveItemsButtons.push(aux);

    this.activeItemsActive = false;
    aux = this.itemsUI.getActiveItemsButtons();
    aux1 = new Array();
    for (let i = 0; i < aux.length; i++) {
      aux1.push(this.potionsUI);
    }

    this.activeItemsButtons = new Array();
    this.activeItemsButtons.push(aux1);
    this.activeItemsButtons.push(aux);

    this.createOptionsUI();
    this.createMainPauseUI();
    this.createOptionsUI();
    this.createSoundUI();
    this.createGameSettingsUI();
    this.createGraphicUI();
    this.areUsureMenuActive = false;

    this.row = 0;
    this.col = 0;

    this.currentUI = this.pauseUI;
    this.activateMainPauseUI();


  }
  /**
   * POTIONS UI
   */

  createPotionsUI() {
    this.potionsUI = new PotionsTrackerManager(this, this.mainScene.player, 20, 50);

    this.add.existing(this.potionsUI);
    this.setActivable(this.potionsUI, true);
  }
  /**
   * ITEMS UI
   */
  createItemsUI() {
    this.itemsUI = new ItemsUI(this, 3 * this.cameras.main.width / 4, this.cameras.main.height / 4, this.mainScene.player, this.color, this.fontColor);
    this.add.existing(this.itemsUI);
    this.setActivable(this.itemsUI, true);
  }


  leftLimit() {
    if (this.areUsureMenuActive === false) {
      if (this.passiveItemsActive === false) {
        if (this.activeItemsActive === true) {
          this.selectFromMenu(1, 0);
        }
        else if (this.passiveItemsButtons[1].length > 0) {
          this.passiveItemsActive = true;
          this.selectFromPassives(1, this.passiveItemsButtons[1].length - 1);
        }
      }
    }
  }

  rightLimit() {
    if (this.areUsureMenuActive === false) {
      if (this.activeItemsActive === false) {
        if (this.passiveItemsActive === true) {
          this.selectFromMenu(1, 0);
        }
        else if (this.activeItemsButtons[1].length > 0) {
          this.selectFromActives(1, 0);
        }
      }
    }
  }

  /**
   * MAIN PAUSE UI
   */
  createMainPauseUI() {
    this.pauseUI = new Phaser.GameObjects.Container(this, 0, 0);

    const mainText = new Phaser.GameObjects.Text(this, this.xRef, this.yRef - this.ySpan * 2, "PAUSE").setOrigin(0.5).setColor(this.fontColor).setFontSize(50);
    this.pauseUI.add(mainText);

    const continue_button = new Button(this, this.xRef, this.yRef + this.ySpan * 0, this.color, this.type, 1, "Continuar", this.togglePause.bind(this), this.selectFromMenu.bind(this, 1, 0));
    this.pauseUI.add(continue_button);

    const options_button = new Button(this, this.xRef, this.yRef + this.ySpan * 1, this.color, this.type, 1, "Opciones", this.activateOptionsUI.bind(this), this.selectFromMenu.bind(this, 2, 0))
    this.pauseUI.add(options_button);

    if (this.dungeonUI) {
      const village_button = new Button(this, this.xRef, this.yRef + this.ySpan * 2, this.color, this.type, 1, "Volver al Pueblo", this.areYouSure.bind(this, "village", "¿Ir al pueblo?"), this.selectFromMenu.bind(this, 3, 0))
      this.pauseUI.add(village_button);

      const mainMenu_button = new Button(this, this.xRef, this.yRef + this.ySpan * 4, this.color, this.type, 1, "Menu Principal", this.areYouSure.bind(this, "mainmenu", "¿Ir al menu principal?"), this.selectFromMenu.bind(this, 4, 0))
      this.pauseUI.add(mainMenu_button);

      this.pauseUIButtons = [
        [this.potionsUI],
        [continue_button],
        [options_button],
        [village_button],
        [mainMenu_button]
      ];

    } else {
      const mainMenu_button = new Button(this, this.xRef, this.yRef + this.ySpan * 4, this.color, this.type, 1, "Menu Principal", this.areYouSure.bind(this, "mainmenu", "¿Ir al menu principal?"), this.selectFromMenu.bind(this, 3, 0))
      this.pauseUI.add(mainMenu_button);

      this.pauseUIButtons = [
        [this.potionsUI],
        [continue_button],
        [options_button],
        [mainMenu_button]
      ];
    }


    this.add.existing(this.pauseUI);
    this.setActivable(this.pauseUI, false);

  }

  activateMainPauseUI() {

    if (this.selectables.length !== 0) this.selectables[this.row][this.col].unselect();

    this.itemsUI.changeInteractuable(true);

    this.currentMenuButtons = this.pauseUIButtons;
    this.selectables = this.pauseUIButtons;
    this.row = 1;
    this.col = 0;

    this.activeItemsSelected = false;

    this.setActivable(this.currentUI, false);
    this.setActivable(this.pauseUI, true);

    this.currentUI = this.pauseUI;

    this.select(this.row, this.col);
  }

  togglePause() {
    this.scene.resume(this.mainScene);
    this.scene.stop();
    this.sound.resumeAll();
  }

  returnVillage() {
    this.registry.values.currencyTemp = 0;
    this.scene.stop(this.mainScene);
    this.scene.start('village');
  }

  /**
   * OPTIONS MENU
   */

  createOptionsUI() {
    this.optionsUI = new Phaser.GameObjects.Container(this, 0, 0);

    const mainText = new Phaser.GameObjects.Text(this, this.xRef, this.yRef - this.ySpan * 2, "OPCIONES").setOrigin(0.5).setColor(this.fontColor).setFontSize(50);
    this.optionsUI.add(mainText);

    const sound_button = new Button(this, this.xRef, this.yRef + this.ySpan * 0, this.color, this.type, 1, "Sonido", this.activateSoundUI.bind(this), this.selectFromMenu.bind(this, 1, 0))
    this.optionsUI.add(sound_button);

    const game_button = new Button(this, this.xRef, this.yRef + this.ySpan * 1, this.color, this.type, 1, "Juego", this.activateGameSettingsUI.bind(this), this.selectFromMenu.bind(this, 2, 0))
    this.optionsUI.add(game_button);

    const graphics_button = new Button(this, this.xRef, this.yRef + this.ySpan * 2, this.color, this.type, 1, "Graficos", this.activateGraphicUI.bind(this), this.selectFromMenu.bind(this, 3, 0))
    this.optionsUI.add(graphics_button);

    const back_button = new Button(this, this.xRef, this.yRef + this.ySpan * 3, this.color, this.type, 1, "Atras", this.activateMainPauseUI.bind(this), this.selectFromMenu.bind(this, 4, 0))
    this.optionsUI.add(back_button);

    this.optionsUIButtons = [
      [this.potionsUI],
      [sound_button],
      [game_button],
      [graphics_button],
      [back_button]
    ];

    this.add.existing(this.optionsUI);
    this.setActivable(this.optionsUI, false);
  }

  activateOptionsUI() {
    this.selectables[this.row][this.col].unselect();

    this.currentMenuButtons = this.optionsUIButtons;
    this.selectables = this.optionsUIButtons;
    this.row = 1;
    this.col = 0;

    this.setActivable(this.currentUI, false);
    this.setActivable(this.optionsUI, true);

    this.currentUI = this.optionsUI;

    this.select(this.row, this.col);
  }


  /**
   * SOUND MENU
   */

  createSoundUI() {
    this.soundUI = new Phaser.GameObjects.Container(this, 0, 0);

    const mainText = new Phaser.GameObjects.Text(this, this.xRef, this.yRef - this.ySpan * 2, "SONIDO").setOrigin(0.5).setColor(this.fontColor).setFontSize(50);
    this.soundUI.add(mainText);

    const vol_up = new Button(this, this.xRef, this.yRef + this.ySpan * 0, this.color, this.type, 1, "+", this.changeVolume.bind(this, 1), this.selectFromMenu.bind(this, 1, 0));
    this.soundUI.add(vol_up);

    const vol_down = new Button(this, this.xRef, this.yRef + this.ySpan * 1, this.color, this.type, 1, "-", this.changeVolume.bind(this, -1), this.selectFromMenu.bind(this, 2, 0));
    this.soundUI.add(vol_down);

    this.volumeText = this.add.text(this.xRef, this.yRef + this.ySpan * 2, this.registry.values.sound).setOrigin(0.5).setColor(this.fontColor).setFontSize(50);
    this.soundUI.add(this.volumeText);

    const back_button = new Button(this, this.xRef, this.yRef + this.ySpan * 3, this.color, this.type, 1, "Atras", this.activateOptionsUI.bind(this), this.selectFromMenu.bind(this, 3, 0))
    this.soundUI.add(back_button);

    this.soundUIButtons = [
      [this.potionsUI],
      [vol_up],
      [vol_down],
      [back_button]
    ];

    this.add.existing(this.soundUI);
    this.setActivable(this.soundUI, false);
  }

  activateSoundUI() {
    this.selectables[this.row][this.col].unselect();

    this.currentMenuButtons = this.soundUIButtons;
    this.selectables = this.soundUIButtons;
    this.row = 1;
    this.col = 0;

    this.setActivable(this.currentUI, false);
    this.setActivable(this.soundUI, true);

    this.currentUI = this.soundUI;

    this.select(this.row, this.col);
  }

  changeVolume(newChange) {
    const newValue = this.optionsUtils.changeVolume(null, newChange);

    this.volumeText.text = newValue;
  }

  /**
   * GAME SETTINGS MENU
   */

  createGameSettingsUI() {
    this.gameUI = new Phaser.GameObjects.Container(this, 0, 0);

    const mainText = new Phaser.GameObjects.Text(this, this.xRef, this.yRef - this.ySpan * 2, "JUEGO").setOrigin(0.5).setColor(this.fontColor).setFontSize(50);
    this.gameUI.add(mainText);

    this.gameUI.add(new RectangleAndText(this, this.xRef, this.yRef + this.ySpan * 0, this.color, this.type, 1, "Velocidad del Texto"));

    this.speedText = new RectangleAndText(this, this.xRef, this.yRef + 40, this.color, this.type, 0.9, this.optionsUtils.translateTextSpeed(this.registry.values.textSpeed));
    this.gameUI.add(this.speedText);

    const increase_button = new Button(this, this.xRef + 130, this.yRef + 40, this.color, "right", 0.7, "", this.textSpeedChange.bind(this, true), this.selectFromMenu.bind(this, 1, 0))
    this.gameUI.add(increase_button);

    const decrease_button = new Button(this, this.xRef - 130, this.yRef + 40, this.color, "left", 0.7, "", this.textSpeedChange.bind(this, false), this.selectFromMenu.bind(this, 1, 1))
    this.gameUI.add(decrease_button);

    let text = "Activar animaciones de cofres";
    if (this.registry.values.chestAnimations === true)
      text = "Desactivar animaciones de cofres"

    this.chest_button = new Button(this, this.xRef, this.yRef + this.ySpan * 2, this.color, this.type, 1, text, this.toggleChestAnimation.bind(this), this.selectFromMenu.bind(this, 2, 0), 15)
    this.gameUI.add(this.chest_button);

    const back_button = new Button(this, this.xRef, this.yRef + this.ySpan * 3, this.color, this.type, 1, "Atras", this.activateOptionsUI.bind(this), this.selectFromMenu.bind(this, 3, 0))
    this.gameUI.add(back_button);

    this.gameUIButtons = [
      [this.potionsUI],
      [decrease_button, increase_button],
      [this.chest_button],
      [back_button]
    ];

    this.add.existing(this.gameUI);
    this.setActivable(this.gameUI, false);

  }

  activateGameSettingsUI() {
    this.selectables[this.row][this.col].unselect();

    this.currentMenuButtons = this.gameUIButtons
    this.selectables = this.gameUIButtons;
    this.row = 1;
    this.col = 0;

    this.setActivable(this.currentUI, false);
    this.setActivable(this.gameUI, true);

    this.currentUI = this.gameUI;

    this.select(this.row, this.col);
  }

  textSpeedChange(increase) {
    let newText;
    if (increase)
      newText = this.optionsUtils.textSpeedIncrease(null)
    else
      newText = this.optionsUtils.textSpeedDecrease(null)

    this.speedText.changeText(newText);
  }

  toggleChestAnimation() {
    const newValue = this.optionsUtils.toggleChestAnimation(null);

    let text = "Activar animaciones de cofres";
    if (newValue === true)
      text = "Desactivar animaciones de cofres"

    this.chest_button.text.text = text;
    this.chest_button.select();
  }

  /**
   * GRAPHIC MENU
   */

  createGraphicUI() {

    this.graphicsUI = new Phaser.GameObjects.Container(this, 0, 0);

    const mainText = new Phaser.GameObjects.Text(this, this.xRef, this.yRef - this.ySpan * 2, "GRAFICOS").setOrigin(0.5).setColor(this.fontColor).setFontSize(50);
    this.graphicsUI.add(mainText);

    const fulLScreen = new Button(this, this.xRef, this.yRef + this.ySpan * 0, this.color, this.type, 1, "Pantalla Completa", this.toogleFullScreen.bind(this), this.selectFromMenu.bind(this, 1, 0))
    this.graphicsUI.add(fulLScreen);

    let texture = this.color + "_x";
    if (!this.scale.isFullscreen) texture = this.color + "_tick";

    this.fullScreenIcon = new Phaser.GameObjects.Image(this, this.xRef, this.yRef + this.ySpan * 0.9, texture).setScale(0.8);
    this.graphicsUI.add(this.fullScreenIcon);

    const back_button = new Button(this, this.xRef, this.yRef + this.ySpan * 3, this.color, this.type, 1, "Atras", this.activateOptionsUI.bind(this), this.selectFromMenu.bind(this, 2, 0))
    this.graphicsUI.add(back_button);

    this.graphicsUIButtons = [
      [this.potionsUI],
      [fulLScreen],
      [back_button]
    ];

    this.add.existing(this.graphicsUI);
    this.setActivable(this.graphicsUI, false);

  }

  activateGraphicUI() {
    this.selectables[this.row][this.col].unselect();

    this.currentMenuButtons = this.graphicsUIButtons
    this.selectables = this.graphicsUIButtons;
    this.row = 1;
    this.col = 0;

    this.setActivable(this.currentUI, false);
    this.setActivable(this.graphicsUI, true);

    this.currentUI = this.graphicsUI;

    this.select(this.row, this.col);
  }

  toogleFullScreen() {
    const newTexture = this.optionsUtils.toogleFullScreen(this);

    this.fullScreenIcon.setTexture(this.color + "_" + newTexture);
    this.select(this.row, this.col);
  }


  /*
  * ARE U SURE MENU
  */
  areYouSure(gotoScene, text) {

    const areUsureUI = new Phaser.GameObjects.Container(this, 0, 0);

    this.areUsureMenuActive = true;

    this.blackground = new Phaser.GameObjects.Image(this, 768 / 2, 512 / 2, "blackscreen").setDepth(10).setAlpha(0.5);
    areUsureUI.add(this.blackground);

    this.areusure = new RectangleAndText(this, this.xRef, this.yRef + 40, this.color, this.type, 1, text).setDepth(11);
    areUsureUI.add(this.areusure);

    const yes = new Button(this, this.xRef + 60, this.yRef + 90, this.color, "tick", 0.8, "", this.yesImSure.bind(this, gotoScene), this.selectFromMenu.bind(this, 0, 1)).setDepth(11)
    areUsureUI.add(yes);

    const no = new Button(this, this.xRef - 60, this.yRef + 90, this.color, "x", 0.8, "", this.activateMainPauseUI.bind(this), this.selectFromMenu.bind(this, 0, 0)).setDepth(11)
    areUsureUI.add(no);

    this.areUsureButtons = [
      [no, yes],
    ];

    this.add.existing(areUsureUI);

    this.activateAreUsureUI(areUsureUI);
  }

  activateAreUsureUI(areUsureUI) {
    this.selectables[this.row][this.col].unselect();

    this.itemsUI.changeInteractuable(false);

    this.currentMenuButtons = this.areUsureButtons
    this.selectables = this.areUsureButtons;
    this.row = 0;
    this.col = 0;

    this.activeItemsSelected = true;

    this.setActivable(this.currentUI, false);
    this.setActivable(areUsureUI, true);

    this.currentUI = areUsureUI;

    this.select(this.row, this.col);

  }
  yesImSure(newScene) {

    this.mainScene.player.listPassiveItems.forEach((element) =>{
      element = null;
    });

    this.scene.stop(this.mainScene);
    this.scene.start(newScene);
  }

  /**
   * 
   * UTILS
   */

  selectFromMenu(newRow, newCol) {
    if (this.selectables !== this.currentMenuButtons) {

      this.selectables[this.row][this.col].unselect();

      this.row = newRow;
      this.col = newCol;

      this.selectables = this.currentMenuButtons;

    }
    this.passiveItemsActive = false;
    this.activeItemsActive = false;

    this.passiveItemsActive = false;
    this.select(newRow, newCol);
  }

  selectFromPassives(newRow, newCol) {
    if (this.selectables !== this.passiveItemsButtons) {
      this.selectables[this.row][this.col].unselect();

      this.row = newRow;
      this.col = newCol;

      this.selectables = this.passiveItemsButtons;

    }
    this.passiveItemsActive = true;
    this.activeItemsActive = false;

    this.select(newRow, newCol);
  }

  selectFromActives(newRow, newCol) {
    if (this.selectables !== this.activeItemsButtons) {
      this.selectables[this.row][this.col].unselect();

      this.row = newRow;
      this.col = newCol;

      this.selectables = this.activeItemsButtons;

    }
    this.passiveItemsActive = false;
    this.activeItemsActive = true;

    this.select(newRow, newCol);
  }


  playerInteract() { }
}