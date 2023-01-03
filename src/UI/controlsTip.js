import Phaser, { GameObjects } from 'phaser'

/**
 * Clase que representa un boton que cambia su textura cuando se pasa el raton por encima y que tiene un texto en su interior
 * Al clicar el boton se ejecuta la funcion que se pasa como parametro
 */
export default class ControlTips extends Phaser.GameObjects.Container {

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
  constructor(scene, x, y) {
    super(scene, x, y);

    const movementText = new Phaser.GameObjects.Text(scene, -47, -32, "Movimiento").setOrigin(0);
    this.add(movementText);

    const W_key = new Phaser.GameObjects.Image(scene, 0, 0, "keyW", 0);
    this.add( W_key );
    const A_key = new Phaser.GameObjects.Image(scene, -32, 32, "keyA", 0);
    this.add( A_key );
    const S_key = new Phaser.GameObjects.Image(scene, 0, 32, "keyS", 0);
    this.add( S_key );
    const D_key = new Phaser.GameObjects.Image(scene, 32, 32, "keyD", 0);
    this.add( D_key );

    let xOffset = 128;
    const interactText = new Phaser.GameObjects.Text(scene, -47 + xOffset, -32, "Interactuar").setOrigin(0);
    this.add(interactText);
    const E_key = new Phaser.GameObjects.Image(scene, xOffset, 0, "keyE", 0);
    this.add( E_key );

    
    xOffset += 128 ;
    const actions = new Phaser.GameObjects.Text(scene, -47 + xOffset, 0, "Atacar/Objeto").setOrigin(0);
    this.add(actions);
    const J_key = new Phaser.GameObjects.Image(scene, xOffset, 32, "keyJ", 0);
    this.add( J_key );
    const K_key = new Phaser.GameObjects.Image(scene, xOffset+32, 32, "keyK", 0);
    this.add( K_key );
  }

}