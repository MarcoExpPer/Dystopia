import AimingState from "./aimingState";
import DamagedState from "./damagedState";
import MoveState from "./moveState";
import SwordAttackState from "./swordAttackState";

export default class playerController {
  constructor(player) {
    this.player = player;

    this.states = {
      move: new MoveState(player),
      sword: new SwordAttackState(player, this),
      aim: new AimingState(player, this),
      damaged: new DamagedState(player, this)
    }

    this.transitions = {
      move: this.states["move"].getTransitionStates(),
      sword: this.states["sword"].getTransitionStates(),
      aim: this.states["aim"].getTransitionStates(),
      damaged: this.states["damaged"].getTransitionStates()
    }

    this.currentState = this.states["move"];
    this.currentState.start();
  }

  advanceStateTo(name, parameter1, parameter2) {
    let availableTransitions = this.transitions[this.currentState.getName()];

    if (availableTransitions.includes(name)) {
      this.currentState.endState();
      this.currentState = this.states[name];
      this.currentState.start(parameter1, parameter2);
    }
  }

  execute(dt) {
    if(this.player.dead === false)
      this.currentState.execute(dt);
  }
}