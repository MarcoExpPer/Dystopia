import Phaser from 'phaser'
import SwordSwing from './swordSwing';

/**
 * Clase que representa un boomerang que avanza en linea recta un rango, espera ahi unos segundos, y vuelve a donde este el jugador
 */
export default class SwordAttackManager {

    /**
     * Constructor del jugador
     * @param {Phaser.Scene} scene Escena
     * @param {number} x Coordenada X
     * @param {number} y Coordenada Y
     * @param {number} speed Velocidad del boomerang
     * @param {string} direction Punto cardinal de la direccion/orientacion
     * @param {number} daño Daño del boomerang
     * @param {number} range Rango antes de que empiece a volver
     */
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;

    }


    attack() {
        const swing = new SwordSwing(this.scene, this.player);

        this.player.swordSwing.volume = this.player.scene.registry.values.sound/10;
        this.player.swordSwing.play();

        //PASSIVE ITEMS AFFECTING SWORD ATTACKS
        const list = this.player.listPassiveItems;

        for (let i of list) {
            if (i.label === "holySword") {
                i.activate(list);
            }
            if (i.label === "fireEssence") {
                i.activate(swing.x, swing.y, this.player.facing, 0);
                i.activate(swing.x, swing.y, this.player.facing, 1);
                i.activate(swing.x, swing.y, this.player.facing, 2);
            }
        }
    }
}   