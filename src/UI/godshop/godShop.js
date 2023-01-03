import Phaser from 'phaser'

import Button from '../basicUI/button';
import BaseGodShopRow from './godnessShopRows/baseGodshopRow';
import RectangleAndText from '../basicUI/rectangleAndText';
import UIutils from '../uiutils';

/**
 * Clase que crea la interfaz basica de la tienda de la diosa, añade cada fila, y maneja las compras y cuando estas se pueden ejecutar
 */
export default class GodShop extends Phaser.GameObjects.Container {
  /**
  * @param {Phaser.Scene} scene Escena a la que pertenece el container
  * @param {number} x Coordenada X del container
  * @param {number} y Coordenada Y del container
  * @param {string} color Color de las texturas
  * @param {Number} npcs Array con los npcs que existen
  */
  constructor(scene, x, y, color, npcs) {
    super(scene, x, y);
    let currency = JSON.parse(JSON.stringify(scene.registry.values.souls));
    this.npcs = npcs;

    this.isActive = true;

    const uiUtils = new UIutils();
    let fontColor = uiUtils.chooseStyle(color);

    this.fontColor = fontColor;
    this.changeColor = uiUtils.getShopChangeFontColor();
    this.maxColor = uiUtils.getShopMaxFontColor();

    //Gran fondo que ocupa casi toda la pantalla
    this.background = new Phaser.GameObjects.Image(scene, 0, 0, color + "_shop");
    this.add(this.background);

    //Titulo situado arriba en el centro de la imagen
    this.title = new RectangleAndText(scene, 0, -215, color, "large", 1, "Donaciones", 40);
    this.add(this.title);

    /*Trackeador de los recursos ya que el soulsManager solo se actualiza con cambios en el registry, y queremos que se actualice sin
    realmente estar actualizando los valores del juego*/
    this.image = new Phaser.GameObjects.Sprite(scene, 0, 0, "souls_ss", 0).setScale(0.9);
    this.scene.anims.create({
      key: "souls_anim",
      frameRate: 7,
      frames: this.image.anims.generateFrameNames("souls_ss", {
        suffix: ".png",
        start: 0,
        end: 5,
        zeroPad: 0
      }),
      repeat: 0
    });

    this.resourceText = new Phaser.GameObjects.Text(scene, 20, -11, currency, { color: fontColor, fontSize: 25, fontFamily: "monospace" });

    this.resourceTracker = new Phaser.GameObjects.Container(scene, 270, -192);
    this.resourceTracker.add(this.image);
    this.resourceTracker.add(this.resourceText);
    this.add(this.resourceTracker);

    const reset = new Button(scene, 220, -192, color, "bin", 0.7, "", this.resetShop.bind(this), this.scene.select.bind(this.scene,0, 1));
    this.add(reset);

    this.xRef = -200;
    this.yRef = -150;
    this.span = 50;
    //Mapa con los cambios ejecutados durante los procesos de compra
    this.changes = new Map();
    this.changes.set("souls", currency);

    this.scene.selectables.push([reset, reset]);
    /*Recorre todos los npcs que no sean la propia diosa ¿Aunque quizas esta deberia poder subir de nivel para añadir desbloqueos? y prepara la UI
    para poder mejorarlos*/
    let number_npc = 1;
    this.rows = new Array();
    npcs.forEach((element) => {
      if (element.getName() !== "godness") {
        const row = new BaseGodShopRow(scene, this.xRef, this.yRef, color, element.getName(), this, number_npc);
        number_npc++;
        this.rows.push(row);
        this.add(row);
        this.yRef += this.span;
      }
    })
    const accept = new Button(scene, 75, 210, color, "tick", 0.8, "", this.acceptChanges.bind(this), this.scene.select.bind(this.scene, number_npc, 1));
    this.add(accept);

    const exit = new Button(scene, -75, 210, color, "x", 0.8, "", this.closeShop.bind(this), this.scene.select.bind(this.scene, number_npc, 0));
    this.add(exit);

    this.scene.selectables.push([exit, accept]);

  }
  //Restart all values
  resetShop() {
    const currency = JSON.parse(JSON.stringify(this.scene.registry.values.souls));
    this.resourceText.text = currency;
    this.image.play("souls_anim");

    this.changes = new Map();
    this.changes.set("souls", currency);

    this.rows.forEach((element) => {
      element.reset();
    });
  }

  //Close the shop UI
  closeShop() {
    this.isActive = false;
    this.scene.onEnd();
    this.destroy();
  }

  //Save all changes and close the shop
  acceptChanges() {

    this.changes.forEach((value, key) => {
      this.scene.registry.values[key] = value;
    })


    this.closeShop();
  }

  //Check if a buy can be executed and save it as a potential change
  buy(npc, newlvl, cost, maxLvl) {
    if (cost > this.changes.get("souls") || newlvl >= maxLvl)
      return false;

    this.changes.set(npc, newlvl);
    this.changes.set("souls", this.changes.get("souls") - cost);
    this.resourceText.text = this.changes.get("souls");
    this.image.play("souls_anim");

    return true;
  }

  getBaseColor() {
    return this.fontColor;
  }
  getUpdateColor() {
    return this.changeColor;
  }
  getFullColor() {
    return this.maxColor;
  }

  preUpdate(t, dt){
    this.image.preUpdate(t, dt);
  }
}