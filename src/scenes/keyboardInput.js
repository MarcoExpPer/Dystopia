import BaseScene from './baseScene';

/**
 * Clase que representa la base para las escenas del juego
 */
export default class KeyboardInput extends BaseScene {

    /**
     * @param config Scene specific configuration settings.
     */
    constructor(config) {
        super(config, true);
    }

    create() {
        super.create();

        this.selectables = new Array();     //Array with all items that player will be able to select with the keyboard
        this.row;   //Index of the current active row of selectables
        this.col;   //Index of the current active col of selectables

        this.prepareKeyboardInput();
    }

    prepareKeyboardInput() {
        this.cursors.accept.on('down', this.keyboardHandler.bind(this, this.cursors.accept));
        this.cursors.attack.on('down', this.keyboardHandler.bind(this, this.cursors.attack));
        this.cursors.useItem.on('down', this.keyboardHandler.bind(this, this.cursors.useItem));
        this.cursors.up.on('down', this.keyboardHandler.bind(this, this.cursors.up));
        this.cursors.down.on('down', this.keyboardHandler.bind(this, this.cursors.down));
        this.cursors.right.on('down', this.keyboardHandler.bind(this, this.cursors.right));
        this.cursors.left.on('down', this.keyboardHandler.bind(this, this.cursors.left));
    }

    keyboardHandler(key) {
        let newRow = this.row;
        let newCol = this.col;

        switch (key) {
            case this.cursors.accept:
            case this.cursors.attack:
                this.executeSelected(newRow, newCol);

                break;
            case this.cursors.up:

                newRow = this.row - 1;

                if (newRow === -1)
                    this.upperLimit();
                else {
                    if (newCol >= this.selectables[newRow].length) {
                        newCol = this.selectables[newRow].length - 1;
                    }
                    this.select(newRow, newCol);
                }

                break;
            case this.cursors.down:

                newRow = this.row + 1;

                if (newRow === this.selectables.length)
                    this.bottomLimit();
                else {

                    if (newCol >= this.selectables[newRow].length)
                        newCol = this.selectables[newRow].length - 1;

                    this.select(newRow, newCol);
                }


                break;
            case this.cursors.right:
                newCol = this.col + 1;

                if (newCol === this.selectables[this.row].length)
                    this.rightLimit();
                else
                    this.select(this.row, newCol);

                break;
            case this.cursors.left:
                newCol = this.col - 1;

                if (newCol === -1)
                    this.leftLimit();
                else
                    this.select(this.row, newCol);

                break;

            case this.cursors.useItem:
                this.goBack();
                break;
        }
    }

    select(newRow, newCol) {

        if (this.row >= this.selectables.length)
            this.row = this.selectables.length - 1;

        if (this.col >= this.selectables[this.row].length)
            this.col = this.selectables[this.row].length - 1;

        if (newRow >= this.selectables.length)
            newRow = this.selectables.length - 1;

        if (newCol >= this.selectables[newRow].length)
            newCol = this.selectables[newRow].length - 1;

        this.selectables[this.row][this.col].unselect();

        this.row = newRow;
        this.col = newCol;
 
        this.selectables[this.row][this.col].select();

    }

    executeSelected(row, col) {
        this.selectables[row][col].execute();
    }

    upperLimit() { }

    bottomLimit() { }

    rightLimit() { }

    leftLimit() { }

    goBack() { }

    setActivable(gameObject, activate) {
        gameObject.setActive(activate);
        gameObject.setVisible(activate);
    }
}
