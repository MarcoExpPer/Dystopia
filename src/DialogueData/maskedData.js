import Answer from "./answer";
import Message from "./message";

/**
 * Clase que contiene los datos los dialogos del blacksmith
 */
export default class MaskedData {

    constructor() {
        //Default values for all msg. This could vary between the messages
        const answerType = "large";
        const answerScale = 0.75;
        const image = "npc_2_profile";
        const frame = 0;
        const imageScale = 0.8;
        const name = "Majora";
        const nameTextureType = "large";
        const nameTextureScale = 0.9;

        let id = 0;
        let answers = new Array();
        this.messages = new Array();

        //Primer Mensaje
        answers.push(new Answer("Si claro", "custome", 1));
        answers.push(new Answer("¿Trajes?", "goto", 1));
        answers.push(new Answer("Adios", "goto", -1));
        let txt = "¡Hey Mike! ¿Que haces aqui, donde estan los demas? Ah, sois muy parecidos. Perdí de vista al resto de la troupe y ahora tengo que cargar con los trajes que le hice a Mike. No quiero cargar mas con ellos. ¿Quieres alguno?";

        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

        //Segundo Mensaje
        id++;
        answers = new Array();
        answers.push(new Answer("(Probar trajes)", "custome", 1));
        answers.push(new Answer("Adios", "goto", -1));
        txt = "Si, soy capaz de confeccionar ropa y disfraces que te haran sentirte mas fuerte o rapido, pero nose donde esta mi equipo, solo he encuentrado un puñado de los ultimos trajes que le hice a Mike.";
        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));
    }
}