import Message from "../message";

/**
 * Clase que contiene los datos los dialogos del blacksmith
 */
export default class DruidBuyData {

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

        let txt = "Al desbloquear al druida has desbloqueado las pociones de vida. Puedes utilizarlas desde el menu de pausa, selecciona las pociones justo debajo de tus corazones de vida. Sigue mejorandole para aumentar el numero de pociones y su potencia!";
        this.messages.push(new Message(id, txt, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale));
    }
}