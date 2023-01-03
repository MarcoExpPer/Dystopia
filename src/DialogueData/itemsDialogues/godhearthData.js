import Answer from "../answer";
import Message from "../message";

/**
 * Clase que contiene los datos los dialogos del blacksmith
 */
export default class GodHearthData {

    constructor() {
        //Default values for all msg. This could vary between the messages
        const answerType = "large";
        const answerScale = 0.75;
        const image = "hearths_ss";
        const frame = 5;
        const imageScale = 0.8;
        const name = "Corazón Divino";
        const nameTextureType = "large";
        const nameTextureScale = 0.9;

        let id = 0;
        let answers = new Array();
        this.messages = new Array();

        //Primer Mensaje
        let txt = "Has conseguido el Corazón Divino! Te protege contra el primer daño que recibas en cada sala haga el daño que haga.";

        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

    }
}