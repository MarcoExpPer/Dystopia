/**
 * This class acts as a sensor without visuals or collisions
 */
export default class Sensor extends Phaser.GameObjects.Rectangle {

  /**
   * 
   * @param {Phaser.Scene} scene The Scene to which this Sensor belongs
   * @param {number} x The horizontal position of this Sensor in the world
   * @param {number} y The vertical position of this Sensor in the world
   * @param {number} width The width of the rectangle
   * @param {number} height The height of the rectangle
   */
  constructor(scene, x, y, width, height) {
    super(scene, x, y, width, height);
    this.scene.add.existing(this);
    this.scene.matter.add.gameObject(this, {isSensor: true});
  }

  /**
   * This method will be called by default on collision with other object
   * To set a custom handler use setHandler method
   */
  handleCollisionWith() {}

  /**
   * Sets the function to execute when a collision occurs
   * @param {Function} handler The function that should handle the collisions
   * @param context The context to which to bind the execution of the handler
   */
  setHandler(handler, context) {
    this.handleCollisionWith = handler.bind(context);
  }
}
