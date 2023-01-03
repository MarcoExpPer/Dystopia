import Entity from '../../entities/entity';

export default class Chest extends Entity {

  constructor(scene, x, y, type, reward, room) {
    super(scene, x, y, "chests_ss", type * 5);
    this.type = type;
    this.reward = reward;
    this.room = room;

    this.x = this.x - this.width;
    this.y = this.y - this.height;

    this.xRef;
    this.yRef;
    this.popupReady = false;
    this.popup = new Phaser.GameObjects.Image(this.scene, this.x, this.y, this.reward.texture, this.reward.frame).setDepth(3);

    this.isOpen = false;

    this.setScale(2);

    this.setStatic(true);
    this.prepareAnimations();

    this.chestSound = this.scene.sound.add("chestSound");
  }

  interact() {
    if (this.popup !== null && !this.isOpen) {
      this.isOpen = true;
      this.scene.openChest(this);
    }
  }

  startAnimation() {

      let data = {
        chest: this,
        player: this.scene.player,
        mainScene: this.scene
      }
      this.doAnimation = true;

      this.scene.scene.launch("lootItemCinematic", data);
      this.scene.scene.pause();
    
  }

  openWithoutAnimation() {

      this.doAnimation = false;
      this.anims.play("openchest_" + this.type);
    
  }

  open() {
    this.anims.play("openchest_" + this.type);
    this.chestSound.volume = this.scene.registry.values.sound / 10;
    this.chestSound.play();
  }

  dialogueFlagEnds() {
    this.scene.scene.stop("lootItemCinematic");
    this.scene.scene.resume(this.mainScene);
    this.popup.destroy();
    this.popup = null;

    if (this.reward.isActive) {
      this.scene.player.addActiveItem(this.reward);
    } else {
      this.scene.player.equipPassiveItem(this.reward);
    }

    const cam = this.scene.cameras.main;
    const coords = this.room.getCenter();
    cam.pan(coords.x, coords.y, 500, 'Power2');
    cam.zoomTo(1, 500);
  }

  activateText() {
    this.scene.openDialogue(this.reward.dialogueID, "green", this.dialogueFlagEnds.bind(this));
  }

  prepareAnimations() {
    this.on("animationcomplete", (event) => {
      switch (event.key) {
        case "openchest_" + this.type:
          this.scene.add.existing(this.popup);
          if (this.doAnimation) {
            this.popupReady = true;
          } else {
            this.scene.tweens.addCounter({
              from: 0,
              to: 30,
              duration: 1000,
              ease: Phaser.Math.Easing.Sine.In,
              repeat: 0,
              onUpdate: (tween) => {
                let newY = tween.getValue();
                this.popup.y = this.y - newY;
              },
              onComplete: () => {
                this.popup.destroy();
                this.popup = null;
                if (this.reward.isActive) {
                  this.scene.player.addActiveItem(this.reward);
                } else {
                  this.scene.player.equipPassiveItem(this.reward);
                }
              }
            })
          }
          break;
      }
    });

    this.scene.anims.create({
      key: "openchest_" + this.type,
      frames: this.scene.anims.generateFrameNumbers('chests_ss', { start: this.type * 5, end: this.type * 5 + 3 }),
      frameRate: 7,
      repeat: 0
    });
  }

  disable() {}

  preUpdate(t, dt) {
    super.preUpdate(t, dt);
  }
}
