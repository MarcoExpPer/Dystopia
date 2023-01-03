import Answer from "../answer";
import Message from "../message";

/**
 * Clase que contiene los datos los dialogos del blacksmith
 */
export default class bowData {

    constructor() {
        //Default values for all msg. This could vary between the messages
        const answerType = "large";
        const answerScale = 0.75;
        const image = "bow_ss";
        const frame = 0;
        const imageScale = 0.8;
        const name = "Arco";
        const nameTextureType = "large";
        const nameTextureScale = 0.9;

        let id = 0;
        let answers = new Array();
        this.messages = new Array();

        //Primer Mensaje
        let txt = "Has conseguido el Arco! Puedes usar la letra K para disparar flechas a donde mires, o mantener pulsada la K para apuntar. Recargas 3 flechas cada 30 segundos.";

        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

    }
}