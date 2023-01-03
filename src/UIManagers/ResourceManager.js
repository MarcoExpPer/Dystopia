import Phaser from 'phaser'

/**
 * Clase que maneja la UI con la cantidad de un recurso en concreto
 */
export default class UIresourceManager extends Phaser.GameObjects.Container {
  
  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {number} currentAmount Cantidad actual
   * @param {bool} hide Hide the resource UI if necesary
   */
  constructor(scene, x, y, texture, frame, currentAmount, hide) {
    super(scene, x, y);
    this.hide = hide;

    this.sprite = new Phaser.GameObjects.Sprite(scene, x -20, y, texture, frame);
    this.text = new Phaser.GameObjects.Text(scene, 5, 0, currentAmount, { fontFamily: "monospace"} )
        .setOrigin(0.5, 0.5) 
        .setAlign('center')
        .setFontSize(20);
    

    this.add(this.text);
    this.add(this.sprite);

    this.scene.add.existing(this.sprite); //Necesario para que el sprite se pueda animar
    this.scene.add.existing(this);

    if(this.hide === true){
      this.hideUI();
    }

    this.setScrollFactor(0, 0, true);
    this.sprite.setScrollFactor(0, 0, true);
  }
  amountChange(newAmount){}

  addLoot(newLoot){}

  //Necesario sobrescribirlo para que se eliminen correctamente las cosas
  destroy(){
    this.sprite.destroy();
    this.text.destroy();
  }

  showUI(){
    this.sprite.setVisible(true);
    this.sprite.setActive(true);
    this.text.setVisible(true);
    this.text.setActive(true);
  }

  hideUI(){
    this.sprite.setVisible(false);
    this.sprite.setActive(false);
    this.text.setVisible(false);
    this.text.setActive(false);
  }

}
