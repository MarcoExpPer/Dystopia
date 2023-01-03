import Phaser from 'phaser'
import Button from '../../basicUI/button';
import RectangleAndText from '../../basicUI/rectangleAndText';

/**
 * Clase que dibuja la parte derecha de una fila de la tienda de la diosa, en concreto la del blackmisth npc
 */
export default class DruidRow extends Phaser.GameObjects.Container {

    /**
     * @param {Phaser.Scene} scene Escena a la que pertenece el container
     * @param {number} x Coordenada X del container
     * @param {number} y Coordenada Y del container
     * @param {string} color Color del tema que se va a usar
     * @param {string} fontColor Color de la default font
     * @param {GodShop} godshop GodShop reference
     */
    constructor(scene, x, y, color, godshop, i) {
        super(scene, x, y);

        this.godshop = godshop;
        this.druid = this.godshop.npcs.find((element) => element.getName() === "druida");

        this.fontColor = godshop.getBaseColor();
        this.updatedFontColor = godshop.getUpdateColor();
        this.fullFontColor = godshop.getFullColor();

        this.currentLevel = JSON.parse(JSON.stringify(this.scene.registry.values.druidLvl));

        //Draw a resume of what powers is this NPC currently giving.
        this.currentPots = new Phaser.GameObjects.Text(scene, 0, -5, "+" + this.druid.getPotions(this.currentLevel),
            { color: this.fontColor, align: "left", fontFamily: "monospace", fontSize: 30 });
        this.add(this.currentPots);
        
        this.image = new Phaser.GameObjects.Image(scene, 55, 10, "potions_ss", this.druid.getPotionFramePotency(this.currentLevel));
        this.image.setScale(2);
        this.add(this.image);

        this.separation = new Phaser.GameObjects.Text(scene, 80, -5, "/",
            { color: this.fontColor, align: "left", fontFamily: "monospace", fontSize: 30 });
        this.add(this.separation);

        this.currentPowers = new Phaser.GameObjects.Text(scene, 100, -5, "+" + this.druid.getPotionPotency(this.currentLevel)/4,
            { color: this.fontColor, align: "left", fontFamily: "monospace", fontSize: 30 });
        this.add(this.currentPowers);
        this.hearth = new Phaser.GameObjects.Image(scene, 200, 10, "hearths_ss", 4);
        this.add(this.hearth);

        this.setHearthPosition();

        //Show current cost of the next upgrade
        this.cost = new RectangleAndText(scene, 260 + 90, 10, color, "small", 0.9, (this.currentLevel + 1) * 2);
        this.cost.text.setOrigin(0, 0.5);
        this.cost.text.setX(this.cost.text.x - 50);
        this.add(this.cost);

        this.coin = new Phaser.GameObjects.Image(scene, this.cost.x + 25, 9, "souls_ss", 0);
        this.add(this.coin);

        this.checkIfFull();
    }

    //return the name shown in the left part of the row
    getName() {
        return "Druida";
    }
    //return the frame shown in the left part
    getImage() {
        return "npc_3_profile";
    }
    //return the description in the tooltip
    getDesc() {
        return "   Pociones que curan vida";
    }
    getToolTipSize() {
        return 17;
    }

    //Check if the buy can be executed, update values, and change all text to updatedFontColor to represent the value changed
    buy() {
        if (this.godshop.buy("druidLvl", this.currentLevel + 1, (this.currentLevel + 1) * 2, 10) == true) {
            this.currentLevel += 1;

            if (this.checkIfFull() === false) {

                this.currentPots.text = "+" + this.druid.getPotions(this.currentLevel);
                this.currentPots.setColor(this.updatedFontColor);

                this.image.setTexture("potions_ss", this.druid.getPotionFramePotency(this.currentLevel));

                this.currentPowers.text = "+" + this.druid.getPotionPotency(this.currentLevel)/4;
                this.currentPowers.setColor(this.updatedFontColor);

                this.cost.text.text = (this.currentLevel + 1) * 2;
                this.cost.text.setColor(this.updatedFontColor);
            }
            this.setHearthPosition();
        }
    }

    //Reset all colors and values to the initial/default value
    reset() {
        this.currentLevel = JSON.parse(JSON.stringify(this.scene.registry.values.druidLvl));

        if (this.checkIfFull() === false) {
            this.currentPots.text = "+" + this.druid.getPotions(this.currentLevel);
            this.currentPots.setColor(this.fontColor);

            this.image.setTexture("potions_ss", this.druid.getPotionFramePotency(this.currentLevel));

            this.currentPowers.text = "+" + this.druid.getPotionPotency(this.currentLevel)/4;
            this.currentPowers.setColor(this.fontColor);

            this.cost.text.text = (this.currentLevel + 1) * 2;
            this.cost.text.setColor(this.fontColor);
        }

        this.setHearthPosition();
    }


    checkIfFull() {
        if (this.currentLevel === 9) {
            this.currentPots.text = "+" + this.druid.getPotions(this.currentLevel);
            this.currentPots.setColor(this.fullFontColor);

            this.image.setTexture("potions_ss", this.druid.getPotionFramePotency(this.currentLevel));

            this.currentPowers.text = "+" + this.druid.getPotionPotency(this.currentLevel)/4;
            this.currentPowers.setColor(this.fullFontColor);

            this.cost.text.text = "MAX";
            this.cost.text.setColor(this.fullFontColor);

            return true;
        }
        return false;
    }

    setHearthPosition() {
        if (this.druid.getPotionPotency(this.currentLevel) % 4 === 0) {
            this.hearth.setX(150);
        } else
            this.hearth.setX(200);
    }

}