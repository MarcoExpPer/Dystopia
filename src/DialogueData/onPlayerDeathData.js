import Answer from "./answer";
import Message from "./message";

/**
 * Clase que contiene los datos los dialogos del blacksmith
 */
export default class onPlayerDeathData {

    constructor() {
        //Default values for all msg. This could vary between the messages
        const answerType = "large";
        const answerScale = 0.8;
        const image = "bow_ss";
        const frame = 1;
        const imageScale = 0.8;
        const name = "Godness";
        const nameTextureType = "large";
        const nameTextureScale = 0.9;

        let id = 0;
        let answers = new Array();
        this.messages = new Array();

        //Primer Mensaje
        let txt = "Aun no es tu momento, debes continuar. ";
        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

    }
}