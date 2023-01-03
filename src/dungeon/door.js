import KnockbackObject from "../entities/knockbackObject";

import { Directions } from "./enums";
import { DoorTypes } from "./enums";
/**
 * Class that represents a room door
 */


export default class Door extends Phaser.GameObjects.Container {

  constructor(room, direction, target, type) {
    super(room.scene, 0, 0);

    this.room = room;
    this.direction = direction;
    this.target = target;
    this.type = type;

    this.isOpen = false;

    this.doorA = null;
    this.doorB = null;

    this.openDoorTween = null;

    switch (type) {
      case DoorTypes.NORMAL:
        this.placeSpikeDoor();
        break;
      case DoorTypes.BOSS:
        this.placeBossDoor();
        break;
      case DoorTypes.NONE:
        this.placeWall();
    }
  }


  placeSpikeDoor() {
    this.placeTexture("spike_trap", 10, "spike_trap", 10, false);

    this.physicsContainer.setOnCollideWith(this.scene.player, () => {
      this.collisionWithSpikes();
    });

    this.scene.anims.create({
      key: 'spikeIn',
      frames: this.scene.anims.generateFrameNumbers('spike_trap', { start: 0, end: 10 }),
      frameRate: 7,
      repeat: 0
    });
    this.scene.anims.create({
      key: 'spikeOut',
      frames: this.scene.anims.generateFrameNumbers('spike_trap', { start: 10, end: 0 }),
      frameRate: 7,
      repeat: 0
    });
  }

  placeBossDoor() {
    this.placeTexture("doorA", 0, "doorB", 0)

    this.physicsContainer.setOnCollideWith(this.scene.player, () => {
      this.collisionWithBossDoor();
    });
  }

  placeWall() {
    this.placeTexture("wall", 0, "wall", 0);

  }

  placeTexture(textureA, frameA, textureB, frameB, rotate = true) {
    const coordinates = this.getCoordinates();
    this.x = coordinates.x + coordinates.xOffset;
    this.y = coordinates.y + coordinates.yOffset;

    this.doorA = new Phaser.GameObjects.Sprite(this.scene, -16, 0, textureA, frameA);
    this.add(this.doorA);

    this.doorB = new Phaser.GameObjects.Sprite(this.scene, 16, 0, textureB, frameB);
    this.add(this.doorB);

    this.setSize(this.doorA.width + this.doorB.width, this.doorA.height);
    this.physicsContainer = this.scene.matter.add.gameObject(this);

    if (!rotate) {
      this.doorA.setAngle(-coordinates.angle);
      this.doorB.setAngle(-coordinates.angle);
    }

    this.setAngle(coordinates.angle);

    this.physicsContainer.setStatic(true);
    this.physicsContainer.setFixedRotation();

    this.scene.add.existing(this);
  }

  getCoordinates() {
    const coordinates = {};

    switch (this.direction) {
      case Directions.NORTH:
        coordinates.x = 352 + this.room.x + 16; //11 * 32 + xOffset
        coordinates.y = 0 + this.room.y + 16;  //0 * 32 + yOffset
        coordinates.xOffset = 16;
        coordinates.yOffset = 0;

        coordinates.angle = 0;

        break;

      case Directions.EAST:
        coordinates.x = 736 + this.room.x + 16;
        coordinates.y = 224 + this.room.y + 16;

        coordinates.xOffset = 0;
        coordinates.yOffset = 16;

        coordinates.angle = 90;
        break;

      case Directions.SOUTH:
        coordinates.x = 352 + this.room.x + 16;
        coordinates.y = 480 + this.room.y + 16;

        coordinates.xOffset = 16;
        coordinates.yOffset = 0;

        coordinates.angle = 180;
        break;

      case Directions.WEST:
        coordinates.x = 0 + this.room.x + 16;
        coordinates.y = 224 + this.room.y + 16;

        coordinates.xOffset = 0;
        coordinates.yOffset = 16;

        coordinates.angle = -90;
        break;

      default:
        console.log("Unknown direction: " + this.direction)
        break;
    }
    return coordinates;
  }

  /**
   * COLLISIONS
   */
  collisionWithBossDoor() {
    if (this.isOpen) {
      this.movePlayer();
    } else
      if ((this.scene.registry.values.keys >= 1 && this.openDoorTween === null)) {
        this.openBossDoorAnimation();

      } else {
        console.log("Puerta Cerrada, No hay llave");
      }

  }

  collisionWithSpikes() {
    if (this.isOpen) {
      this.movePlayer();
    } 
  }

  openBossDoorAnimation() {
    this.openDoorTween = this.scene.add.tween({
      targets: [this],
      ease: 'Sine.easeInOut',
      duration: 500,
      delay: 0,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      onComplete: () => {
        this.isOpen = true;
        this.room.floor.bossRoomOpen = true;
      }
    });
  }

  open() {

    switch (this.type) {
      case DoorTypes.NONE:
        break;
      case DoorTypes.BOSS:
        if (this.room.floor.bossRoomOpen) {
          this.openBossDoorAnimation();
        }
        break;
      case DoorTypes.NORMAL:
        this.doorA.play("spikeOut");
        this.doorB.play("spikeOut");
        this.isOpen = true;
        break;
    }


  }

  movePlayer() {
    if (this.isOpen) {

      let distance = 100;
      switch (this.direction) {
        case Directions.NORTH:
          this.scene.player.y -= distance;
          break;

        case Directions.EAST:
          this.scene.player.x += distance;
          break;

        case Directions.SOUTH:
          this.scene.player.y += distance;
          break;

        case Directions.WEST:
          this.scene.player.x -= distance;
          break;

        default:
          console.log("Unknown direction: " + this.direction)
          break;
      }

      this.room.desactivate();
      this.target.activate();
    }
  }

  activate() {
    if (this.type === DoorTypes.NORMAL) {
      this.scene.addUpdateable(this);

      if (this.isOpen) {
        this.doorA.play("spikeOut");
        this.doorB.play("spikeOut");
      } else {
        this.doorA.play("spikeIn");
        this.doorB.play("spikeIn");
      }
    }
  }

  desactivate() {
    if (this.type === DoorTypes.NORMAL) {
      this.scene.removeUpdateable(this);
    }
  }

  update(t, dt) {
    if (this.doorA !== null) this.doorA.preUpdate(t, dt);
    if (this.doorB !== null) this.doorB.preUpdate(t, dt);
  }
}