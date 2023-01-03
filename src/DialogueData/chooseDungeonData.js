import Answer from "./answer";
import Message from "./message";

/**
 * Clase que se uso para debug que ya no sirve de nada
 */
export default class chooseDungeonData {

    constructor() {
        //Default values for all msg. This could vary between the messages
        const answerType = "large";
        const answerScale = 0.75;
        const image = "bow_ss";
        const frame = 2;
        const imageScale = 0.8;
        const name = "Developers";
        const nameTextureType = "large";
        const nameTextureScale = 0.9;

        let id = 0;
        let answers = new Array();
        this.messages = new Array();

        //Primer Mensaje
        answers.push(new Answer("Procedural", "goToDungeon", null));
        answers.push(new Answer("BasicRoom", "goToDungeon", 0));
        answers.push(new Answer("Mas opciones", "goto", 1));
        let txt = "A que tipo de mazmorra quieres entrar? ";

        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

        //Segundo Mensaje
        id++;
        answers = new Array();
        answers.push(new Answer("BossRoom", "goToDungeon", 1));
        answers.push(new Answer("StartingRoom", "goToDungeon", 2));
        answers.push(new Answer("Mas opciones", "goto", 2));
        txt = "A que tipo de mazmorra quieres entrar? ";

        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

        //Tercer Mensaje
        id++;
        answers = new Array();
        answers.push(new Answer("ChestRoom", "goToDungeon", 3));
        answers.push(new Answer("ShopRoom", "goToDungeon", 4));
        answers.push(new Answer("Inicio", "goto", 0));
        txt = "A que tipo de mazmorra quieres entrar? ";

        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));
    }
}