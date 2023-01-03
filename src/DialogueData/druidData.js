import Answer from "./answer";
import Message from "./message";

/**
 * Clase que contiene los datos los dialogos del druida
 */
export default class DruidData {

    constructor() {
        //Default values for all msg. This could vary between the messages
        const answerType = "large";
        const answerScale = 0.75;
        const image = "npc_3_profile";
        const frame = 0;
        const imageScale = 0.8;
        const name = "Druida";
        const nameTextureType = "large";
        const nameTextureScale = 0.9;

        let id = 0;
        let answers = new Array();
        this.messages = new Array();

        //Primer Mensaje
        answers.push(new Answer("Genial", "goto", 1));
        answers.push(new Answer("¿Que haces aqui?", "goto", 2));
        answers.push(new Answer("(Alejarte)", "goto", -1));
        let txt = "Oh, al fin encuentro a alguien. Toma jovenzuelo, unas pociones magicas que he hecho con setas del bosque. La primera es gratis";

        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

        //Segundo Mensaje
        id++;
        answers = new Array();
        answers.push(new Answer("Gracias", "goto", -1));
        txt = "Si te las tomas cuando estes débil recuperarás las fuerzas. Por desgracia no tengo muchos materiales para hacer mas o mejorarlas";
        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

        //Tercer Mensaje
        id++;
        answers = new Array();
        answers.push(new Answer("Adios", "goto", -1));
        txt = "Vaya modales niño. Vengo de dar un paseo por el bosque. Dejame descansar en paz";
        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

    }
}