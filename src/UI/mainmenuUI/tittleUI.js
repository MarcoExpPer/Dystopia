import RectangleAndText from '../basicUI/rectangleAndText';

export default class TittleUI extends Phaser.GameObjects.Container {

    constructor(scene, x, y, color) {
        super(scene, x, y);

        this.moveTittleTween = null;
        this.moveTitleDuration = 2; //in seconds

        this.image = new Phaser.GameObjects.Image(this.scene, 0, -400, "tittle", 0);
        this.add(this.image);

        this.pressSpace = new RectangleAndText(this.scene, 0, -200, color, "large", 1, "Pulsa Espacio");
        this.add(this.pressSpace);

    }


    execute() {
        this.scene.moveTitleOut();
    }

    select() { }

    unselect() { }

    moveIn() {
        this.scene.setActivable(this, true);

        if (this.moveTittleTween !== null) this.moveTittleTween.remove();

        this.moveTittleTween = this.scene.tweens.addCounter({
            from: 200,
            to: 0,
            duration: this.moveTitleDuration * 1000,
            ease: Phaser.Math.Easing.Bounce.Out,
            repeat: 0,
            onUpdate: (tween) => {
                let newY = tween.getValue();
                this.pressSpace.y = -200 + newY;

                let newAlpha = newY;
                this.image.setAlpha((200 - newAlpha) / 200);
            }
        });
    }

    moveOut() {
        if (this.moveTittleTween !== null) this.moveTittleTween.remove();

        this.moveTittleTween = this.scene.tweens.addCounter({
            from: 0,
            to: 200,
            duration: this.moveTitleDuration * 1000,
            ease: Phaser.Math.Easing.Expo.Out,
            repeat: 0,
            onUpdate: (tween) => {
                let newY = tween.getValue();
                this.pressSpace.y = -200 + newY;

                let newAlpha = newY;
                this.image.setAlpha((200 - newAlpha) / 200);
            },
            onComplete: () => this.scene.setActivable(this, false)
        });
    }

}