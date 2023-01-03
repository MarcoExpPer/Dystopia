
export default class MaskedLevelingData {


    constructor() { }

    //Returns the playerType of the corresponding masked level
    getPlayerTypeLevel(lvl) {

        if (lvl === 0)
            return 0;
        if (lvl === 1)
            return 5;
        if (lvl === 2)
            return 7;
        if (lvl === 3)
            return 1;
        if (lvl === 4)
            return 3;
        if (lvl === 5)
            return 6;
        if (lvl === 6)
            return 8;
        if (lvl === 7)
            return 2;
        if (lvl === 8)
            return 4;
    }

    //Returns the attributes of the player type id
    getPlayerStats(id) {
        let playerAttributes;

        const armor = { lowest: 1.25, low: 1, middle: 0.75, high: 0.5 };
        this.armorTypes = armor;

        const movement = { lowest: 2, low: 3, middle: 4, high: 5 };
        this.movementTypes = movement;

        const sword = { lowest: 4, low: 6, middle: 8, high: 10 };
        this.swordTypes = sword;

        const items = { lowest: 0.75, low: 1, middle: 1.25, high: 1.5 };
        this.itemTypes = items;

        switch (id) {
            case 0: //Soldadito azul verdoso.  Armadura normal. Movimiento bajo. Espada normal. Objetos bajos. 
                playerAttributes = {
                    armor: armor.middle,
                    maxSpeed: movement.low,
                    damage: sword.middle,
                    itemDamageMultiplier: items.low,
                }
                break;
            case 1: //Soldadito Amarillo.  Armadura normal. Movimiento bajo. Espada baja. Objetos normal. Soldadito azul mas enfocado a objetos
                playerAttributes = {
                    armor: armor.middle,
                    maxSpeed: movement.low,
                    damage: sword.low,
                    itemDamageMultiplier: items.middle,
                }
                break;
            case 2: //Soldadito Rojo.  Armadura normal. Movimiento normal. Espada baja. Objetos bajo. Soldadito azul mas enfocado a movimiento
                playerAttributes = {
                    armor: armor.middle,
                    maxSpeed: movement.middle,
                    damage: sword.low,
                    itemDamageMultiplier: items.low,
                }
                break;
            case 3: //Robinhood esque verde. Armadura baja. Movimiento alto. Espada muy mala. Objetos normal. Poca vida y alto movimiento para esquivar y usar objetos
                playerAttributes = {
                    armor: armor.low,
                    maxSpeed: movement.high,
                    damage: sword.lowest,
                    itemDamageMultiplier: items.middle,
                }
                break;
            case 4: //Robinhood esque morado. Armadura baja. Movimiento bajo. Espada normal. Objetos normal. Poca vida y pero daño normal
                playerAttributes = {
                    armor: armor.low,
                    maxSpeed: movement.low,
                    damage: sword.middle,
                    itemDamageMultiplier: items.middle,
                }
                break;
            case 5: //Mago rojo. Armadura muy baja, velocidad normal, Espada alta, Objetos bajo
                playerAttributes = {
                    armor: armor.lowest,
                    maxSpeed: movement.middle,
                    damage: sword.high,
                    itemDamageMultiplier: items.low,
                }
                break;
            case 6: //Mago azul. Armadura muy baja, velocidad muy baja, Espada alta, Objetos alto
                playerAttributes = {
                    armor: armor.lowest,
                    maxSpeed: movement.lowest,
                    damage: sword.high,
                    itemDamageMultiplier: items.high,
                }
                break;
            case 7: //Guerrero azul/verde. Armadura alta, velocidad muy baja, Espada normal, Objetos malos
                playerAttributes = {
                    armor: armor.high,
                    maxSpeed: movement.lowest,
                    damage: sword.middle,
                    itemDamageMultiplier: items.low,
                }
                break;
            case 8: //Guerrero rojo. Armadura alta, velocidad normal, Espada mala, Objetos muy malos
                playerAttributes = {
                    armor: armor.high,
                    maxSpeed: movement.middle,
                    damage: sword.low,
                    itemDamageMultiplier: items.lowest,
                }
                break;
        }

        playerAttributes.maxHealth = 12;
        playerAttributes.health = 12;
        playerAttributes.shield = 0;

        playerAttributes.acceleration = 0.30;
        playerAttributes.potions = { max: 0, number: 0, potency: 0 };

        return playerAttributes;
    }
}