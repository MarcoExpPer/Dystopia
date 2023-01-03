import BigSaveSlotInfo from '../UI/mainmenuUI/bigSaveSlotInfo';
import Button from '../UI/basicUI/button';
import SaveSlotUI from '../UI/mainmenuUI/saveSlotUI';
import UIutils from '../UI/uiutils';
import DummyDungeon from '../UI/mainmenuUI/dummyDungeon';
import GameState from '../gameState';
import TittleUI from '../UI/mainmenuUI/tittleUI';
import KeyboardInput from './keyboardInput';

import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles';
/**
 * Menu principal del juego
 */
export default class Mainmenu extends KeyboardInput {

    /**
     * @param config Scene specific configuration settings.
     */
    constructor(config) {
        super("mainmenu");
    }

    create() {
        super.create();
        //BASIC PARAMETERS
        this.xRef = this.cameras.main.width / 2;
        this.yRef = this.cameras.main.height / 2 + 150;

        this.UIutils = new UIutils();
        this.color = "green"
        this.fontcolor = this.UIutils.chooseStyle(this.color);
        this.type = "large";
        this.konamiCode = new Array();

        //FLOW PARAMETERS
        this.state; //State of the menu to know where to return when pressing return and how to use the input

        //SAVESLOTS PARAMETERS
        this.gameState = new GameState();

        //CREATE UI 
        this.background = new DummyDungeon(this, 0, 0);

        //Title
        this.tittleScreen;
        this.createTittleUI();

        //SaveSlots
        this.slotUI;    //Array with all saveslotUI of the little long rectangles
        this.slotBIGui; //Array with all the big boxes with more info about the save slot 

        this.createSaveSlotUI();

        //BackButton
        this.backButton;
        this.buttonMoveTween;
        this.buttonAnimationDuration = 1;

        this.createBackButtonUI();

        this.moveTitleIn();
    }
    preload(){
        this.load.scenePlugin('AnimatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
    }

    /**
     * TITLE FUNCTIONS
     */

    createTittleUI() {
        this.tittleScreen = new TittleUI(this, this.xRef, this.yRef + 200, this.color);
        this.setActivable(this.tittleScreen, false);

        this.add.existing(this.tittleScreen);
    }

    moveTitleIn() {
        this.selectables = new Array();
        this.row = 0;
        this.col = 0;

        this.state = "tittle";

        this.tittleScreen.moveIn();


        this.selectables.push([this.tittleScreen, this.tittleScreen]);
        this.select(0, 0);
    }

    moveTitleOut() {
        this.tittleScreen.moveOut();
        this.moveBackButtonIn();

        this.moveMultiSlotsIn();
    }

    /**
     * SAVE SLOTS FUNCTIONS
     */

    createSaveSlotUI() {
        const slotDataArray = new Array();
        this.slotUI = new Array();

        for (let i = 0; i < 3; i++) {
            const slotData = this.gameState.loadFile(i + 1);
            slotDataArray.push(slotData);

            const slotUI = new SaveSlotUI(this, this.xRef, this.yRef - 300 + 150 * i, slotData, this.color, this.fontcolor);
            this.setActivable(slotUI, false);
            this.slotUI.push(slotUI);

            this.add.existing(slotUI);
        }

        this.createSaveSlotBIGui(slotDataArray);
    }

    createSaveSlotBIGui(slotDataArray) {
        this.slotBIGui = new Array();

        for (let i = 0; i < 3; i++) {
            const slotBIGui = new BigSaveSlotInfo(this, this.xRef, this.yRef - 75, slotDataArray[i], this.color, this.fontcolor, this.gameState);
            this.setActivable(slotBIGui, false);
            this.slotBIGui.push(slotBIGui);

            this.add.existing(slotBIGui);
        }
    }

    startThisGameSlot(slotData) {
        this.gameState.parseFileIntoRegistry(this.registry, slotData);
        this.scene.start('village');
    }

    moveMultiSlotsIn() {
        this.selectables = new Array();
        this.row = 0;
        this.col = 1;

        this.state = "multislot";

        for (let i = 0; i < 3; i++) {
            this.slotUI[i].moveIn(i);
            this.selectables.push([this.backButton, this.slotUI[i]]);
        }

        this.select(this.row, this.col);
    }

    moveMultiSlotsOut() {
        for (let i = 0; i < 3; i++) {
            this.slotUI[i].moveOut(i);
        }
    }
    //Focus the UI and info shown in the slot
    makeFocus(slot) {
        slot -= 1;
        
        this.state = "focus" + slot;

        for (let i = 0; i < 3; i++) {
            if (i === slot) {
                this.slotUI[i].makeFocus(i);
                this.slotBIGui[i].moveIn(i);

            } else
                this.slotUI[i].moveOut(i);
        }
    }

    selectAllMultiSlots() {
        this.selectables = new Array();
        this.row = 0;
        this.col = 1;

        this.selectables.push([this.backButton,this.slotUI[0]]);
        this.selectables.push([this.backButton,this.slotUI[1]]);
        this.selectables.push([this.backButton,this.slotUI[2]]);

        this.select(this.row, this.col);
    }

    //Activate the debug Slot that loads a new file that cant be saved
    startDebugSlot() {

        let file = this.gameState.newFile(3);
        this.gameState.parseFileIntoRegistry(this.registry, file);
        this.scene.start('village');

    }

    /**
     * BACK BUTTON UI
     */

    createBackButtonUI() {
        this.buttonMoveTween = null;

        this.backButton = new Button(this, this.xRef - 335, 440, this.color, "left", 0.9, "", this.backActionHandler.bind(this), this.select.bind(this, 0, 0));
        this.setActivable(this.backButton, false);

        this.add.existing(this.backButton);
    }

    backActionHandler() {
        this.backButton.unselect();

        switch (this.state) {
            case "tittle":
                break;  //No es visible ni usable en el titulo

            case "multislot": //Volvemos al titulo
                this.moveBackButtonOut();
                this.moveMultiSlotsOut();
                this.moveTitleIn()
                break;

            case "focus0":
                this.state = "multislot";

                this.slotUI[0].unmakeFocus(0);
                this.slotBIGui[0].moveOut(0);
                this.slotUI[1].moveIn(1);
                this.slotUI[2].moveIn(2);


                this.selectAllMultiSlots();

                break;
            case "focus1":
                this.state = "multislot";

                this.slotUI[1].unmakeFocus(1);
                this.slotBIGui[1].moveOut(1);
                this.slotUI[2].moveIn(2);
                this.slotUI[0].moveIn(0);

                this.selectAllMultiSlots();

                break;
            case "focus2":
                this.state = "multislot";

                this.slotUI[2].unmakeFocus(2);
                this.slotBIGui[2].moveOut(2);
                this.slotUI[0].moveIn(0);
                this.slotUI[1].moveIn(1);

                this.selectAllMultiSlots();
                break;
            case "options1":
                this.state = "focus0";
                this.slotBIGui[0].returnFromOptions();

                break;
            case "options2":
                this.state = "focus1";
                this.slotBIGui[1].returnFromOptions();

                break;
            case "options3":
                this.state = "focus2";
                this.slotBIGui[2].returnFromOptions();

                break;
        }
    }

    moveBackButtonIn() {
        if (this.buttonMoveTween !== null) this.buttonMoveTween.remove()

        this.backButton.x = this.xRef - 335 - 200;
        this.buttonMoveTween = this.tweens.addCounter({
            from: 200,
            to: 0,
            duration: this.buttonAnimationDuration * 1000,
            ease: Phaser.Math.Easing.Bounce.Out,
            repeat: 0,
            onUpdate: (tween) => {
                let newX = tween.getValue();
                this.backButton.x = this.xRef - 335 - newX;
            }
        });
        this.setActivable(this.backButton, true);

    }

    moveBackButtonOut() {
        if (this.buttonMoveTween !== null) this.buttonMoveTween.remove()

        this.backButton.x = this.xRef - 335;
        this.buttonMoveTween = this.tweens.addCounter({
            from: 0,
            to: 200,
            duration: this.buttonAnimationDuration * 1000,
            ease: Phaser.Math.Easing.Bounce.In,
            repeat: 0,
            onUpdate: (tween) => {
                let newX = tween.getValue();
                this.backButton.x = this.xRef - 335 - newX;
            },
            onComplete: () => this.setActivable(this.backButton, false)
        });
    }

    /**
     * UTILS
     */

    //Starts a game with a lot of souls to buy w/e u want
    codigoKonami(id) {
        this.konamiCode.push(id);
        if (this.konamiCode.length === 12)
            this.konamiCode.shift();

        if (this.konamiCode[0] === 0 && this.konamiCode[1] === 0 &&
            this.konamiCode[2] === 1 && this.konamiCode[3] === 1 &&
            this.konamiCode[4] === 3 && this.konamiCode[5] === 2 &&
            this.konamiCode[6] === 3 && this.konamiCode[7] === 2 &&
            this.konamiCode[8] === 5 && this.konamiCode[9] === 4 && this.konamiCode[10] === 6) {

            let file = this.gameState.newFile(4);
            file.souls = 1234;
            this.gameState.parseFileIntoRegistry(this.registry, file);

            this.scene.start('village');
        }
    }

    update(t, dt) {
        super.update(t, dt);

        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey("UP"))) {
            this.codigoKonami(0);
        } else if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey("DOWN"))) {
            this.codigoKonami(1);
        } else if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey("RIGHT"))) {
            this.codigoKonami(2);
        } else if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey("LEFT"))) {
            this.codigoKonami(3);
        } else if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey("A"))) {
            this.codigoKonami(4);
        } else if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey("B"))) {
            this.codigoKonami(5);
        } else if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey("ENTER"))) {
            this.codigoKonami(6);
        }

        this.background.update(t, dt);
    }

    togglePause(){}
}
