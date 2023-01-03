import Phaser, { GameObjects } from 'phaser'
import OptionsUtils from '../../optionsUtils';
import Button from '../basicUI/button';
import RectangleAndText from '../basicUI/rectangleAndText';

/*
Esta clase representa los rectangulos grandes que muestran una informacion detallada de cada NPC desbloqueado y tambien permite empezar/borrar una partida y cambiar las opciones
*/

export default class BigSaveSlotInfo extends Phaser.GameObjects.Container {


    constructor(scene, x, y, saveData, color, fontcolor, gameState) {
        super(scene, x, y);
        this.saveData = saveData;
        this.color = color;
        this.fontColor = fontcolor;
        this.gameState = gameState;

        this.optionsUtils = new OptionsUtils();

        this.yOriginal = y;

        this.moveSlotDuration = 1;
        this.moveSlotTween = null;

        const background = new Phaser.GameObjects.Image(this.scene, 0, 0, color + "_bigsaveslot", 0);
        this.add(background);

        this.createInfoUI();
        this.createOptionsUI();

        if (!saveData.isnewgame)
            this.createDeleteUI();
    }

    /**
     * INFO LAYER
     */
    createInfoUI() {
        this.infoUI = new Phaser.GameObjects.Container(this.scene, 0, 0);

        const xRef = 200;
        const yRef = -50;
        const ySpan = 50;

        if (!this.saveData.isnewgame) {

            let xRefnpc = -250;
            let yRefnpc = -100;
            const ySpannpc = 50;

            //ALL NPC DATA
            if (this.saveData.blacksmithLvl !== 0) {
                this.addNPC(xRefnpc, yRefnpc, this.saveData.blacksmithLvl, "npc_1_profile");
                yRefnpc += ySpannpc;
            }
            if (this.saveData.druidLvl !== 0) {
                this.addNPC(xRefnpc, yRefnpc, this.saveData.druidLvl, "npc_3_profile");
                yRefnpc += ySpannpc;
            }
            if (this.saveData.maskedLvl !== 0) {
                this.addNPC(xRefnpc, yRefnpc, this.saveData.maskedLvl, "npc_2_profile");
                yRefnpc += ySpannpc;
            }

            this.startButton = new Button(this.scene, xRef, yRef + ySpan * 0, this.color, "small", 0.9, "Continuar", this.start.bind(this), this.scene.select.bind(this.scene, 0, 1), 24);
            this.infoUI.add(this.startButton);

            this.optionsButton = new Button(this.scene, xRef, yRef + ySpan * 1, this.color, "small", 0.9, "Opciones", this.goToOptions.bind(this), this.scene.select.bind(this.scene, 1, 1), 25);
            this.infoUI.add(this.optionsButton);

            this.deleteButton = new Button(this.scene, xRef, yRef + ySpan * 3, this.color, "small", 0.9, "Borrar", this.activateDeleteUI.bind(this), this.scene.select.bind(this.scene, 2, 1), 27);
            this.infoUI.add(this.deleteButton);


        } else {
            this.startButton = new Button(this.scene, xRef - 200, yRef + ySpan * 0, this.color, "large", 1, "Comenzar", this.start.bind(this), this.scene.select.bind(this.scene, 0, 1), 35);
            this.infoUI.add(this.startButton);

            this.optionsButton = new Button(this.scene, xRef - 200, yRef + ySpan * 1.5, this.color, "small", 0.9, "Opciones", this.goToOptions.bind(this), this.scene.select.bind(this.scene, 1, 1), 27);
            this.infoUI.add(this.optionsButton);
        }

        this.add(this.infoUI);
    }

    addNPC(xRef, yRef, level, npcImage) {
        const profile = new Phaser.GameObjects.Image(this.scene, xRef, yRef, npcImage, 0).setScale(0.7);
        this.infoUI.add(profile);

        const lvltext = new Phaser.GameObjects.Text(this.scene, xRef + 30, yRef - 10, level, { color: this.fontColor, align: "center", fontFamily: "monospace", fontSize: 20 })
        this.infoUI.add(lvltext);
    }


    //Show or hide the saveslot info
    activateInfo() {
        this.scene.selectables = new Array();

        this.scene.row = 0;
        this.scene.col = 1;
        
        this.scene.setActivable(this.infoUI, true);
        this.scene.setActivable(this.optionsUI, false);

        if (!this.saveData.isnewgame) {
            this.hideDelete();

            this.scene.selectables = [
                [this.scene.backButton, this.startButton],
                [this.scene.backButton, this.optionsButton],
                [this.scene.backButton, this.deleteButton]
            ];
        } else {
            this.scene.selectables = [
                [this.scene.backButton, this.startButton],
                [this.scene.backButton, this.optionsButton]
            ];
        }


        this.scene.select(this.scene.row, this.scene.col);

    }

    start() {
        this.saveData.isnewgame = false;
        this.saveData.savename = "Partida " + this.saveData.saveslot;

        this.scene.startThisGameSlot(this.saveData);
    }

    /**
     * OPTIONS LAYER
     */

    //Hide all info layer info and show all options
    createOptionsUI() {
        this.optionsUI = new Phaser.GameObjects.Container(this.scene, 0, 0);

        const xRef = -270;
        const yRef = -120;
        const ySpan = 50;

        //SOUND
        this.type = "medium";
        this.optionsUI.add(new Phaser.GameObjects.Text(this.scene, xRef, yRef, "Volumen").setOrigin(0).setColor(this.fontColor).setFontSize(20));

        this.rightVolume = new Button(this.scene, xRef + 200, yRef + 8, this.color, "right", 0.7, "", this.changeVolume.bind(this, 1), this.scene.select.bind(this.scene, 0, 2));
        this.optionsUI.add(this.rightVolume);

        this.leftVolume = new Button(this.scene, xRef + 120, yRef + 8, this.color, "left", 0.7, "", this.changeVolume.bind(this, -1), this.scene.select.bind(this.scene, 0, 1));
        this.optionsUI.add(this.leftVolume);

        this.volumeText = new Phaser.GameObjects.Text(this.scene, xRef + 160, yRef + 10, this.saveData.sound).setOrigin(0.5).setColor(this.fontColor).setFontSize(20);
        this.optionsUI.add(this.volumeText);

        //Game Settings
        this.optionsUI.add(new Phaser.GameObjects.Text(this.scene, xRef, yRef + ySpan, "Velocidad de Texto").setOrigin(0).setColor(this.fontColor).setFontSize(20));

        this.speedText = new RectangleAndText(this.scene, xRef + 350, yRef + ySpan + 7, this.color, this.type, 0.8, this.optionsUtils.translateTextSpeed(this.saveData.textSpeed));
        this.optionsUI.add(this.speedText);

        this.rightSpeed = new Button(this.scene, xRef + 450, yRef + ySpan + 7, this.color, "right", 0.7, "", this.textSpeedChange.bind(this, true), this.scene.select.bind(this.scene, 1, 2));
        this.optionsUI.add(this.rightSpeed);

        this.leftSpeed = new Button(this.scene, xRef + 250, yRef + ySpan + 7, this.color, "left", 0.7, "", this.textSpeedChange.bind(this, false), this.scene.select.bind(this.scene, 1, 1));
        this.optionsUI.add(this.leftSpeed);

        this.fullScreenText = new Phaser.GameObjects.Text(this.scene, xRef, yRef + ySpan * 2, "Pantalla Completa").setOrigin(0).setColor(this.fontColor).setFontSize(20);
        this.optionsUI.add(this.fullScreenText);

        let texture = "tick";
        if (this.scene.scale.isFullscreen) texture = "x";

        this.fullScreenButton = new Button(this.scene, xRef + 240, yRef + 10 + ySpan * 2, this.color, texture, 0.7, "", this.toogleFullScreen.bind(this), this.scene.select.bind(this.scene, 2, 1));
        this.optionsUI.add(this.fullScreenButton);

        texture = "tick";
        if (this.saveData.chestAnimations === true) texture = "x";

        this.ChestAnimationText = new Phaser.GameObjects.Text(this.scene, xRef, yRef + ySpan * 3, "Animaciones de cofres").setOrigin(0).setColor(this.fontColor).setFontSize(20);
        this.optionsUI.add(this.ChestAnimationText);

        this.ChestAnimationButton = new Button(this.scene, xRef + 290, yRef + 7 + ySpan * 3, this.color, texture, 0.7, "", this.toggleChestAnimation.bind(this), this.scene.select.bind(this.scene, 3, 1));
        this.optionsUI.add(this.ChestAnimationButton);

        this.add(this.optionsUI);
        this.scene.setActivable(this.optionsUI, false);
    }

    activateOptions() {
        this.scene.state = "options" + this.saveData.saveslot;

        this.optionsButton.unselect();

        this.scene.setActivable(this.infoUI, false);
        this.scene.setActivable(this.optionsUI, true);
        if (this.deleteUI !== undefined)
            this.hideDelete();

        this.scene.selectables = [
            [this.scene.backButton, this.leftVolume, this.rightVolume],
            [this.scene.backButton, this.leftSpeed, this.rightSpeed],
            [this.scene.backButton, this.fullScreenButton, this.fullScreenButton],
            [this.scene.backButton, this.ChestAnimationButton, this.ChestAnimationButton],
        ];

        this.scene.row = 0;
        this.scene.col = 1;
        this.scene.select(this.scene.row, this.scene.col);

    }

    //Do an animation to swap to options menu
    goToOptions() {

        this.scene.tweens.addCounter({
            from: 0,
            to: 200,
            duration: 500,
            ease: Phaser.Math.Easing.Expo.In,
            repeat: 0,
            onUpdate: (tween) => {
                let newScale = (200 - tween.getValue()) / 200;
                this.setScale(newScale, 1);
            },
            onComplete: () => {
                this.activateOptions();

                this.scene.tweens.addCounter({
                    from: 0,
                    to: 200,
                    duration: 500,
                    ease: Phaser.Math.Easing.Expo.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newScale = tween.getValue() / 200;
                        this.setScale(newScale, 1);
                    },
                })
            }
        })
    }



    //Hide options layer and return to the information layer while doing an animation
    returnFromOptions() {

        this.scene.tweens.addCounter({
            from: 0,
            to: 200,
            duration: 500,
            ease: Phaser.Math.Easing.Expo.In,
            repeat: 0,
            onUpdate: (tween) => {
                let newScale = (200 - tween.getValue()) / 200;
                this.setScale(newScale, 1);
            },
            onComplete: () => {
                this.activateInfo();

                this.scene.tweens.addCounter({
                    from: 0,
                    to: 200,
                    duration: 500,
                    ease: Phaser.Math.Easing.Expo.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newScale = tween.getValue() / 200;
                        this.setScale(newScale, 1);
                    },
                })
            }
        })
    }

    /**
     * 
     * FUNCTIONS TO CHANGE CURRENT OPTIONS
     * 
     */


    toggleChestAnimation() {
        const newValue = this.optionsUtils.toggleChestAnimation(this.saveData);

        let texture = "tick";
        if (newValue === true) texture = "x";

        this.ChestAnimationButton.background.setTexture(this.color + "_" + texture);
        this.ChestAnimationButton.overImage.setTexture(this.color + "_" + texture + "over");
    }

    changeVolume(newChange) {
        const newValue = this.optionsUtils.changeVolume(this.saveData, newChange);

        this.volumeText.text = newValue;
    }

    textSpeedChange(increase) {
        let newText;
        if (increase)
            newText = this.optionsUtils.textSpeedIncrease(this.saveData)
        else
            newText = this.optionsUtils.textSpeedDecrease(this.saveData)

        this.speedText.changeText(newText);
    }

    toogleFullScreen() {
        const newTexture = this.optionsUtils.toogleFullScreen(this.scene);


        this.fullScreenButton.background.setTexture(this.color + "_" + newTexture);
        this.fullScreenButton.overImage.setTexture(this.color + "_" + newTexture + "over");
    }

    /**
 * DELETE LAYER
 */

    //Make sure that the player wants to delete the savefile
    createDeleteUI() {
        this.deleteUI = new Array();;

        const xRef = this.scene.xRef
        const yRef = this.scene.yRef - 150;

        const blackground = new Phaser.GameObjects.Image(this.scene, xRef, yRef, "blackscreen").setAlpha(0.5);
        this.deleteUI.push(blackground);

        const areusure = new RectangleAndText(this.scene, xRef, yRef, this.color, "large", 1, "¿Borrar Partida?");
        this.deleteUI.push(areusure);

        this.noButton = new Button(this.scene, xRef - 60, yRef + 90, this.color, "x", 0.8, "", this.dontDelete.bind(this));
        this.deleteUI.push(this.noButton);

        this.yesButton = new Button(this.scene, xRef + 60, yRef + 90, this.color, "tick", 0.8, "", this.yesDelete.bind(this));
        this.deleteUI.push(this.yesButton);

        for (let i of this.deleteUI) {
            this.scene.add.existing(i.setDepth(10));
            i.setActive(false);
            i.setVisible(false);
        }
    }

    //Proceed to delete the savefile
    yesDelete() {
        this.gameState.deleteSlot(this.saveData, this.scene);
    }

    //Remove delete options and return to the previous state
    dontDelete() {
        this.scene.state = "focus" + this.saveData.saveslot;
        this.activateInfo();
    }

    activateDeleteUI() {
        this.scene.state = "delete";

        this.deleteButton.unselect();

        this.scene.setActivable(this.infoUI, false);
        this.scene.setActivable(this.optionsUI, false);

        for (let i of this.deleteUI) {
            i.setActive(true);
            i.setVisible(true);
        }

        this.scene.selectables = [
            [this.noButton, this.yesButton],
        ];

        this.scene.row = 0;
        this.scene.col = 0;
        this.scene.select(this.scene.row, this.scene.col);
    }

    hideDelete() {
        for (let i of this.deleteUI) {
            i.setActive(false);
            i.setVisible(false);
        }
    }

    /**
     * 
     * MOVEMENT FUNCTIONS
     * 
     */

    moveIn(slot) {
        slot += 1;

        this.scene.setActivable(this, true)
        this.activateInfo();

        if (this.moveSlotTween !== null) this.moveSlotTween.remove();

        switch (slot) {
            case 1:
                this.y = this.yOriginal - 210;
                this.setScale(1, 0.3);

                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 0,
                    to: 210,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal - 210 + newY;

                        let newScale = (newY / 210) * 0.7 + 0.3
                        this.setScale(1, newScale);
                    }
                })
                break;
            case 2:
                this.y = this.yOriginal - 100;
                this.setScale(1, 0.3);

                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 0,
                    to: 100,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal - 100 + newY;

                        let newScale = (newY / 100) * 0.7 + 0.3
                        this.setScale(1, newScale);
                    }
                })
                break;
            case 3:
                this.y = this.yOriginal + 90;
                this.setScale(1, 0.3);

                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 0,
                    to: 90,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal + 90 - newY;

                        let newScale = (newY / 90) * 0.7 + 0.3
                        this.setScale(1, newScale);
                    }
                })
                break;
        }
    }

    moveOut(slot) {
        slot += 1;

        if (this.moveSlotTween !== null) this.moveSlotTween.remove();

        switch (slot) {
            case 1:
                this.y = this.yOriginal;
                this.setScale(1, 1);

                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 0,
                    to: 210,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal - newY;

                        let newScale = ((210 - newY) / 210) * 0.7 + 0.3
                        this.setScale(1, newScale);
                    },
                    onComplete: () => this.scene.setActivable(this, false)
                })
                break;
            case 2:
                this.y = this.yOriginal;

                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 0,
                    to: 100,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal - newY;

                        let newScale = ((100 - newY) / 100) * 0.7 + 0.3
                        this.setScale(1, newScale);
                    },
                    onComplete: () => this.scene.setActivable(this, false)
                })
                break;
            case 3:
                this.y = this.yOriginal;
                this.setScale(1, 0.3);

                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 0,
                    to: 90,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal + newY;

                        let newScale = ((90 - newY) / 90) * 0.7 + 0.3
                        this.setScale(1, newScale);
                    },
                    onComplete: () => this.scene.setActivable(this, false)
                })
                break;
        }
    }
}