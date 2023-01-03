import Boot from './scenes/boot.js';
import Village from './scenes/village.js';
import Dungeon from './scenes/dungeon.js';
import PauseMenu from './scenes/pause.js';
import DialogueScene from './scenes/dialogueScene.js';
import MainMenu from './scenes/mainmenu.js';
import LootItemCinematic from './scenes/lootItemCinematic.js';

import Phaser from 'phaser'

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.CANVAS,
    canvas: document.getElementById('game'),
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 768,
        height: 512,
        mode: Phaser.Scale.FIT
    },
    dom: {
        createContainer: true
    },
    pixelArt: true,
    scene: [Boot, MainMenu, Village, Dungeon, PauseMenu, DialogueScene, LootItemCinematic],
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

new Phaser.Game(config);
