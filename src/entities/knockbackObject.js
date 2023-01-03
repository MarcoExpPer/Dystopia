
 export default class KnockbackObject {

  constructor(direction, force, duration) {
    direction.x = direction.x * force;
    direction.y = direction.y * force;
    this.direction = direction;
    this.duration = duration;
  }
}
