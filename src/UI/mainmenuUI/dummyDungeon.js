import Phaser, { GameObjects } from 'phaser'
import Bat from '../../entities/enemies/bat';
import FloorFire from '../../entities/floorActivables/floorFire';
import CollisionManager from '../../managers/CollisionManager';


export default class DummyDungeon extends Phaser.GameObjects.Container {


    constructor(scene, x, y) {
        super(scene, x, y);

        //TILEMAP
        const map = this.scene.make.tilemap({
            key: 'roomEmpty',
            tileWidth: 32,
            tileHeight: 32
        })
        const tilesetImages = new Array();
        tilesetImages.push(map.addTilesetImage('base_dungeon', 'baseDungeon_tileset'));
        tilesetImages.push(map.addTilesetImage('animated_torchs', 'animatedTorchs_tileset'));

        const groundLayer = map.createLayer("background", tilesetImages);
        const decorationLayer = map.createLayer('decorations', tilesetImages);

        groundLayer.setCollisionFromCollisionGroup(true);
        this.scene.animatedTiles.init(map);

        // Enable wall collisions
        this.scene.matter.world.convertTilemapLayer(groundLayer);

        this.scene.matter.world.setBounds(32, 32, 705, 450);

        this.createSkeleton();

        let batAttributes = {
            health: 12,
            speed: 0,
            maxSpeed: 2,
            damage: 1
        }

        this.scene.add.existing(new Bat(this.scene, 300, 300, batAttributes))
        this.scene.add.existing(new Bat(this.scene, 500, 100, batAttributes))
        this.scene.add.existing(new Bat(this.scene, 100, 500, batAttributes))


        this.scene.add.existing(new CollisionManager(this.scene));

        let fire = new FloorFire(this.scene, 65, 300);
    }


    createSkeleton() {
        this.skeleton = new Phaser.GameObjects.Sprite(this.scene, 70, 70, "skeleton", 0).setScale(2);
        this.scene.add.existing(this.skeleton);

        this.skeleton.setInteractive();
        this.skeleton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            this.skeleton.attacking = true;
            this.skeleton.state = "attacking";
            this.skeleton.play("skeleton_fullAttack");
        }, this);

        this.skeleton.attacking = false;
        this.skeleton.direction = 1;

        this.scene.anims.create({
            key: "skeleton_walk",
            frameRate: 7,
            frames: this.skeleton.anims.generateFrameNames("skeleton", {
                prefix: "walk",
                suffix: ".png",
                start: 0,
                end: 12,
            }),
            repeat: -1
        });

        this.scene.anims.create({
            key: "skeleton_idle",
            frameRate: 7,
            frames: this.skeleton.anims.generateFrameNames("skeleton", {
                prefix: "idle",
                suffix: ".png",
                start: 0,
                end: 10,
            }),
            repeat: -1
        });

        this.scene.anims.create({
            key: "skeleton_fullAttack",
            frameRate: 7,
            frames: this.skeleton.anims.generateFrameNames("skeleton", {
                prefix: "attack",
                suffix: ".png",
                start: 0,
                end: 17,
            }),
            repeat: 0
        });

        this.skeleton.on("animationcomplete", (event) => {
            switch (event.key) {
                case "skeleton_fullAttack":
                    this.skeleton.attacking = false;
                    this.skeleton.state = "idle";
                    break;

            }
        })

        this.moveTimer = this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                if (this.skeleton.attacking === false)
                    if (this.skeleton.state === "walking")
                        this.skeleton.state = "idle";
                    else
                        this.skeleton.state = "walking";
            },
            callbackScope: this,
            loop: true
        });

        this.skeleton.state = "idle";
    }

    skeletonStatemachine(dt) {
        if (this.skeleton.state === "idle")
            this.skeleton.play("skeleton_idle", true);
        else if (this.skeleton.state === "walking") {
            this.skeleton.play("skeleton_walk", true);
            this.skeleton.x += 0.035 * dt * this.skeleton.direction;

            if (this.skeleton.x > 600) {
                this.skeleton.direction = -1;
                this.skeleton.flipX = true;
            } else if (this.skeleton.x < 50) {
                this.skeleton.direction = 1;
                this.skeleton.flipX = false;
            }
        }
    }
    update(t, dt) {
        this.skeletonStatemachine(dt);
    }

}