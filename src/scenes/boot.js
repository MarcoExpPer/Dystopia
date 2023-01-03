import Phaser from 'phaser'

//Player Sprites
import player_0 from '../../assets/sprites/player/Player_0.png'
import player_0json from '../../assets/sprites/player/Player_0.json'
import player_1 from '../../assets/sprites/player/Player_1.png'
import player_1json from '../../assets/sprites/player/Player_1.json'
import player_2 from '../../assets/sprites/player/Player_2.png'
import player_2json from '../../assets/sprites/player/Player_2.json'
import player_3 from '../../assets/sprites/player/Player_3.png'
import player_3json from '../../assets/sprites/player/Player_3.json'
import player_4 from '../../assets/sprites/player/Player_4.png'
import player_4json from '../../assets/sprites/player/Player_4.json'
import player_5 from '../../assets/sprites/player/Player_5.png'
import player_5json from '../../assets/sprites/player/Player_5.json'
import player_6 from '../../assets/sprites/player/Player_6.png'
import player_6json from '../../assets/sprites/player/Player_6.json'
import player_7 from '../../assets/sprites/player/Player_7.png'
import player_7json from '../../assets/sprites/player/Player_7.json'
import player_8 from '../../assets/sprites/player/Player_8.png'
import player_8json from '../../assets/sprites/player/Player_8.json'

import swordSwing_image from '../../assets/sprites/player/swordSwing.png'
import swordSwing_json from '../../assets/sprites/player/swordSwing.json'
//Enemies
import bat_ss from '../../assets/sprites/enemies/bat_spritesheet.png'
import skeleton from '../../assets/sprites/enemies/skeleton/skeleton.png'
import skeleton_json from '../../assets/sprites/enemies/skeleton/skeleton.json'
import archer from '../../assets/sprites/enemies/archer/archer_ss.png'
import archer_json from '../../assets/sprites/enemies/archer/archer_ss.json'

import ghost from '../../assets/sprites/enemies/ghost/ghost_ss.png'
import ghost_json from '../../assets/sprites/enemies/ghost/ghost.json'
import ghost_swing1 from '../../assets/sprites/enemies/ghost/swing_1.png'
import ghost_swing2 from '../../assets/sprites/enemies/ghost/swing_2.png'
import ghost_swing1_shape from '../../assets/sprites/enemies/ghost/swing_1.json'
import ghost_swing2_shape from '../../assets/sprites/enemies/ghost/swing_2.json'

import summon from '../../assets/sprites/enemies/ghost/summon_ss.png'
import summon_json from '../../assets/sprites/enemies/ghost/summon.json'

//Slimes
import blueslime from '../../assets/sprites/enemies/slimes/SlimeBlue.png'
import blueslime_json from '../../assets/sprites/enemies/slimes/SlimeBlue.json'
import greenslime from '../../assets/sprites/enemies/slimes/SlimeGreen.png'
import greenslime_json from '../../assets/sprites/enemies/slimes/SlimeGreen.json'
import redslime from '../../assets/sprites/enemies/slimes/SlimeRed.png'
import redslime_json from '../../assets/sprites/enemies/slimes/SlimeRed.json'

//TRAPS
import spike_trap from '../../assets/traps/spikeTrap.png'

//NPCs
import npc_1 from '../../assets/sprites/npc/npc_1.png'
import npc_1_json from '../../assets/sprites/npc/npc_1.json'
import npc_1_profile from '../../assets/sprites/npc/npc_1_profile.png'
import npc_2 from '../../assets/sprites/npc/npc_2.png'
import npc_2_json from '../../assets/sprites/npc/npc_2.json'
import npc_2_profile from '../../assets/sprites/npc/npc_2_profile.png'
import npc_3 from '../../assets/sprites/npc/npc_3.png'
import npc_3_json from '../../assets/sprites/npc/npc_3.json'
import npc_3_profile from '../../assets/sprites/npc/npc_3_profile.png'

import empty64x from '../../assets/sprites/empty64x64.png'
import hearths_ss from '../../assets/sprites/hearth_spritesheet.png'

import souls_ss from '../../assets/sprites/items/souls.png'
import souls_ss_json from '../../assets/sprites/items/souls.json'

import coin1_ss from '../../assets/sprites/items/coin1_ss.png'
import coin2_ss from '../../assets/sprites/items/coin2_ss.png'

import medium_fire_loop from '../../assets/sprites/fire/medium_fire_loop.png'
import small_fire_start from '../../assets/sprites/fire/small_fire_start.png'
import small_fire_loop from '../../assets/sprites/fire/small_fire_loop.png'
import small_fire_end from '../../assets/sprites/fire/small_fire_end.png'

//Items
import chests_ss from '../../assets/sprites/items/chests.png'
import itemslot_unique from '../../assets/UI/emptyItemSlot.png'
import itemslot_uniqueover from '../../assets/UI/emptyItemSlotover.png'
import bow_spritesheet_ss from '../../assets/sprites/items/bow_spritesheet.png'

import key from '../../assets/sprites/items/key-white.png'

import holy_sword from '../../assets/sprites/items/holySword.png'
import fireholy_sword from '../../assets/sprites/items/fireSword.png'

import boomerang_ss from '../../assets/sprites/items/boomerang_ss.png'
import potions_ss from '../../assets/sprites/items/potions.png'
import sword from '../../assets/sprites/items/sword.png'
import shield from '../../assets/sprites/items/shield.png'
import boots from '../../assets/sprites/items/boots.png'
import chests_ss from '../../assets/sprites/items/chests.png'

//Pure UI
import green_square from '../../assets/UI/green_square.png'
import green_squareover from '../../assets/UI/green_squareover.png'
import green_small from '../../assets/UI/green_small.png'
import green_smallover from '../../assets/UI/green_smallover.png'
import green_medium from '../../assets/UI/green_medium.png'
import green_mediumover from '../../assets/UI/green_mediumover.png'
import green_large from '../../assets/UI/green_large.png'
import green_largeover from '../../assets/UI/green_largeover.png'
import green_plus from '../../assets/UI/green_plus.png'
import green_plusover from '../../assets/UI/green_plusover.png'
import green_bin from '../../assets/UI/green_bin.png'
import green_binover from '../../assets/UI/green_binover.png'
import green_tick from '../../assets/UI/green_tick.png'
import green_tickover from '../../assets/UI/green_tickover.png'
import green_right from '../../assets/UI/green_right.png'
import green_rightover from '../../assets/UI/green_rightover.png'
import green_left from '../../assets/UI/green_left.png'
import green_leftover from '../../assets/UI/green_leftover.png'
import green_x from '../../assets/UI/green_x.png'
import green_xover from '../../assets/UI/green_xover.png'
import green_question from '../../assets/UI/green_question.png'
import green_questionover from '../../assets/UI/green_questionover.png'
import green_shop from '../../assets/UI/green_shop.png'
import green_customeshop from '../../assets/UI/green_customeshop.png'
import green_customebackground from '../../assets/UI/green_customebackground.png'
import green_dialogue from '../../assets/UI/green_dialogue.png'
import green_tooltipmegalarge from '../../assets/UI/green_tooltipmegalarge.png'
import green_tooltipVertical from '../../assets/UI/green_tooltipVertical.png'
import green_saveslot from '../../assets/UI/green_saveslot.png'
import green_saveslotover from '../../assets/UI/green_saveslotover.png'
import green_bigsaveslot from '../../assets/UI/green_bigsaveslot.png'

import green_overlaySquare from '../../assets/UI/green_overlaySquare.png'
import green_overlaySaveSlot from '../../assets/UI/green_overlaySaveSlot.png'
import green_overlaySmall from '../../assets/UI/green_overlaySmall.png'
import green_overlayMedium from '../../assets/UI/green_overlayMedium.png'
import green_overlayLarge from '../../assets/UI/green_overlayLarge.png'

import purple_square from '../../assets/UI/green_square.png'
import purple_squareover from '../../assets/UI/purple_squareover.png'
import purple_small from '../../assets/UI/purple_small.png'
import purple_smallover from '../../assets/UI/purple_smallover.png'
import purple_medium from '../../assets/UI/purple_medium.png'
import purple_mediumover from '../../assets/UI/purple_mediumover.png'
import purple_large from '../../assets/UI/purple_large.png'
import purple_largeover from '../../assets/UI/purple_largeover.png'
import purple_plus from '../../assets/UI/purple_plus.png'
import purple_plusover from '../../assets/UI/purple_plusover.png'
import purple_bin from '../../assets/UI/purple_bin.png'
import purple_binover from '../../assets/UI/purple_binover.png'
import purple_tick from '../../assets/UI/purple_tick.png'
import purple_tickover from '../../assets/UI/purple_tickover.png'
import purple_right from '../../assets/UI/purple_right.png'
import purple_rightover from '../../assets/UI/purple_rightover.png'
import purple_left from '../../assets/UI/purple_left.png'
import purple_leftover from '../../assets/UI/purple_leftover.png'
import purple_x from '../../assets/UI/purple_x.png'
import purple_xover from '../../assets/UI/purple_xover.png'
import purple_shop from '../../assets/UI/purple_shop.png'
import purple_dialogue from '../../assets/UI/purple_dialogue.png'

import purple_overlaySquare from '../../assets/UI/purple_overlaySquare.png'
import purple_overlaySmall from '../../assets/UI/purple_overlaySmall.png'
import purple_overlayMedium from '../../assets/UI/purple_overlayMedium.png'
import purple_overlayLarge from '../../assets/UI/purple_overlayLarge.png'

import tittle from '../../assets/UI/tittle.png'

//Animated tiles
import animated_torchs from '../../assets/tiles/dungeon_tileset_animations.png'

//SingleTiles
import wall from '../../assets/tiles/wall.png'
import doorA from '../../assets/tiles/doorA.png'
import doorB from '../../assets/tiles/doorB.png'

//Tilesets
import baseDungeon_tileset from '../../assets/tiles/dungeon_tileset_editedCorners.png'

//Tilemaps
import roomColumns from '../../tiled/columnsMap.json'
import roomEmpty from '../../tiled/emptyRoom.json'
import roomChest from '../../tiled/chestRoom.json'
import roomShop from '../../tiled/shopRoom.json'
import roomBoss from '../../tiled/bossMap.json'

import vg_tilemap from '../../tiled/village_tilemap.json'
import vg_tileset_grass from '../../assets/tiles/village_tileset_grass.png'
import vg_tileset_ground from '../../assets/tiles/village_tileset_ground.png'
import vg_tileset_plant from '../../assets/tiles/village_tileset_plant.png'
import vg_tileset_props from '../../assets/tiles/village_tileset_props.png'
import vg_tileset_struct from '../../assets/tiles/village_tileset_struct.png'
import vg_tileset_wall from '../../assets/tiles/village_tileset_wall.png'
import BaseScene from './baseScene'

//Music and sounds
import villageMusic from '../../assets/music/village.ogg'
import dungeonMusic from '../../assets/music/dungeon.ogg'
import menuMusic from '../../assets/music/menu.ogg'
import playerHit from '../../assets/music/playerHit.ogg'
import playerHit from '../../assets/music/playerHit.ogg'
import swordSwing from '../../assets/music/swordSwing.ogg'
import batHit from '../../assets/music/batHit.ogg'
import skeletonHit from '../../assets/music/skeletonHit.ogg'
import bowShotSound from '../../assets/music/bowShotSound.ogg'
import chestSound from '../../assets/music/chestSound.ogg'

//KEYBOAR ICONS
import key_W from '../../assets/keyIcons/W-Key.png'
import key_A from '../../assets/keyIcons/A-Key.png'
import key_D from '../../assets/keyIcons/D-Key.png'
import key_S from '../../assets/keyIcons/S-Key.png'
import key_K from '../../assets/keyIcons/K-Key.png'
import key_J from '../../assets/keyIcons/J-Key.png'
import key_E from '../../assets/keyIcons/E-Key.png'

/**
 * Escena para la precarga de los assets que se usarán en el juego.
 */
export default class Boot extends BaseScene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: 'boot' });
  }

  /**
   * Carga de los assets del juego
   */
  preload() {
    let camera = this.cameras.main;
    camera.setBackgroundColor('#25131A');
    this.progressBorder = this.add.graphics();
    this.progressBlack = this.add.graphics();
    this.progressBar = this.add.graphics();

    this.progressBorder.fillStyle(0x6e4a48, 1);
    this.progressBorder.fillRectShape(new Phaser.Geom.Rectangle((camera.width - 410) / 2, (camera.height - 50) / 2, 410, 50));

    this.progress = new Phaser.Geom.Rectangle((camera.width - 400) / 2, (camera.height - 40) / 2, 400, 40);
    this.progressBlack.fillStyle(0x000000, 1);
    this.progressBlack.fillRectShape(this.progress);

    this.progress.setSize(0, 40);
    this.progressBar.fillStyle(0x3d253b, 1);
    this.progressBar.fillRectShape(this.progress);

    this.progressText = this.add.text((camera.width / 2) - 30, (camera.height / 2) - 8, '  0 %', { font: '20px monospace' });

    this.load.on('progress', function (value) {
      this.progress.setSize((400 * value), 40);
      this.progressBar.fillRectShape(this.progress);

      let str = parseInt(value * 100) + ' %';
      while (str.length < 5) str = ' ' + str;
      this.progressText.setText(str);
    }, this);

    this.load.once('complete', function () {
      console.log('complete');

      console.log(this.progressBorder);

      this.progressBorder.clear();
      this.progressBlack.clear();
      this.progressBar.clear();

      camera.setBackgroundColor('#272F6F');

      this.button = this.add.graphics();
      this.button.fillStyle(0x3d253b, 2);
      this.button.fillRectShape(this.progress);

      this.progressText = this.add.text((camera.width / 2) - 30, (camera.height / 2) - 8, 'Start', { font: '20px monospace' });



    }, this);

    //Graphics
    const blackbackground = this.make.graphics().fillStyle(0x000000).fillRect(0, 0, 768, 512);
    blackbackground.generateTexture('blackscreen', 768, 512);
    blackbackground.destroy();

    //Player
    this.load.atlas('player_0', player_0, player_0json);
    this.load.atlas('player_1', player_1, player_1json);
    this.load.atlas('player_2', player_2, player_2json);
    this.load.atlas('player_3', player_3, player_3json);
    this.load.atlas('player_4', player_4, player_4json);
    this.load.atlas('player_5', player_5, player_5json);
    this.load.atlas('player_6', player_6, player_6json);
    this.load.atlas('player_7', player_7, player_7json);
    this.load.atlas('player_8', player_8, player_8json);

    this.load.image('swordSwing_image', swordSwing_image);
    this.load.json('swordSwingShape', swordSwing_json);

    this.load.spritesheet('bat_ss', bat_ss, { frameWidth: 32, frameHeight: 32 });
    this.load.atlas('skeleton', skeleton, skeleton_json);

    this.load.atlas('archer', archer, archer_json);
  
    this.load.atlas('ghost', ghost, ghost_json);
    this.load.image('ghost_swing1', ghost_swing1);
    this.load.image('ghost_swing2', ghost_swing2);
    this.load.json('ghost_swing1_shape', ghost_swing1_shape);
    this.load.json('ghost_swing2_shape', ghost_swing2_shape);
    this.load.atlas('summon', summon, summon_json);
    
    this.load.atlas('blueslime', blueslime, blueslime_json);
    this.load.atlas('greenslime', greenslime, greenslime_json);
    this.load.atlas('redslime', redslime, redslime_json);

    //TRAPS
    this.load.spritesheet('spike_trap', spike_trap, { frameWidth: 32, frameHeight: 32 });
    
    //NPC
    this.load.atlas('npc_1', npc_1, npc_1_json);
    this.load.image('npc_1_profile', npc_1_profile);
    this.load.atlas('npc_2', npc_2, npc_2_json);
    this.load.image('npc_2_profile', npc_2_profile);
    this.load.atlas('npc_3', npc_3, npc_3_json);
    this.load.image('npc_3_profile', npc_3_profile);

    this.load.image('empty64x', empty64x);
    this.load.spritesheet('hearths_ss', hearths_ss, { frameWidth: 32, frameHeight: 32 });

    this.load.atlas('souls_ss', souls_ss, souls_ss_json);
    this.load.spritesheet('coin1_ss', coin1_ss, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('coin2_ss', coin2_ss, { frameWidth: 32, frameHeight: 32 });

    this.load.spritesheet('medium_fire_loop', medium_fire_loop, { frameWidth: 40, frameHeight: 48 });
    this.load.spritesheet('small_fire_start', small_fire_start, { frameWidth: 8, frameHeight: 8 });
    this.load.spritesheet('small_fire_loop', small_fire_loop, { frameWidth: 8, frameHeight: 8 });
    this.load.spritesheet('small_fire_end', small_fire_end, { frameWidth: 8, frameHeight: 8 });

    //Items
    this.load.image('holy_sword', holy_sword);
    this.load.image('fireholy_sword', fireholy_sword);

    this.load.spritesheet('chests_ss', chests_ss, { frameWidth: 16, frameHeight: 16 });
    this.load.image('itemslot_unique', itemslot_unique);
    this.load.image('itemslot_uniqueover', itemslot_uniqueover);
    this.load.spritesheet('bow_ss', bow_spritesheet_ss, { frameWidth: 32, frameHeight: 32 });

    this.load.spritesheet('boomerang_ss', boomerang_ss, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('potions_ss', potions_ss, { frameWidth: 16, frameHeight: 16 });

    this.load.image('sword', sword);
    this.load.image('shield', shield);
    this.load.image('boots', boots);
    this.load.spritesheet('chests_ss', chests_ss, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('key', key, { frameWidth: 32, frameHeight: 32 });
    
    //Green UI
    this.load.image('green_square', green_square);
    this.load.image('green_squareover', green_squareover);
    this.load.image('green_small', green_small);
    this.load.image('green_smallover', green_smallover);
    this.load.image('green_medium', green_medium);
    this.load.image('green_mediumover', green_mediumover);
    this.load.image('green_large', green_large);
    this.load.image('green_largeover', green_largeover);
    this.load.image('green_plus', green_plus);
    this.load.image('green_plusover', green_plusover);
    this.load.image('green_bin', green_bin);
    this.load.image('green_binover', green_binover);
    this.load.image('green_tick', green_tick);
    this.load.image('green_tickover', green_tickover);
    this.load.image('green_right', green_right);
    this.load.image('green_rightover', green_rightover);
    this.load.image('green_left', green_left);
    this.load.image('green_leftover', green_leftover);
    this.load.image('green_x', green_x);
    this.load.image('green_xover', green_xover);
    this.load.image('green_question', green_question);
    this.load.image('green_questionover', green_questionover);
    this.load.image('green_shop', green_shop);
    this.load.image('green_customeshop', green_customeshop);
    this.load.image('green_customeback', green_customebackground);
    this.load.image('green_dialogue', green_dialogue);
    this.load.image('green_tooltipmegalarge', green_tooltipmegalarge);
    this.load.image('green_tooltipVertical', green_tooltipVertical);
    this.load.image('green_saveslot', green_saveslot);
    this.load.image('green_saveslotover', green_saveslotover);
    this.load.image('green_bigsaveslot', green_bigsaveslot);

    this.load.image('green_overlaySquare', green_overlaySquare);
    this.load.image('green_overlaySaveSlot', green_overlaySaveSlot);
    this.load.image('green_overlaySmall', green_overlaySmall);
    this.load.image('green_overlayMedium', green_overlayMedium);
    this.load.image('green_overlayLarge', green_overlayLarge);

    //Pruple UI
    this.load.image('purple_square', purple_square);
    this.load.image('purple_squareover', purple_squareover);
    this.load.image('purple_small', purple_small);
    this.load.image('purple_smallover', purple_smallover);
    this.load.image('purple_medium', purple_medium);
    this.load.image('purple_mediumover', purple_mediumover);
    this.load.image('purple_large', purple_large);
    this.load.image('purple_largeover', purple_largeover);
    this.load.image('purple_plus', purple_plus);
    this.load.image('purple_plusover', purple_plusover);
    this.load.image('purple_bin', purple_bin);
    this.load.image('purple_binover', purple_binover);
    this.load.image('purple_tick', purple_tick);
    this.load.image('purple_tickover', purple_tickover);
    this.load.image('purple_right', purple_right);
    this.load.image('purple_rightover', purple_rightover);
    this.load.image('purple_left', purple_left);
    this.load.image('purple_leftover', purple_leftover);
    this.load.image('purple_x', purple_x);
    this.load.image('purple_xover', purple_xover);
    this.load.image('purple_shop', purple_shop);
    this.load.image('purple_dialogue', purple_dialogue);

    this.load.image('purple_overlaySquare', purple_overlaySquare);
    this.load.image('purple_overlaySmall', purple_overlaySmall);
    this.load.image('purple_overlayMedium', purple_overlayMedium);
    this.load.image('purple_overlayLarge', purple_overlayLarge);

    this.load.image('tittle', tittle);
    //Animated tiles
    this.load.image('animatedTorchs_tileset', animated_torchs);

    //Single tiles
    this.load.image('wall', wall);
    this.load.image('doorA', doorA);
    this.load.image('doorB', doorB);

    //TILESETS
    this.load.image('baseDungeon_tileset', baseDungeon_tileset);
    
    //TILEMAPS
    this.load.tilemapTiledJSON('roomColumns', roomColumns);
    this.load.tilemapTiledJSON('roomEmpty', roomEmpty);
    this.load.tilemapTiledJSON('roomChest', roomChest);
    this.load.tilemapTiledJSON('roomShop', roomShop);
    this.load.tilemapTiledJSON('roomBoss', roomBoss);
    
    this.load.tilemapTiledJSON('vg_tilemap', vg_tilemap);
    this.load.image('vg_tileset_grass', vg_tileset_grass);
    this.load.image('vg_tileset_ground', vg_tileset_ground);
    this.load.image('vg_tileset_plant', vg_tileset_plant);
    this.load.image('vg_tileset_props', vg_tileset_props);
    this.load.image('vg_tileset_struct', vg_tileset_struct);
    this.load.image('vg_tileset_wall', vg_tileset_wall);

    this.load.audio('villageMusic', villageMusic);
    this.load.audio('dungeonMusic', dungeonMusic);
    this.load.audio('menuMusic', menuMusic);
    this.load.audio('playerHit', playerHit);
    this.load.audio('swordSwing', swordSwing);
    this.load.audio('batHit', batHit);
    this.load.audio('skeletonHit', skeletonHit);
    this.load.audio('bowShotSound', bowShotSound);
    this.load.audio('chestSound', chestSound);

    //KEYBOARD ICONS
    this.load.spritesheet('keyW', key_W, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('keyA', key_A, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('keyS', key_S, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('keyD', key_D, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('keyJ', key_J, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('keyK', key_K, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('keyE', key_E, { frameWidth: 32, frameHeight: 32 });
    
  }

  /**
   * Cargamos la escena de la aldea
   */
  create() {
    
    


    this.scene.start('mainmenu');
  }
}
