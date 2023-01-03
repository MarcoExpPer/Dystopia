import Phaser from 'phaser'
import RectangleAndText from '../UI/basicUI/rectangleAndText';

/**
 * Clase que maneja la UI que muestra cuantas pociones tiene el jugador
 */
export default class PotionsTrackerManager extends Phaser.GameObjects.Container {

    /**
     * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     */
    constructor(scene, player, x, y) {
        super(scene, x, y);

        this.player = player;
        this.hasPotions = false;


        if (this.player.attributes.potions.max !== 0) {
            this.hasPotions = true;
            this.createPotionsUI();
        }

        this.tooltip = new RectangleAndText(scene, 180, 45, "green", "tooltipmegalarge", 0.9, "  Accion para curarte " + (player.attributes.potions.potency) / 4 + " corazones").setVisible(false);
        this.tooltip.text.setColor("WHITE");

        if (player.attributes.potions.max > 0) {
            this.setSize(64 * player.attributes.potions.max, 32);
            this.setInteractive();
        }

        this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
            this.select();
        })
        this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
            this.unselect();
        })
        this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.execute.bind(this), this);
        this.add(this.tooltip);

    }

    select() {

        if (this.hasPotions === true){

            this.scene.selectables[this.scene.row][this.scene.col].unselect();

            this.tooltip.setVisible(true);
            this.scene.potionsUI.setDepth(20);
            
            this.scene.row = 0;
            this.scene.col = this.scene.col;

        }else{
            this.scene.select(1, this.scene.col);
        }
    }

    unselect() {
        if (this.hasPotions)
            this.tooltip.setVisible(false);
    }

    execute() {
        if (this.hasPotions)
            this.usePotion();
    }
    createPotionsUI() {
        this.potions = new Array();

        let xRef = 0;
        const xSpan = 32;

        for (let i = 0; i < this.player.attributes.potions.max; i++) {

            let potion = null;
            if (i >= this.player.attributes.potions.number)
                potion = new Phaser.GameObjects.Image(this.scene, 0 + xRef, 0, "potions_ss", (this.getPotionFramePotency(this.player.attributes.potions.potency) - 40));
            else
                potion = new Phaser.GameObjects.Image(this.scene, 0 + xRef, 0, "potions_ss", this.getPotionFramePotency(this.player.attributes.potions.potency));

            potion.setScale(2);
            xRef += xSpan;
            this.potions.push(potion);

            this.add(potion);
        }

    }

    usePotion() {
        this.player.usePotion();

        this.potions.forEach(element => {
            element.destroy();
        })

        this.createPotionsUI();
    }

    //Returns the potion frame potency that lvl parameter gives
    getPotionFramePotency(potency) {
        switch (potency) {
            case 0:
                return 0;
            case 8:
                return 40;
            case 9:
                return 41;
            case 10:
                return 45
            case 11:
                return 42;
            case 12:
                return 43;
            case 13:
                return 48;
            case 14:
                return 49;
        }
    }

}
