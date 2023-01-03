import Answer from "./answer";
import Message from "./message";

/**
 * Clase que contiene los datos los dialogos del blacksmith
 */
export default class SmithData {

    constructor() {
        //Default values for all msg. This could vary between the messages
        const answerType = "large";
        const answerScale = 0.75;
        const image = "npc_1_profile";
        const frame = 0;
        const imageScale = 0.8;
        const name = "Herrero";
        const nameTextureType = "large";
        const nameTextureScale = 0.9;

        let id = 0;
        let answers = new Array();
        this.messages = new Array();

        //Primer Mensaje
        answers.push(new Answer("Gracias", "goto", 1));
        answers.push(new Answer("¿Estas bien?", "goto", 2));
        answers.push(new Answer("Adios", "goto", -1));
        let txt = "Nose que hago aqui, ni donde estan mis herramientas ni nada. Lo unico que puedo hacer es arreglarte un poco la armadura para que dure mas golpes";

        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

        //Segundo Mensaje
        answers = new Array();
        answers.push(new Answer("¿Estas bien?", "goto", 2));
        answers.push(new Answer("Adios", "goto", -1));
        txt = "Es lo minimo que puedo hacer. Espero que seas capaz de rescatar a mas gente.";
        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

        //Tercer Mensaje
        answers = new Array();
        answers.push(new Answer("¿Recuerdos?", "goto", 3));
        answers.push(new Answer("Hasta luego", "goto", -1));
        txt = "La verdad es que me duele mucho la cabeza y apenas tengo recuerdos";
        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

        //Cuarto Mensaje
        answers = new Array();
        answers.push(new Answer("Lo siento", "goto", -1));
        txt = "Me acuerdo de estar con mi familia comiendo cuando todas las luces fueron devoradas por la oscuridad y... Ah, mi cabeza, perdona, no quiero pensar mas en ello";
        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

    }
}