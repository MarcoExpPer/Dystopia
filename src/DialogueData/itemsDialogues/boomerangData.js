import Answer from "../answer";
import Message from "../message";

/**
 * Clase que contiene los datos los dialogos del blacksmith
 */
export default class BoomerangData {

    constructor() {
        //Default values for all msg. This could vary between the messages
        const answerType = "large";
        const answerScale = 0.75;
        const image = "boomerang_ss";
        const frame = 0;
        const imageScale = 0.8;
        const name = "Boomerang";
        const nameTextureType = "large";
        const nameTextureScale = 0.9;

        let id = 0;
        let answers = new Array();
        this.messages = new Array();

        //Primer Mensaje
        let txt = "Has conseguido el Boomerang! Puedes usar la letra K para lanzarlo a donde mires, o mantener pulsada la K para apuntar. Golpea una vez a cada enemigo en su camino de ida, y otra vez en el camino de vuelta. Tienes que esperar unos segundos entre usos";
        
        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));

    }
}