import Ghost from "../../entities/enemies/ghost";
import SkeletonGroup from "../../entities/enemies/skeletonGroup";
import Slime from "../../entities/enemies/slime";
import Souls from "../../entities/floorActivables/souls";
import KnockbackObject from "../../entities/knockbackObject";

import { RoomTypes } from "../enums";
import Floor from "../floor";
import Room from "../room";

/**
 * Class that represents a dungeon room
 */
export default class plusRoom extends Room {

    /**
     * Room constructor
     * @param {Floor} floor The floor this room is contained in
     * @param {number} number The number of room inside the floor
     * @param {string} type The type of room
     */
    constructor(floor, number, type, hasKey) {
        super(floor, number, type, hasKey);

    }

    create() {
        super.create("roomBoss");

    }
    
    //GENERIC ROOM
    placeEnemies() {
        switch (Phaser.Math.Between(0, 1)) {
            case 0: //SLIMES
                for (const obj of this.map.getObjectLayer('EnemiesSpawnPoints').objects) {
                    this.numberOfEnemies += 7; //1 + 2 + 4
                    new Slime(this.scene, this.x + obj.x + 16, this.y + obj.y, "blue", 3, this);
                }
                break;
            case 1: //SKELETONs
                let skeletonCoordinates = new Array();

                for (const obj of this.map.getObjectLayer('EnemiesSpawnPoints').objects) {
                    this.numberOfEnemies++;
                    skeletonCoordinates.push({ x: this.x + obj.x, y: this.y + obj.y });
                }
                new SkeletonGroup(this.scene, skeletonCoordinates, this);
                break;
        }
    }

    //BOSS ROOM

    placeBoss() {
        const coordinates = this.map.getObjectLayer('SpawnPoints').objects;
        
        this.boss = new Ghost(this.scene, coordinates, this);
    }

    bossDead(){
        this.isBossDead = true;
        
        const coordinates = this.map.getObjectLayer('Chest').objects[0];

        new Souls(this.scene, coordinates.x + this.x - 50, coordinates.y + this.y);
        new Souls(this.scene, coordinates.x + this.x, coordinates.y + this.y);
        new Souls(this.scene, coordinates.x + this.x + 50, coordinates.y + this.y);

        this.openArena();
    }
    bossAreaActivation() {
        this.arenaIsClosed = false;
        this.isBossDead = false;

        //Doors that close north and south paths
        this.doorNA = null;
        this.doorNB = null;
        this.doorSA = null;
        this.doorSB = null;

        const center = this.getCenter();

        //drop bait
        new Souls(this.scene, center.x, center.y);

        this.scene.addUpdateable(this);
    }

    update(t, dt) {
        this.checkArena();

        if (this.doorNA !== null) this.doorNA.preUpdate(t, dt);
        if (this.doorNB !== null) this.doorNB.preUpdate(t, dt);
        if (this.doorSA !== null) this.doorSA.preUpdate(t, dt);
        if (this.doorSB !== null) this.doorSB.preUpdate(t, dt);
    }

    checkArena() {
        if (!this.isBossDead) {
            if (!this.arenaIsClosed) {

                const playerX = this.scene.player.getCenter().x - this.x;
                const playerY = this.scene.player.getCenter().y - this.y;


                if (!this.playerInNorth(playerY)
                    && !this.playerInSouth(playerY)
                    && !this.playerInEast(playerX)
                    && !this.playerInWest(playerX)) {

                    this.closeArena();
                }
            }
        } 
    }

    playerInNorth(playerY) {
        return playerY < 170;
    }

    playerInSouth(playerY) {
        return playerY > 330;
    }

    playerInEast(playerX) {
        return playerX > 560;
    }
    playerInWest(playerX) {
        return playerX < 160;
    }

    closeArena() {
        this.arenaIsClosed = true;

        this.closePaths();
        this.placeBoss();
    }

    closePaths() {
        const coordinates = {};
        coordinates.x = 320 + 64 + this.x;
        coordinates.y = 160 + this.y - 16;

        this.northPath = new Phaser.GameObjects.Container(this.scene, coordinates.x, coordinates.y);

        this.doorNA = new Phaser.GameObjects.Sprite(this.scene, -16, 0, "spike_trap", 0);
        this.northPath.add(this.doorNA);

        this.doorNB = new Phaser.GameObjects.Sprite(this.scene, 16, 0, "spike_trap", 0);
        this.northPath.add(this.doorNB);

        this.northPath.setSize(this.doorNA.width + this.doorNB.width, this.doorNA.height);
        this.northPath.physicsContainer = this.scene.matter.add.gameObject(this.northPath);

        this.northPath.physicsContainer.setStatic(true);
        this.northPath.physicsContainer.setFixedRotation();

        this.scene.add.existing(this.northPath);

        coordinates.y = 352 + this.y + 16;

        this.southPath = new Phaser.GameObjects.Container(this.scene, coordinates.x, coordinates.y);

        this.doorSA = new Phaser.GameObjects.Sprite(this.scene, -16, 0, "spike_trap", 0);
        this.southPath.add(this.doorSA);

        this.doorSB = new Phaser.GameObjects.Sprite(this.scene, 16, 0, "spike_trap", 0);
        this.southPath.add(this.doorSB);

        this.southPath.setSize(this.doorSA.width + this.doorSB.width, this.doorSA.height);
        this.southPath.physicsContainer = this.scene.matter.add.gameObject(this.southPath);

        this.southPath.physicsContainer.setStatic(true);
        this.southPath.physicsContainer.setFixedRotation();

        this.scene.add.existing(this.southPath);

        this.doorNA.play("spikeIn");
        this.doorNB.play("spikeIn");
        this.doorSA.play("spikeIn");
        this.doorSB.play("spikeIn");
    }


    openArena() {
        this.doorNA.play("spikeOut");
        this.doorNB.play("spikeOut");
        this.doorSA.play("spikeOut");
        this.doorSB.play("spikeOut");

        this.southPath.physicsContainer.setSensor(true);
        this.northPath.physicsContainer.setSensor(true);

        this.arenaIsClosed = false;

        this.openDoors();
        this.cleared = true;
    }

    desactivate() {
        super.desactivate();

        if(this.type === RoomTypes.BOSS){
            this.scene.removeUpdateable(this)
        }
        
      }
}
