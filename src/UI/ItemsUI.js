import Phaser, { GameObjects } from 'phaser'
import ItemSlot from './basicUI/itemSlot';


/**
 * Clase que representa un boton que cambia su textura cuando se pasa el raton por encima y que tiene un texto en su interior
 * Al clicar el boton se ejecuta la funcion que se pasa como parametro
 */
export default class ItemsUI extends Phaser.GameObjects.Container {

  /**
    * @param {Phaser.Scene} scene Escena a la que pertenece el container
    * @param {number} x Coordenada X del container
    * @param {number} y Coordenada Y del container
    * @param {string} color Color del tema que se va a usar
    * @param {string} type Tipo de la textura que se va a usar ("large", "medium", "small", "square")
    * @param {Number} scale Tamaño de la textura que se va a usar
    * @param {string} text Texto que se muestra en el interior del boton
    * @param {number} fontSize Tamaño de la font del texto, si no se pasa, el tamaño se fijara automaticamente para entrar en la caja
    * @param {function} onClick Funcion que se ejecuta cuando se clica el boton
    * @param {wildcard} onClickthis Referencia con la que se ejecutara onClick
    */
  constructor(scene, x, y, player, color, fontColor) {
    super(scene, x, y);

    this.color = color;
    this.fontColor = fontColor;
    this.player = player;

    const activeItemsList = player.listActiveItems;
    const passiveItemList = player.listPassiveItems;

    this.createPassiveItemsUI(passiveItemList);
    this.createActiveItemsUI(activeItemsList);

  }

  createActiveItemsUI(activeItemsList) {
    let yRef = 0;
    let xRef = 0;
    let xspan = 50;
    let yspan = 50;
    let counter = 0;
    let maxWidth = 4;

    //ACTIVE ITEMS
    const activeitemsCont = new Phaser.GameObjects.Container(this.scene, 0, 0);

    const text = new Phaser.GameObjects.Text(this.scene, xRef + 70, 20, "Activos",
      { color: this.fontColor, align: "center", fontFamily: "monospace" }).setOrigin(0.5, 0.5).setFontSize(25);
    activeitemsCont.add(text);

    const background = new Phaser.GameObjects.Image(this.scene, xRef + 70, yRef + 80, this.color + "_large").setScale(0.8, 0.8);
    activeitemsCont.add(background);

    this.activeItemsButtons = new Array();

    if (activeItemsList.length > 0)
      activeItemsList.forEach(element => {
        const slot = new ItemSlot(this.scene, xRef - 5 + xspan * counter, yRef + 80, element.texture, element.frame, this.changeActiveItem.bind(this, element.label), this.scene.selectFromActives.bind(this.scene, 1, counter));

        this.activeItemsButtons.push(slot);
        activeitemsCont.add(slot);

        if (counter === maxWidth) {
          counter = 0;
          yRef += yspan;
        } else {
          counter++;
        }


      });

    if (activeItemsList.length > 0)
      this.add(activeitemsCont);
  }

  createPassiveItemsUI(passiveItemList) {
    let yRef = 0;
    let xRef = -525;
    let xspan = 50;
    let yspan = 50;
    let counter = 0;
    let maxWidth = 4;

    //PASSIVE ITEMS
    const passiveitemsCont = new Phaser.GameObjects.Container(this.scene, 0, 0);

    const text = new Phaser.GameObjects.Text(this.scene, xRef + 70, 20, "Pasivos",
      { color: this.fontColor, align: "center", fontFamily: "monospace" }).setOrigin(0.5, 0.5).setFontSize(25);
    passiveitemsCont.add(text);

    const background = new Phaser.GameObjects.Image(this.scene, xRef + 70, yRef + 80, this.color + "_large").setScale(0.8, 0.8);
    passiveitemsCont.add(background);

    this.passiveItemsButtons = new Array();

    if (passiveItemList.length > 0)
      passiveItemList.forEach(element => {
        const slot = new ItemSlot(this.scene, xRef - 5 + xspan * counter, yRef + 80, element.texture, element.frame, this.scene.selectFromPassives.bind(this.scene, 1, counter), this.scene.selectFromPassives.bind(this.scene, 1, counter));

        this.passiveItemsButtons.push(slot);
        passiveitemsCont.add(slot);

      
        if (counter === maxWidth) {
          counter = 0;
          yRef += yspan;
        } else {
          counter++;
        }

      });

    if (passiveItemList.length > 0)
      this.add(passiveitemsCont);

  }

  getPassiveItemsButtons(){
    return this.passiveItemsButtons;
  }

  getActiveItemsButtons(){
    return this.activeItemsButtons;
  }

  changeActiveItem(label) {
    if (this.player.itemManager.cooldownEffect.visible === true) {
      console.log("Cant change items");
    } else
      this.player.equipItem(label);
  }

  changeInteractuable(activate){
    for(let i of this.passiveItemsButtons){
      i.changeInteractuable(activate);
    }

    for(let i of this.activeItemsButtons){
      i.changeInteractuable(activate);
    }


  }
}