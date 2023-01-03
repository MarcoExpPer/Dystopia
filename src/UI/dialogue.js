import Phaser from 'phaser'
import Button from './basicUI/button';
import RectangleAndText from './basicUI/rectangleAndText';
import SquareAndImage from './basicUI/squareAndImage';
import UIutils from './uiutils';
/**
 * Clase que dibuja un gran cuadro de dialogo y ordena el icono de quien habla y el rectangulo con su nombre
 * Tambien maneja los datos de la conversacion de un npc y las respuestas del jugador
 */
export default class Dialogue extends Phaser.GameObjects.Container {

  /**
* @param {Phaser.Scene} scene Escena a la que pertenece el dialogo
* @param {number} x Coordenada X del dialogo
* @param {number} y Coordenada Y del dialogo
* @param {string} color Color of the textures that are going to be used
* @param {dialogueData} dialogueData Data of the dialogue that is going to be shown. It contains the possible messages and answers
* @param {sourceDialogueRef} sourceRef Referencia al actor que contiene el dialogo para avisarle cuando este se ha terminado
* @param {number} fontSize Tamaño de la font del texto, si no se pasa, el tamaño se fijara automaticamente para entrar en la caja de dialogo
*/

  constructor(scene, x, y, color, dialogueData, fontSize = 100) {
    super(scene, x, y);
    this.messages = dialogueData.messages;
    this.color = color;
    this.fontSize = fontSize;
    this.sourceRef = scene;
    this.buttons = new Array();

    this.utils = new UIutils();

    //Fondo grande del dialogo
    this.background = new Phaser.GameObjects.Image(scene, 225, 100, color + "_dialogue");
    this.add(this.background);

    //Nombre de quien esta hablando
    this.rectangleAndText = new RectangleAndText(scene, 0, 10, color, this.messages[0].nameTextureType,
      this.messages[0].nameTextureScale, this.messages[0].name);
    this.add(this.rectangleAndText);

    //Imagen de quien esta hablando
    this.squareAndImage = new SquareAndImage(scene, -125, 10, color, "square", this.messages[0].imageScale,
      this.messages[0].image, this.messages[0].frame)
    this.add(this.squareAndImage);

    //Texto de lo que dice quien esta hablando
    this.text = new Phaser.GameObjects.Text(scene, -135, 45, " ",
      { color: this.rectangleAndText.fontColor, align: "left", fontFamily: "monospace" })
      .setOrigin(0, 0)
      .setWordWrapWidth(this.background.width - this.background.width / 3.5, true)
      .setFontSize(fontSize);

    this.add(this.text);
    this.utils.autofitTextHeight(this.text, this.background, 1, this.fontSize);

    //Prepare all the answers that will be used during this dialogue
    this.prepareListeners()

    this.setVisible(false);
    this.setActive(false);
  }

  typewriteText(newText) {
    const textSpeed = this.scene.registry.values.textSpeed;

    if (this.typewriteTimer !== undefined) this.typewriteTimer.remove(false);

    if (textSpeed !== 0) {
      this.text.text = "";
      const length = newText.length;
      let i = 0;
      this.typewriteTimer = this.scene.time.addEvent({
        callback: () => {
          this.text.text += newText[i];
          ++i;
        },
        repeat: length - 1,
        delay: textSpeed
      })
    } else
      this.text.text = newText;
  }

  //Prepara las funciones a ejecutar si existen
  prepareListeners() {
    this.messages.forEach(message => {
      if (message.hasAnswers === true) {
        message.answers.forEach(answer => {
          switch (answer.onSelection) {
            case "goto":
              answer.onSelection = this.gotoMessage.bind(this, answer.parameters);
              break;
            case "shop":
              answer.onSelection = this.scene.openStatueShop.bind(this.scene);
              break;
            case "goToDungeon":
              answer.onSelection = this.scene.goToDungeon.bind(this.scene, answer.parameters);
              break;
            case "custome":
              answer.onSelection = this.scene.openCustomeMenu.bind(this.scene);
              break;
          }
        })
      }
    });
  }

  //inicializa el dialogo con el primer mensaje
  initMessages() {
    this.gotoMessage(0);
    this.setVisible(true);
    this.setActive(true);

  }

  //Prepara el mensaje idx o termina el dialogo si recibe -1
  gotoMessage(idx) {
    if (idx === -1 || idx+1 > this.messages.length) {
      this.endDialogue();

    } else {
      this.idx = idx;
      this.utils.autofitTextHeight(this.text, this.background, 1, this.fontSize);
      this.typewriteText(this.messages[idx].text);

      if (this.messages[idx].hasAnswers === true) {
        this.addButtons(idx);
        this.text.setWordWrapWidth(this.background.width - this.background.width / 3.5, true)
      } else {
        this.ClickAndSkip(idx);
        this.text.setWordWrapWidth(this.background.width - this.background.width /10, true)
      }
    }
  }

  //Execute the end of this dialogue
  endDialogue() {
    if (this.typewriteTimer !== undefined) this.typewriteTimer.remove(false);

    this.sourceRef.onEnd();
    this.hideDialogue();
  }
  //Hides the dialogue and make it unable to be interacted with, but doesnt tell the sourceRef
  hideDialogue() {
    this.setVisible(false);
    this.setActive(false);
  }

  ClickAndSkip(idx) {
    this.executeToSkip = {
      select: function(){},
      unselect: function(){},
      execute: this.gotoMessage.bind(this, this.messages[idx].id + 1)
    };

    this.scene.selectables = new Array();
    this.scene.selectables.push([this.executeToSkip]);

    this.scene.row = 0;
    this.scene.col = 0;
    this.scene.select(0, 0);
  }

  skipText(){
    if (this.typewriteTimer !== undefined) this.typewriteTimer.remove(false);

    this.text.text = this.messages[this.idx].text;
  }
  //Añade los botones y los coloca donde deben estar
  addButtons(idx) {
    this.idx = idx;
    this.startingY = 55;

    this.buttons.forEach(element => {
      element.destroy();
    })
    this.buttons = new Array();
    this.scene.selectables = new Array();

    let i = 0;
    this.messages[idx].answers.forEach(element => {
      const button = new Button(this.scene, 490, this.startingY, this.color, this.messages[this.idx].answerType, this.messages[this.idx].answerScale,
        element.text, element.onSelection, this.scene.select.bind(this.scene, i, 0));

      i += 1;

      this.scene.selectables.push([button]);

      this.buttons.push(button);
      this.startingY += 40;
    })

    this.scene.row = 0;
    this.scene.col = 0;
    this.scene.select(0, 0);

    this.add(this.buttons);
  }

}