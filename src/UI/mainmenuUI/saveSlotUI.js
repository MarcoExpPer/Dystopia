import Phaser, { GameObjects } from 'phaser'
import DruidLevelingData from '../../entities/npcs/druidLevelingData';
import Button from '../basicUI/button';
import UIutils from '../uiutils';

/*
Esta clase representa los rectangulos finos que muestran una informacion general del saveData que recibe como parametro.
En el caso de ser el Tercer slot, se ignora todo y se crea el slot listo para debug de una partida inicial
*/

export default class SaveSlotUI extends Phaser.GameObjects.Container {


    constructor(scene, x, y, saveData, color, fontColor) {
        super(scene, x, y);
        this.saveData = saveData;

        this.yOriginal = y;

        //ANIMATION PARAMETERS
        this.alphaIncreasing = true;
        this.changeAlpha = null;

        this.moveSlotDuration = 1; //in seconds
        this.moveSlotTween = null;

        //BACKGROUND

        //NORMAL SAVE SLOT  onstructor(scene, x, y, color, type, scale, text, onClick, onHoverFunc = null, fontSize = 100) 
        this.background = new Button(this.scene, 0, 0, color, "saveslot", 1, "", this.execute.bind(this), this.scene.select.bind(this.scene, this.saveData.saveslot - 1, 1));
        this.add(this.background);

        const name = this.saveData.savename;
        const saveFileName = new Phaser.GameObjects.Text(this.scene, -270, -42, name,
            { color: fontColor, align: "center", fontFamily: "monospace", fontSize: 20, fontStyle: "bold" }).setOrigin(0, 0.5);
        this.add(saveFileName);

        this.createHearths();
        this.createPotions();
        this.createSouls(fontColor);
        this.createHeroSprite();


        this.setDepth(2);
    }

    //CREATE UI

    createHearths() {
        for (let i = 0; i < 3 + this.saveData.blacksmithLvl; i++) {
            this.add(new Phaser.GameObjects.Image(this.scene, -255 + 32 * i, -10, "hearths_ss", 4));
        }
    }

    createPotions() {
        const druidHelp = new DruidLevelingData();
        const druidLvl = this.saveData.druidLvl;

        for (let i = 0; i < druidHelp.getPotions(druidLvl); i++) {
            this.add(new Phaser.GameObjects.Image(this.scene, -255 + 32 * i, 25, "potions_ss", druidHelp.getPotionFramePotency(druidLvl)).setScale(2));
        }
    }

    createSouls(fontColor) {
        const xOffset = 240;

        const soulsIcon = new Phaser.GameObjects.Sprite(this.scene, xOffset, 35, "souls_ss", 0)
        this.add(soulsIcon);

        const nSouls = new Phaser.GameObjects.Text(this.scene, xOffset + 20, 38, this.saveData.souls,
            { color: fontColor, align: "center", fontFamily: "monospace", fontSize: 25 }).setOrigin(0, 0.5);
        this.add(nSouls);

    }

    createHeroSprite() {
        const currentCostume = new Phaser.GameObjects.Image(this.scene, 235, 15, "player_" + this.saveData.playerType, 0).setOrigin(0, 1);
        this.add(currentCostume);
    }

    execute() {
        this.scene.makeFocus(this.saveData.saveslot);
    }

    select() {
        this.background.select();
    }

    unselect() {
        this.background.unselect();
    }

    /**
     * 
     * MOVEMENT FUNCTIONS
     * 
     */
    moveIn(slot) {
        slot = slot + 1;
        this.scene.setActivable(this, true);
        
        if (this.moveSlotTween !== null) this.moveSlotTween.remove();

        switch (slot) {
            case 1:
                this.y = this.yOriginal - 200;
                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 200,
                    to: 0,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.Out,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal - newY;
                    },
                })
                break;
            case 2:
                this.y = this.yOriginal + 400;
                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 400,
                    to: 0,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.Out,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal + newY;
                    },
                })
                break;
            case 3:
                this.y = this.yOriginal + 400;
                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 400,
                    to: 0,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.Out,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal + newY;
                    },
                })
                break;
        }
    }

    moveOut(slot) {
        slot = slot + 1;

        if (this.moveSlotTween !== null) this.moveSlotTween.remove();

        this.setActive(false);
        
        switch (slot) {
            case 1:
                this.y = this.yOriginal;
                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 0,
                    to: 200,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal - newY;
                    },
                    onComplete: () => this.scene.setActivable(this, false)
                })
                break;
            case 2:
                this.y = this.yOriginal;
                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 0,
                    to: 400,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal + newY;
                    },
                    onComplete: () => this.scene.setActivable(this, false)
                })
                break;
            case 3:
                this.y = this.yOriginal;
                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 0,
                    to: 400,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal + newY;
                    },
                    onComplete: () => this.scene.setActivable(this, false)
                })
                break;
        }
    }

    makeFocus(slot) {
        slot = slot + 1;
        this.background.disableInteractive();
        this.y = this.yOriginal;

        if (this.moveSlotTween !== null) this.moveSlotTween.remove();

        switch (slot) {
            case 1:
                //Ya esta en la posicion de focus
                break;
            case 2:
                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 0,
                    to: 150,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal - newY;
                    },
                })
                break;
            case 3:
                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 0,
                    to: 300,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal - newY;
                    },
                })
                break;
        }
    }

    unmakeFocus(slot) {
        slot = slot + 1;
        this.background.setInteractive();

        if (this.moveSlotTween !== null) this.moveSlotTween.remove();

        switch (slot) {
            case 1:
                //Ya esta en la posicion de focus
                break;
            case 2:
                this.y = this.yOriginal - 150;
                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 0,
                    to: 150,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal - 150 + newY;
                    },
                })
                break;
            case 3:
                this.y = this.yOriginal - 300;
                this.moveSlotTween = this.scene.tweens.addCounter({
                    from: 0,
                    to: 300,
                    duration: this.moveSlotDuration * 1000,
                    ease: Phaser.Math.Easing.Expo.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newY = tween.getValue();
                        this.y = this.yOriginal - 300 + newY;
                    },
                })
                break;
        }
    }
}