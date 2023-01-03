import Answer from "../answer";
import Message from "../message";

/**
 * Clase que contiene los datos los dialogos del blacksmith
 */
export default class FireEssenceData {

    constructor() {
        //Default values for all msg. This could vary between the messages
        const answerType = "large";
        const answerScale = 0.75;
        const image = "small_fire_loop";
        const frame = 2;
        const imageScale = 0.8;
        const name = "Esencia de Fuego";
        const nameTextureType = "large";
        const nameTextureScale = 0.9;

        let id = 0;
        let answers = new Array();
        this.messages = new Array();

        //Primer Mensaje
        let txt = "Has conseguido la Esencia de Fuego! Tu espada y tus objetos ahora estan imbuidos en fuego haciendo daño extra en el tiempo.";

        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

    }
}