/**
 * Clase que contiene los datos de una respuesta en un dialogo
 */
export default class Answer {

    /**
     * @param {string} text Texto que aparece en la respuesta
     * @param {function} onSelection funcion a ejecutar en caso de escoger esta respuesta. 
     * Puede tener el valor de "goto" como string para que la funcion sea ir a otro mensaje o terminar la conversacion
     * @param {wildcard} parameters Parametros que se pasan a la funcion onSelection.
     */
    constructor(text, onSelection, parameters) {
        this.text = text;
        this.onSelection = onSelection;
        this.parameters = parameters;
    }
}