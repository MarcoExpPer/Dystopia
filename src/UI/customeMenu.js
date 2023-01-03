import Phaser from 'phaser'
import Button from './basicUI/button';

import RectangleAndText from './basicUI//rectangleAndText';
import CustomeDataUI from './customeDataUI';
import MaskedLevelingData from '../entities/npcs/maskedLevelingData';

/**
 * Clase que crea la interfaz basica de la tienda de la diosa, añade cada fila, y maneja las compras y cuando estas se pueden ejecutar
 */
export default class CustomeMenu extends Phaser.GameObjects.Container {
    /**
    * @param {Phaser.Scene} scene Escena a la que pertenece el container
    * @param {number} x Coordenada X del container
    * @param {number} y Coordenada Y del container
    * @param {string} color Color de las texturas
    * @param {Number} npcs Array con los npcs que existen
    */
    constructor(scene, x, y, color) {
        super(scene, x, y);

        this.maskedUtils = new MaskedLevelingData();
        this.currentDesign = this.scene.registry.values.playerType;

        const designs = new Array()

        for (let i = 0; i <= this.scene.registry.values.maskedLvl; i++) {
            const id = this.maskedUtils.getPlayerTypeLevel(i);
            designs.push(id);
        }

        designs.sort((a, b) => a - b);
        this.activeIndex = designs.indexOf(this.currentDesign);

        //THIS MAIN UI
        this.background = new Phaser.GameObjects.Image(scene, 0, 0, color + "_customeshop");
        this.add(this.background);

        //Titulo situado arriba en el centro de la imagen
        this.title = new RectangleAndText(scene, 0, -215, color, "large", 1, "Trajes", 40);
        this.add(this.title);

        this.availableDesigns = new Array();

        for (let i = 0; i < designs.length; i++) {
            this.availableDesigns.push(new CustomeDataUI(scene, 0, 0, designs[i], this.maskedUtils, color, this));
            this.add(this.availableDesigns[i]);
        }
        this.availableDesigns[this.activeIndex].setVisible(true);

        this.right = new Button(scene, 200, 0, color, "right", 0.8, "", this.goRight.bind(this), this.scene.select.bind(this.scene, 0, 2));
        this.add(this.right);
        this.left = new Button(scene, -200, 0, color, "left", 0.8, "", this.goLeft.bind(this), this.scene.select.bind(this.scene, 0, 0));
        this.add(this.left);

        this.info = new Button(scene, 0, -20, color, "question", 0.8, "", this.toggleInfo.bind(this), this.scene.select.bind(this.scene, 0, 1));
        this.add(this.info);

        this.accept = new Button(scene, 75, 210, color, "tick", 0.8, "", this.acceptChanges.bind(this), this.scene.select.bind(this.scene, 1, 1));
        this.add(this.accept);
        this.exit = new Button(scene, -75, 210, color, "x", 0.8, "", this.closeMenu.bind(this), this.scene.select.bind(this.scene, 1, 0));
        this.add(this.exit);

        this.scene.selectables = [
            [this.left, this.info, this.right],
            [this.exit, this.accept],
        ];

        this.infoActive = false;
        this.createTooltips();
    }

    goRight() {
        let newIndex = this.activeIndex;

        newIndex++;
        if (newIndex === this.availableDesigns.length)
            newIndex = 0;

        if (this.availableDesigns[newIndex].introduceFromLeft() === true) {

            this.hideInfo();
            this.availableDesigns[this.activeIndex].exitFromRight();
            this.activeIndex = newIndex;

            this.currentDesign = this.availableDesigns[this.activeIndex].design;
            this.bringToTop(this.availableDesigns[this.activeIndex]);
            this.bringToTop(this.info);
        }
    }

    goLeft() {
        let newIndex = this.activeIndex;

        newIndex--;
        if (newIndex === -1)
            newIndex = this.availableDesigns.length - 1;

        if (this.availableDesigns[newIndex].introduceFromRight() === true) {

            this.hideInfo();
            this.availableDesigns[this.activeIndex].exitFromLeft();
            this.activeIndex = newIndex;

            this.currentDesign = this.availableDesigns[this.activeIndex].design;
            this.bringToTop(this.availableDesigns[this.activeIndex]);
            this.bringToTop(this.info);
        }
    }
    toggleInfo() {
        this.infoActive = !this.infoActive;

        for (let i of this.tooltipArray) {
            i.setVisible(this.infoActive);
            this.bringToTop(i);
        }
    }

    hideInfo() {
        if (this.infoActive === true) {
            this.infoActive = false;
            for (let i of this.tooltipArray) {
                i.setVisible(false);
            }
        }
    }

    showInfo() {
        if (this.infoActive === false) {
            this.infoActive = true;
            for (let i of this.tooltipArray) {
                i.setVisible(false);
                this.bringToTop(i);
            }
        }
    }


    createTooltips() {
        this.tooltipArray = new Array();

        const yRef = 20;
        const ySpan = 40;

        const armortooltip = new RectangleAndText(this.scene, 0, yRef + ySpan * 0, "green", "tooltipmegalarge", 0.8, "  Reduce el daño recibido").setVisible(false);
        armortooltip.text.setColor("WHITE");

        this.add(armortooltip);
        this.tooltipArray.push(armortooltip)

        const swordtooltip = new RectangleAndText(this.scene, 0, yRef + ySpan * 1, "green", "tooltipmegalarge", 0.8, "  Daño con la Espada").setVisible(false);
        swordtooltip.text.setColor("WHITE");

        this.add(swordtooltip);
        this.tooltipArray.push(swordtooltip)

        const bootstooltip = new RectangleAndText(this.scene, 0, yRef + ySpan * 2, "green", "tooltipmegalarge", 0.8, "  Velocidad de movimiento").setVisible(false);
        bootstooltip.text.setColor("WHITE");

        this.add(bootstooltip);
        this.tooltipArray.push(bootstooltip)

        const chesttooltip = new RectangleAndText(this.scene, 0, yRef + ySpan * 3, "green", "tooltipmegalarge", 0.8, "  Daño con Activos").setVisible(false);
        chesttooltip.text.setColor("WHITE");

        this.add(chesttooltip);
        this.tooltipArray.push(chesttooltip)
    }

    acceptChanges() {
        this.scene.mainScene.changePlayerType(this.currentDesign, this.maskedUtils.getPlayerStats(this.currentDesign));
        this.closeMenu();
    }

    closeMenu() {
        this.scene.onEnd();
        this.destroy();
    }
}