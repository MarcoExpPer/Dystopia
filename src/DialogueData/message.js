i/**
 * Clase que contiene los datos en un intercambio/mensaje con el jugador
 */
export default class Message {

    /**
     * Constructor del jugador
     * @param {string} text Texto que aparece en el mensaje
     * @param {array} answers Respuestas posibles ante este mensaje
     * @param {string} answerType Tipo de textura que se va a usar en las respuestas. En caso de no tener respuestas, indica que se va a ejecutar cuando se clicke en el dialogo
     * @param {number} answerScale Escala de la textura de las respuestas
     * @param {string} image Imagen de la procedencia del mensaje
     * @param {number} frame Frame de la imagen en caso de ser un sprite
     * @param {number} imageScale Escala de la imagen
     * @param {string} name Nombre de la procedencia del mensaje
     * @param {string} nameTextureType Tipo de textura que se va a usar en el recuadro del nombre
     * @param {number} nameTextureScale Escala del recuadro del nombre
     */
    constructor(id, text, answers, answerType, answerScale, image, frame, imageScale, name, nameTextureType, nameTextureScale) {
        this.id = id;
        this.text = text;
        this.answers = answers;
        this.hasAnswers = answers.length !== 0;

        this.answerType = answerType;
        this.answerScale = answerScale;

        this.image = image;
        this.frame = frame;
        this.imageScale = imageScale;

        this.name = name;
        this.nameTextureType = nameTextureType;
        this.nameTextureScale = nameTextureScale;

        
    }
}