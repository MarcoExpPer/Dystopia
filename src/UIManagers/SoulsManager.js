import Phaser from 'phaser'
import ResourceManager from './ResourceManager';

/**
 * Clase que maneja la UI que muestra cuantos recursos volatiles tiene el jugador
 */
export default class SoulsManager extends ResourceManager{
  
  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la entidad
   * @param {number} x Coordenada X
   * @param {number} y Coordenada Y
   * @param {number} currentAmount Cantidad actual
   * @param {bool} hide Hide the resource UI if necesary
   */
  constructor(scene, x, y, currentAmount, hide) {
    super(scene, x, y, "souls_ss", 0, currentAmount, hide);
    
    this.prepareAnimations();
    
    this.text.y += 5;
    this.sprite.play("souls_anim");
  }


  prepareAnimations(){
    this.scene.anims.create({
      key: "souls_anim",
      frameRate: 7,
      frames: this.sprite.anims.generateFrameNames("souls_ss", {
        suffix: ".png",
        start: 0,
        end: 5,
        zeroPad: 0
      }),
      repeat: 0
    });
  }

  amountChange(newAmount){
    if(this.hide) this.showUI();

    this.text.setText(newAmount);
    this.sprite.play("souls_anim");
    this.sprite.on('animationcomplete', this.animationEnds, this);
    
  }

  animationEnds(){
    if(this.hide) this.hideUI()
    
  }

}
