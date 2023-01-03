import Phaser from 'phaser'

import cell from '../../assets/minimap/base.png'
import deadend from '../../assets/minimap/deadend.png'
import boss from '../../assets/minimap/boss.png'
import reward from '../../assets/minimap/reward.png'
import shop from '../../assets/minimap/shop.png'
import secret from '../../assets/minimap/secret.png'
import FloorPlanner from '../dungeon/floorPlanner'

const cellw = 44;
const cellh = 44;
const W = 418;
const H = 418;

let config = {
  type: Phaser.AUTO,
  scale: {
    width: W,
    height: H,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

new Phaser.Game(config);

function preload() {
  this.load.image('cell', cell);
  this.load.image('end', deadend);
  this.load.image('boss', boss);
  this.load.image('reward', reward);
  this.load.image('shop', shop);
  this.load.image('secret', secret);
}

function create() {
  this.floorPlanner = new FloorPlanner(this);
  this.floorPlanner.run(true);
  this.drawn = false;

  this.input.on('pointerdown', () => this.scene.restart());
}

function update() {
  if (this.floorPlanner.isRunning()) {
    drawCell(this, this.floorPlanner.queue[0], 'cell');
    this.floorPlanner.step();
  } else if (!this.drawn) {
    this.drawn = true;
    console.log(this.floorPlanner.getPlan());
    drawDetails(this, this.floorPlanner.getPlan());
  }
}

function drawCell(scene, n, name) {
  let x = n % 10;
  scene.add.image(W/2 + cellw * (x - 5), H/2 + cellh * ((n - x) / 10 - 5), name);
}

function drawDetails(scene, plan) {
  for (const room of plan.deadEnds) {
    drawCell(scene, room, 'end');
  }
  drawCell(scene, plan.specialRooms.boss, 'boss');
  drawCell(scene, plan.specialRooms.reward, 'reward');
  drawCell(scene, plan.specialRooms.shop, 'shop');
}
