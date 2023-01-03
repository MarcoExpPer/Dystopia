import Answer from "../answer";
import Message from "../message";

/**
 * Clase que contiene los datos los dialogos del blacksmith
 */
export default class HolySwordData {

    constructor() {
        //Default values for all msg. This could vary between the messages
        const answerType = "large";
        const answerScale = 0.75;
        const image = "holy_sword";
        const frame = 0;
        const imageScale = 0.8;
        const name = "Espada Sagrada";
        const nameTextureType = "large";
        const nameTextureScale = 0.9;

        let id = 0;
        let answers = new Array();
        this.messages = new Array();

        //Primer Mensaje
        let txt = "Has conseguido el la espada sagrada! Hasta que recibas daño o mientras tenga la vida al máximo tus ataques con espada lanzaran una espada magica en linea recta que golpeara al primer enemigo en su camino.";

        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

    }
}