
export default class DruidLevelingData  {


  constructor() {}


  //Returns the number of potions that lvl parameter gives
  getPotions(lvl) {
    switch(lvl){
      case 0:
        return 0;
      case 1:
      case 2:
        return 1;
      case 3:
      case 4:
      case 5:
        return 2;
      case 6:
      case 7:
      case 8:
      case 9:
        return 3;
      case 10:
        return 4;
    }
  }

  //Returns the potion potency that lvl parameter gives
  getPotionPotency(lvl) {
    switch(lvl){
      case 0:
        return 0;
      case 1:
        return 8;
      case 2:
      case 3:
        return 9;
      case 4:
        return 10;
      case 5:
      case 6:
        return 11;
      case 7:
        return 12;
      case 8:
        return 13;
      case 9:
      case 10:
        return 14;
    }
  }

    //Returns the potion frame potency that lvl parameter gives
    getPotionFramePotency(lvl) {
      switch(lvl){
        case 0:
          return 0;
        case 1:
          return 40;
        case 2:
        case 3:
          return 41;
        case 4:
          return 45
        case 5:
        case 6:
          return 42;
        case 7:
          return 43;
        case 8:
          return 48;
        case 9:
        case 10:
          return 49;
      }
    }
}