import Phaser from 'phaser'

import RectangleAndText from './basicUI//rectangleAndText';
import UIutils from './uiutils';

/**
 * Clase que crea la interfaz basica de la tienda de la diosa, añade cada fila, y maneja las compras y cuando estas se pueden ejecutar
 */
export default class CustomeDataUI extends Phaser.GameObjects.Container {
    /**
    * @param {Phaser.Scene} scene Escena a la que pertenece el container
    * @param {number} x Coordenada X del container
    * @param {number} y Coordenada Y del container
    * @param {string} color Color de las texturas
    * @param {Number} npcs Array con los npcs que existen
    */
    constructor(scene, x, y, design, utils, color, menu) {
        super(scene, x, y);

        const maskedUtils = utils;
        const uitils = new UIutils();
        const fontColor = uitils.chooseStyle(color);

        this.originalX = x;
        this.originalY = y;

        this.menu = menu;
        this.design = design;

        this.setVisible(false);

        this.background = new Phaser.GameObjects.Image(scene, 0, 0, "green_customeback");
        this.add(this.background);

        this.currentCostume = new Phaser.GameObjects.Image(scene, -42, -45, "player_" + this.design, 0).setOrigin(0, 1);
        this.currentCostume.setScale(3);
        this.add(this.currentCostume);


        this.currentAttributes = maskedUtils.getPlayerStats(this.design);
        //Prepare number of icons
        let armorNumber = 1;
        if (this.currentAttributes.armor === maskedUtils.armorTypes.high) armorNumber = 4; else
            if (this.currentAttributes.armor === maskedUtils.armorTypes.middle) armorNumber = 3; else
                if (this.currentAttributes.armor === maskedUtils.armorTypes.low) armorNumber = 2;

        let swordNumber = 1;
        if (this.currentAttributes.damage === maskedUtils.swordTypes.high) swordNumber = 4; else
            if (this.currentAttributes.damage === maskedUtils.swordTypes.middle) swordNumber = 3; else
                if (this.currentAttributes.damage === maskedUtils.swordTypes.low) swordNumber = 2;

        let bootsNumber = 1;
        if (this.currentAttributes.maxSpeed === maskedUtils.movementTypes.high) bootsNumber = 4; else
            if (this.currentAttributes.maxSpeed === maskedUtils.movementTypes.middle) bootsNumber = 3; else
                if (this.currentAttributes.maxSpeed === maskedUtils.movementTypes.low) bootsNumber = 2;

        let chestNumber = 1;
        if (this.currentAttributes.itemDamageMultiplier === maskedUtils.itemTypes.high) chestNumber = 4; else
            if (this.currentAttributes.itemDamageMultiplier === maskedUtils.itemTypes.middle) chestNumber = 3; else
                if (this.currentAttributes.itemDamageMultiplier === maskedUtils.itemTypes.low) chestNumber = 2;



        const textX = -55;
        const itemX = -20;

        const xSpan = 15;
        const ySpan = 40;


        //Armor
        const armorCont = new Phaser.GameObjects.Container(scene, 0, 20 + ySpan * 0);

        const armorText = new Phaser.GameObjects.Text(scene, textX, -15, armorNumber, { color: fontColor, fontSize: 25, fontFamily: "monospace" });
        armorCont.add(armorText);

        for (let i = 0; i < armorNumber; i++) {
            let armor = new Phaser.GameObjects.Image(scene, itemX + xSpan * i, 0, "shield", 0);
            armorCont.add(armor);
        }

        this.add(armorCont);
        //Sword
        const swordCont = new Phaser.GameObjects.Container(scene, 0, 20 + ySpan * 1);

        const swordText = new Phaser.GameObjects.Text(scene, textX, -15, swordNumber, { color: fontColor, fontSize: 25, fontFamily: "monospace" });
        swordCont.add(swordText);

        for (let i = 0; i < swordNumber; i++) {
            let sword = new Phaser.GameObjects.Image(scene, itemX + xSpan * i, 0, "sword", 0);
            swordCont.add(sword);
        }

        this.add(swordCont);

        //Boots
        const bootsCont = new Phaser.GameObjects.Container(scene, 0, 20 + ySpan * 2);

        const bootsText = new Phaser.GameObjects.Text(scene, textX, -15, bootsNumber, { color: fontColor, fontSize: 25, fontFamily: "monospace" });
        bootsCont.add(bootsText);

        for (let i = 0; i < bootsNumber; i++) {
            let boots = new Phaser.GameObjects.Image(scene, itemX + xSpan * i, 0, "boots", 0);
            bootsCont.add(boots);
        }

        this.add(bootsCont);

        //Chest
        const chestCont = new Phaser.GameObjects.Container(scene, 0, 20 + ySpan * 3);

        const chestText = new Phaser.GameObjects.Text(scene, textX, -15, chestNumber, { color: fontColor, fontSize: 25, fontFamily: "monospace" });
        chestCont.add(chestText);

        for (let i = 0; i < chestNumber; i++) {
            let chest = new Phaser.GameObjects.Image(scene, itemX + xSpan * i, 0, "chests_ss", 1).setScale(2);
            chestCont.add(chest);
        }

        this.add(chestCont);

        this.canMove = true;
        this.exitFromRightFlag = false;
        this.exitFromLeftFlag = false;
    }


    //Introduce the 
    introduceFromRight() {
        if (this.canMove === true) {
            this.canMove = false;

            this.x = this.originalX;
            this.y = this.originalY;

            this.setVisible(true);
            this.setScale(0);

            this.scene.tweens.addCounter({
                from: 0,
                to: 150,
                duration: 600,
                ease: Phaser.Math.Easing.Circular.Out,
                repeat: 0,
                onUpdate: (tween) => {
                    let newX = tween.getValue();
                    this.x = this.originalX + newX;

                    let newSize = (tween.getValue() / 2) / 150;
                    this.setScale(newSize);
                },
                onComplete: () => {
                    this.scene.tweens.addCounter({
                        from: 0,
                        to: 150,
                        duration: 600,
                        ease: Phaser.Math.Easing.Circular.In,
                        repeat: 0,
                        onUpdate: (tween) => {
                            let newX = 150 - tween.getValue();
                            this.x = this.originalX + newX;

                            let newSize = ((tween.getValue() / 2) + 75) / 150;
                            this.setScale(newSize);
                        },
                        onComplete: () => {
                            this.canMove = true;
                            this.checkifneedExit();
                        }
                    })
                },
            })
            return true;
        } else {
            return false;
        }

    }


    introduceFromLeft() {
        if (this.canMove === true) {
            this.canMove = false;

            this.x = this.originalX;
            this.y = this.originalY;

            this.setVisible(true);
            this.setScale(0);

            this.scene.tweens.addCounter({
                from: 0,
                to: 150,
                duration: 600,
                ease: Phaser.Math.Easing.Circular.Out,
                repeat: 0,
                onUpdate: (tween) => {
                    let newX = tween.getValue();
                    this.x = this.originalX - newX;

                    let newSize = (tween.getValue() / 2) / 150;
                    this.setScale(newSize);
                },
                onComplete: () => {
                    this.scene.tweens.addCounter({
                        from: 0,
                        to: 150,
                        duration: 600,
                        ease: Phaser.Math.Easing.Circular.In,
                        repeat: 0,
                        onUpdate: (tween) => {
                            let newX = 150 - tween.getValue();
                            this.x = this.originalX - newX;

                            let newSize = ((tween.getValue() / 2) + 75) / 150;
                            this.setScale(newSize);
                        },
                        onComplete: () => {
                            this.canMove = true;
                            this.checkifneedExit();
                        }
                    })
                },
            })
            return true;
        } else {
            return false;
        }
    }

    checkifneedExit() {
        if (this.exitFromRightFlag === true){
            this.exitFromRightFlag = false;
            this.exitFromRight();
        }
        else if (this.exitFromLeftFlag === true){
            this.exitFromLeftFlag = false; 
            this.exitFromLeft();
        }
    }

    exitFromRightTween() {

        this.canMove = false;

        this.x = this.originalX;
        this.y = this.originalY;

        this.setScale(1);

        this.scene.tweens.addCounter({
            from: 0,
            to: 150,
            duration: 600,
            ease: Phaser.Math.Easing.Circular.Out,
            repeat: 0,
            onUpdate: (tween) => {
                let newX = tween.getValue();
                this.x = this.originalX + newX;

                let newSize = (150 - tween.getValue() / 2) / 150;
                this.setScale(newSize);
            },
            onComplete: () => {
                this.scene.tweens.addCounter({
                    from: 0,
                    to: 150,
                    duration: 600,
                    ease: Phaser.Math.Easing.Circular.In,
                    repeat: 0,
                    onUpdate: (tween) => {
                        let newX = 150 - tween.getValue();
                        this.x = this.originalX + newX;

                        let newSize = (75 - tween.getValue() / 2) / 150;
                        this.setScale(newSize);
                    },
                    onComplete: () => {
                        this.canMove = true;
                        this.setVisible(false)
                    },
                })
            },
        })

    }
    exitFromRight() {
        if (this.canMove === true)
            this.exitFromRightTween();
        else {
            this.exitFromRightFlag = true;
        }
    }

    exitFromLeftTween() {
        if (this.canMove === true) {
            this.canMove = false;

            this.x = this.originalX;
            this.y = this.originalY;

            this.setScale(1);

            this.scene.tweens.addCounter({
                from: 0,
                to: 150,
                duration: 600,
                ease: Phaser.Math.Easing.Circular.Out,
                repeat: 0,
                onUpdate: (tween) => {
                    let newX = tween.getValue();
                    this.x = this.originalX - newX;

                    let newSize = (150 - tween.getValue() / 2) / 150;
                    this.setScale(newSize);
                },
                onComplete: () => {
                    this.scene.tweens.addCounter({
                        from: 0,
                        to: 150,
                        duration: 600,
                        ease: Phaser.Math.Easing.Circular.In,
                        repeat: 0,
                        onUpdate: (tween) => {
                            let newX = 150 - tween.getValue();
                            this.x = this.originalX - newX;

                            let newSize = (75 - tween.getValue() / 2) / 150;
                            this.setScale(newSize);
                        },
                        onComplete: () => {
                            this.canMove = true;
                            this.setVisible(false)
                        },
                    })
                },
            })
            return true;
        } else {
            return false;
        }
    }
    exitFromLeft() {
        if (this.canMove === true)
            this.exitFromLeftTween();
        else
            this.exitFromLeftFlag = true;
    }
}
