
import Phaser from 'phaser'

export default class LootItemCinematic extends Phaser.Scene {

  constructor() {
    super({ key: 'lootItemCinematic' });
  }

  init(data) {
    this.mainScene = data.mainScene;
  }

  create() {
    this.player = this.mainScene.player;
    this.chest = this.mainScene.currentChest;
    const cam = this.mainScene.cameras.main;

    cam.pan(this.chest.x, this.chest.y, 1000, 'Power2');
    cam.zoomTo(3, 1000);

    this.chest.open();
    this.player.setTexture("player_" + this.player.heroDesign, "Player_" + this.player.heroDesign + "-" + (0 + 24 * this.player.facing) + ".png");
  }

  update(t, dt){
    this.chest.preUpdate(t, dt);
    this.mainScene.cameras.main.update(t, dt);

    if( this.chest.popupReady === true){
      this.chest.popupReady = false;

      this.movePopUp = this.tweens.addCounter({
        from: 0,
        to: 30,
        duration: 1000,
        ease: Phaser.Math.Easing.Sine.In,
        repeat: 0,
        onUpdate: (tween) => {
          let newY = tween.getValue();
          this.chest.popup.y = this.chest.y - newY;
        },
        onComplete: () => {
          this.player.setTexture("player_" + this.player.heroDesign, "Player_" + this.player.heroDesign + "-" + 16 + ".png");
          this.chest.activateText();
        }
      })
    }
  }
}
