/**
 * Class that creates floor distribution 
 */
 export default class FloorPlanner {

  constructor() {
    this.maxrooms = 15;
    this.minrooms = 7;

    this.started = false;

    this.floorplanCount;
    this.floorplan = new Array(100);
    this.parents = new Array(100);
    this.specialRooms;

    this.queue;
    this.failed;
    this.deadEnds;
    this.potentialDeadEnds;
    this.finalDeadEnds;
  }

  isRunning() {
    return this.started;
  }

  getPlan() {
    return { rooms: this.floorplan, specialRooms: this.specialRooms, deadEnds: this.finalDeadEnds }
  }

  run(steps = false) {
    this.started = true;
    this.floorplan.fill(0);
    this.parents.fill(0);
    this.floorplanCount = 0;
    this.queue = [];
    this.failed = [];
    this.deadEnds = [];
    this.potentialDeadEnds = [];
    this.finalDeadEnds = [];
    this.visit(55, 1);

    if (!steps) {
      this.loop();
      return this.getPlan();
    }
  }

  loop() {
    while (this.isRunning()) {
      this.step();
    }
  }

  visit(n, chance = 0.5) {
    if(Math.random() > chance) {
      this.failed.push(n);
      return false;
    }
    this.queue.push(n);
    this.floorplan[n] = 1; // Mark as planned to avoid placing neighbors
    return true;
  }

  expand(n) {
    let created = false;

    // Get valid adjacent positions
    let adj = this.getAdjacents(n, true);

    if (adj.length == 0) {
      // If no neighbor room viable, add as deadend
      this.deadEnds.push(n);
      return;
    }

    // Visit valid adjacent positions
    for (let idx in adj) {
      created = created | this.visit(adj[idx]);
    }

    // If no neighbor room placed, add as posible deadend
    if (!created) {
      this.potentialDeadEnds.push(n);
    }
  }

  laxExpand() {
    let adjStart = this.getAdjacents(55);
    // Expand starting cell neighbors if posible
    while (adjStart.length) {
      while (adjStart.length) {
        if (this.visit(this.pickRandom(adjStart), 0.8)) return true;
      }
      adjStart = this.getAdjacents(55);
    }

    // Expand chance failed cells if posible
    while (this.failed.length) {
      let n = this.failed.shift();
      if (this.isValid(n) && this.visit(n, 0.95)) return true;
    }

    return false;
  }

  step() {
    if (this.started) {
      if (this.queue.length > 0) {
        // Get first queued cell and process it
        let n = this.queue.shift();
        this.floorplanCount += 1;

        // TODO: check if more deadends will be needed, number of rooms should be less than (maxrooms - 2 * (requiredDeadEnds - existingDeadEnds))
        if (this.floorplanCount < this.maxrooms) {
          this.expand(n);
        } else {
          this.potentialDeadEnds.push(n);
          let parent;
          while (this.queue.length) {
            n = this.queue.shift();
            this.floorplan[n] = 0;
            parent = this.parents[n];
            if (this.countAdjacent(parent) < 2) this.potentialDeadEnds.push(parent);
          }
        }
      } else {
        if (this.floorplanCount < this.minrooms) {
          if (this.laxExpand()) return; // If not enough rooms, retry failed rooms
          let failedCount = this.floorplanCount
          console.log('Failed to place ' + this.minrooms + ' rooms. Only placed ' + failedCount);
          this.started = false;
          return;
        }

        // If not enough deadends, retry failed rooms
        if ((this.deadEnds.length) < 3 && this.floorplanCount < this.maxrooms && this.laxExpand()) return;
        // TODO: If required, iterare over potential deadends and expand those with at least 2 viable neighbors

        this.started = false;
        let deadends = [];
        for (const r of this.potentialDeadEnds) {
          if (this.countAdjacent(r) < 2 && r != 55) deadends.push(r);
        }
        for (const r of this.deadEnds) {
          deadends.push(r);
        }
        for (const r of deadends) {
          this.finalDeadEnds.push(r);
        }

        let bossRoom = deadends.pop();
        let rewardRoom = this.pickRandom(deadends);
        let shopRoom = this.pickRandom(deadends);

        if (!rewardRoom || !shopRoom) {
          console.log(bossRoom + " " + rewardRoom + " " + shopRoom);
          console.log('Failed to place special room');
        }
        this.specialRooms = { boss: bossRoom, reward: rewardRoom, shop: shopRoom };

        // TODO: pick secret room

        this.success = true;
        // TODO: emit event
      }
    }
  }

  pickRandom(arr) {
    return arr.splice((Math.random() * arr.length >> 0), 1)[0];
  }

  isValid(n) {
    return !this.floorplan[n] && (this.countAdjacent(n) < 2);
  }

  countAdjacent(n) {
    return this.floorplan[n - 10] + this.floorplan[n + 10] + this.floorplan[n - 1] + this.floorplan[n + 1];
  }

  getAdjacents(n, setParents = false) {
    let adj = [];
    let x = n % 10;
    
    if(x > 1 && this.isValid(n - 1)) {
      adj.push(n - 1);
      if (setParents) this.parents[n - 1] = n;
    }
    if(x < 9 && this.isValid(n + 1)) {
      adj.push(n + 1);
      if (setParents) this.parents[n + 1] = n;
    }
    if(n > 20 && this.isValid(n - 10)) {
      adj.push(n - 10);
      if (setParents) this.parents[n - 10] = n;
    }
    if(n < 90 && this.isValid(n + 10)) {
      adj.push(n + 10);
      if (setParents) this.parents[n + 10] = n;
    }

    return adj;
  }
}
