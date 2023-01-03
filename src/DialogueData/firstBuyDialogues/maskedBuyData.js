import Message from "../message";

/**
 * Clase que contiene los datos los dialogos del blacksmith
 */
export default class MaskedBuyData {

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

        let txt = "Al desbloquear a Majora has desbloqueado los trajes. Puedes hablar con Majora en la parte inferior derecha del poblado para acceder a los disfraces. Sigue mejorando a Majora para desbloquear mas trajes!";
        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));
    }
}