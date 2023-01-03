
export default class UIutils {

    constructor() { }

    /*
    *   Text Size Utils
    */
    //Autosize the text to the background if fontSize is not defined
    autosizetext(text, background, scale, fontSize = 100) {
        if (fontSize === 100) {

            fontSize = this.autofitTextWidth(text, background, scale, fontSize);
            fontSize = this.autofitTextHeight(text, background, scale, fontSize, true);

        }
    }

    //Autofit la altura del texto
    autofitTextHeight(text, background, scale, fontSize = 100, autofit = false) {
        if (fontSize === 100 || autofit === true) {
            text.setFontSize(fontSize);

            while (text.height > (background.height * scale - background.height * scale / 20)) {
               
                fontSize = Math.floor(fontSize * .9);
                text.setFontSize(fontSize);
            }
        }
        return fontSize;
    }

    //Autofit la anchura del texto
    autofitTextWidth(text, background, scale, fontSize = 100) {
        if (fontSize === 100) {
            text.setFontSize(fontSize);

            while (text.width > (background.width * scale - background.width * scale / 30)) {
                fontSize = Math.floor(fontSize * .9);
                text.setFontSize(fontSize);
            }
        }
        return fontSize;
    }

    /*
    *   Style Utils
    */
    //Choose the color of the text
    chooseStyle(color) {
        let fontcolor;

        switch (color) {
            case "green":
                fontcolor = "#1206C7";
                break;
            case "purple":
                fontcolor = "#BA0E04";
                break;
        }

        return fontcolor;
    }

    chooseColor(isInDungeon){
        if( isInDungeon === true)
            return "purple";
        else
            return "green";
    }

    getShopChangeFontColor(){
        let fontColor = "#06C6C7";
        return fontColor;
    }

    getShopMaxFontColor(){
        let fontColor = "#069AD1";
        return fontColor;
    }
}