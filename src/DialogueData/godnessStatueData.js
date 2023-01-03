import Answer from "./answer";
import Message from "./message";

/**
 * Clase que contiene los datos los dialogos de la estatua de la diosa
 */
export default class godnessStatueData {

    constructor() {
        //Default values for all msg. This could vary between the messages
        const answerType = "medium";
        const answerScale = 0.75;
        const image = "bow_ss";
        const frame = 2;
        const imageScale = 0.8;
        const name = "Godness";
        const nameTextureType = "large";
        const nameTextureScale = 0.9;

        let id = 0;
        let answers = new Array();
        this.messages = new Array();

        //Primer Mensaje
        answers.push(new Answer("Meditar", "shop", -1));
        answers.push(new Answer("Marcharte", "goto", -1));

        let txt = "(Sientes una presencia reconfortante en tu mente)";
        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

    }
}