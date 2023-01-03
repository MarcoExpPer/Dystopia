
export default class OptionsUtils {

    constructor(scene = null) {this.scene = scene }


    toggleChestAnimation(saveData = null) {
        if (saveData !== null)
            return saveData.chestAnimations = !saveData.chestAnimations;
        else
            return this.scene.registry.values.chestAnimations = !this.scene.registry.values.chestAnimations;
    }


    changeVolume(saveData = null, change) {
        let newVolume = change;


        if (saveData !== null) {
            newVolume += saveData.sound;
            if (newVolume < 0) newVolume = 0;
            if (newVolume >= 10) newVolume = 10;

            return saveData.sound = newVolume;
        }
        else {
            newVolume += this.scene.registry.values.sound;

            if (newVolume < 0) newVolume = 0;
            if (newVolume >= 10) newVolume = 10;

            
            return this.scene.registry.values.sound = newVolume;
        }
    }

    textSpeedIncrease(saveData = null) {
        let newValue;
        if (saveData !== null)
            newValue = saveData.textSpeed;
        else
            newValue = this.scene.registry.values.textSpeed;

        switch (newValue) {
            case 15:
                newValue = 0;
                break;
            case 35:
                newValue = 15;
                break;
            case 55:
                newValue = 35;
                break;
        }

        return this.changeTextSpeed(saveData, newValue);
    }

    textSpeedDecrease(saveData = null) {
        let newValue;
        if (saveData !== null)
            newValue = saveData.textSpeed;
        else
            newValue = this.scene.registry.values.textSpeed;

        switch (newValue) {
            case 0:
                newValue = 15;
                break;
            case 15:
                newValue = 35;
                break;
            case 35:
                newValue = 55;
                break;
        }

        return this.changeTextSpeed(saveData, newValue);
    }

    changeTextSpeed(saveData, newValue) {
        if (saveData !== null)
            saveData.textSpeed = newValue;
        else
        this.scene.registry.values.textSpeed = newValue;

        return this.translateTextSpeed(newValue);
    }

    translateTextSpeed(data) {
        switch (data) {
            case 0:
                return "instantaneo";
            case 15:
                return "rapido";
            case 35:
                return "normal";
            case 55:
                return "lento";
        }
    }

    toogleFullScreen(scene) {
        let texture = "tick";
        if (scene.scale.isFullscreen)
            scene.scale.stopFullscreen();
        else {
            scene.scale.startFullscreen();
            texture = "x";
        }

        return texture;
    }
}