import Message from "../message";

/**
 * Clase que contiene los datos los dialogos del blacksmith
 */
export default class SmithBuyData {

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

        let txt = "Al desbloquear al herrero tu vida maxima ha aumentado. Fijate arriba a la izquierda como ahora tienes mas corazones. Sigue mejorandole para aumentar aun mas tu vida maxima!";
        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));
    }
}