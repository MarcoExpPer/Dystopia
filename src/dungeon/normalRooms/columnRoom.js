import Archer from "../../entities/enemies/archer";
import Bat from "../../entities/enemies/bat";
import SkeletonGroup from "../../entities/enemies/skeletonGroup";
import Slime from "../../entities/enemies/slime";

import Floor from "../floor";
import Room from "../room";

/**
 * Class that represents a dungeon room
 */
export default class ColumnRoom extends Room {

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
    super.create("roomColumns")
  }

  getFurthestDoorSpanws(coordinates) {
    const player = { x: (this.scene.player.getCenter().x - this.x), y: (this.scene.player.getCenter().y - this.y) };

    let further_point0 = { distance: Phaser.Math.Distance.BetweenPoints(player, { x: coordinates[0].x, y: coordinates[0].y }), x: coordinates[0].x, y: coordinates[0].y };
    let further_point1 = { distance: Phaser.Math.Distance.BetweenPoints(player, { x: coordinates[1].x, y: coordinates[1].y }), x: coordinates[1].x, y: coordinates[1].y };

    let x = coordinates[2].x;
    let y = coordinates[2].y;

    let aux_point = { distance: Phaser.Math.Distance.BetweenPoints(player, { x: x, y: y }), x: x, y: y };

    if (aux_point.distance > further_point0.distance && aux_point.distance < further_point1.distance)
      further_point0 = aux_point;
    else if (aux_point.distance > further_point1.distance && aux_point.distance < further_point0.distance)
      further_point1 = aux_point;
    else if (aux_point.distance > further_point1.distance && aux_point.distance > further_point0.distance) {

      if (further_point1.distance > further_point0.distance)
        further_point0 = aux_point;
      else
        further_point1 = aux_point;
    }

    x = coordinates[3].x;
    y = coordinates[3].y;

    aux_point = { distance: Phaser.Math.Distance.BetweenPoints(player, { x: x, y: y }), x: x, y: y };

    if (aux_point.distance > further_point0.distance && aux_point.distance < further_point1.distance)
      further_point0 = aux_point;
    else if (aux_point.distance > further_point1.distance && aux_point.distance < further_point0.distance)
      further_point1 = aux_point;
    else if (aux_point.distance > further_point1.distance && aux_point.distance > further_point0.distance) {

      if (further_point1.distance > further_point0.distance)
        further_point0 = aux_point;
      else
        further_point1 = aux_point;
    }


    return [further_point0, further_point1];
  }


  placeEnemies() {
    let i = 1;
    let spawnPoints;
    switch (Phaser.Math.Between(0, 4)) {
      case 0: //BATS
        for (const obj of this.map.getObjectLayer('Spawn8enemies').objects) {
          this.numberOfEnemies++;
          new Bat(this.scene, this.x + obj.x + 16, this.y + obj.y - 16, this);
        }
        break;
      case 1: //SLIMES
        for (const obj of this.map.getObjectLayer('Spawn8enemies').objects) {
          this.numberOfEnemies += 3; //1 + 2
          new Slime(this.scene, this.x + obj.x + 16, this.y + obj.y, "blue", 2, this);
        }
        break;
      case 2: //SKELETONs
        let skeletonCoordinates = new Array();

        for (const obj of this.map.getObjectLayer('SpawnPairAtCenter').objects) {
          this.numberOfEnemies++;
          skeletonCoordinates.push({ x: this.x + obj.x, y: this.y + obj.y });
        }
        new SkeletonGroup(this.scene, skeletonCoordinates, this);
        break;
      case 3: //Archers
        spawnPoints = this.getFurthestDoorSpanws(this.map.getObjectLayer('SpawnAtDoors').objects);

        this.numberOfEnemies += 2;

        new Archer(this.scene, this.x + spawnPoints[0].x + 16, this.y + spawnPoints[0].y, this);
        new Archer(this.scene, this.x + spawnPoints[1].x + 16, this.y + spawnPoints[1].y, this);


        break;
      case 4: //Archers and Slimes
        spawnPoints = this.getFurthestDoorSpanws(this.map.getObjectLayer('SpawnAtDoors').objects);

        this.numberOfEnemies += 1;
        new Archer(this.scene, this.x + spawnPoints[0].x + 16, this.y + spawnPoints[0].y, this);


        for (const obj of this.map.getObjectLayer('SpawnPairAtCenter').objects) {
          this.numberOfEnemies += 7; //1 + 2 + 4
          new Slime(this.scene, this.x + obj.x + 16, this.y + obj.y, "blue", 3, this);
        }
        break;
    }
  }

  getStartingPosition() {
    const position = this.getCenter();;
    position.x -= 100;
    return position;
  }

}
