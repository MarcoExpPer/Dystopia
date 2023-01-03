# Dystopia

## Captura de pantalla del juego
![image](https://user-images.githubusercontent.com/74597379/166720520-6f060f59-9fff-4a74-99fb-f1a2fe83e66e.png)

## Grupo
Dystopia

DaniUCM -> Daniel Marín Irún  
DavidLLM -> David Llanes Martín  
manuespi -> Manuel Espinosa Guerra  
Markines16 -> Marco Expósito Pérez  


## Enlace a la página pública del juego
https://daniucm.github.io/DVI-2122/

## GDD Extendido
### Género
Roguelite

### Plataforma
Página web desarrollado con Phaser

### PEGI
El juego está diseñado para una audiencia de a partir de 12 años.
PEGI 12

### Descripción
Es un juego roguelite en el cual controlas a un héroe que progresa a través de una mazmorra creada de forma procedural en la que encuentras objetos activos y pasivos que le potencian.
Las mazmorras están llenas de enemigos y al final de cada piso hay un boss.
Poco a poco y gracias a la ayuda de la diosa “nombre” el héroe destruirá el mal y restaurará la paz.

### Gameplay, Historia (lore) y contexto cultural.
El héroe empiza en la aldea, hub principal desde donde podra acceder a la mazmorra.
Al fondo de la mazmorra están todos los esbirros del villano que ha causado todo junto a algunos de sus mas fuertes seguidores.
El héroe entrara a la mazmorra, recuperará las almas que pueda y, tras morir, la diosa le revive en la aldea, donde meditando frente a la estatua de la diosa, el heroe es capaz de restaurar poco a poco la aldea, y obtener mejoras para las siguientes incursiones.

### Mecánicas y dinámicas
El héroe puede atacar con su espada para dañar a los enemigos

En la mazmorra hemos implementado los siguientes enemigos:
- Un murcielago que vuela erraticamente y cada cierto tiempo se posa, permitiendo al jugador atacarlo
- Un esqueleto que se mueve lentamente, es inmune al daño frontal que reciba y que hace mucho daño pero tarda en atacar. Si van en grupo hay que matar a todos en menos de 10s o reviven.
- Un arquero que ataca al heroe si lo tiene en rango, y que si es golpeado se transforma en una sombra y huye antes de atacar de nuevo.
- Un slime que va saltando poco a poco hacia el heroe y que al morir se divide en dos slimes mas pequeños.

Los murcielagos y los slimes aguantan un golpe con espada.
Los arqueros y esqueletos aguantan dos.

Al morir todos los enemigos pueden soltar un corazon que curará al heroe, almas o monedas que perdera al morir.
Al morir todos los enemigos de una sala, puede que suelten una llave que permite el acceso a la habitacion del boss final del piso.

- El boss final del piso es un fantasma que ataca a distancia, invoca almas que atacan al heroe y se teletransporta por la sala. Tiene ventanas de vulnerabilidad donde se le puede pegar con la espada. En principio si el jugador las aprovecha correctamente, deberia matar al boss en tres de estas ventanas. Si se extiende el combate, el boss cada vez que invoca almas invocara mas, hasta que el jugador no sea capaz de esquivar todas.

En la mazmorra tambien se puede encontrar salas especiales como:
- Una sala "tienda" donde puede intercambiar las monedas por poderosos objetos pasivos.
- Una sala "cofre" donde puede interactuar con un cofre para obtener un poderoso objeto activo.
- Una sala de "jefe" que como ya se ha mencionado, tiene una puerta especial solo accesible con la llave.
 
 Los objetos activos implementados son:
 - Un arco que permite apuntar manteniendo pulsada la K y disparar al soltarla. Tiene 30s de reutilizaación pero hace mas daño que la espada y permite disparar 3 flechas.
 - Un boomerang que permite apuntar manteniendo pulsada la K y lanzarlo al soltarla. Tiene 6s de reutilización, hace menos daño que la espada, pero puede golpear a varios enemigos una vez en la ida, y otra vez en la vuelta
 
Los objetos pasivos implementados son:
- Una espada sagrada que permite al heroe atacar con su espada a distancia siempre hasta que reciba daño o mientras tenga la vida al maximo
- Una esencia de fuego que añade a su ataque con espada y a los objetos activos una llama que hace daño
- Un corazon azul que otorga al heroe proteccion ante el primer daño que reciba en cada sala de la mazmorra.

Los objetos se han diseñado con sinergia en mente si se obtienen varios.
- La espada sagrada se volvera de fuego lanzando tambien una llama (si se combina con la esencia de fuego)
- Si recibes daño mientras tienes el corazon azul, no perderas el efecto de la espada sagrada.
- El arco dispara flechas de fuego que disparan una llama al golpear (si se combina con la esencia de fuego).
- El boomerang mientras gira dispara hasta dos llamas en direcciones aleatorias (si se combina con la esencia de fuego).

El pueblo funciona como un hub para el jugador donde puede realizar un par de acciones.

En el pueblo esta la estatua de la diosa donde el jugador revive al morir y donde puede meditar para intercambiar las almas obtenidas en la mazmorra para restaurar NPCs que le ayudaran de diversas formas:
- Un herrero que aumentara la vida maxima del jugador.
- Un druida que le dara pociones que le curan la vida cuando el jugador quiera. 
- Un sastre que permite al jugador cambiar de "clase" para tener distintos atributos basicos. Como distinta velocidad de movimiento, armadura, daño con espada o con objetos.

### Controles
El jugador controla a un héroe que se mueve con WASD y utiliza la E para interactuar, J para atacar con la espada y K para los objetos activos. Alternativamente en los menus puede usar el espacio para seleccionar un boton, a parte de la J.

## Resumen de dirección artística (con ejemplos), paleta de colores, criterios, etc.
A la hora de la dirección artística diferenciamos si nos encontramos en el Pueblo o en la Mazmorra.

### El Pueblo
Optamos por una paleta de colores más clara simbolizando el Pueblo como un lugar tranquilo y seguro. Con una interfaz principalmente verde con textos en azul

![image](https://user-images.githubusercontent.com/74597379/166728134-4b6842ab-7e82-42e1-ab77-1e26039883dd.png)
### Mazmorra
Optamos por una paleta de colores más oscura simbolizando la Mazmorra como un lugar lleno de enemigo y peligroso. Con una interfaz principalmente morada con textos en rojo

![image](https://user-images.githubusercontent.com/74597379/166728209-72813e65-ba45-4145-9130-da3fd491d5fc.png)

## Arquitectura software del juego (UML, o muy similar).

![image](https://user-images.githubusercontent.com/74597379/166725002-2f60666d-c312-44e1-9b3f-f2b534648bcc.png)

Esta imagen (que tiene las flechas de herencia al reves) era la idea inicial del juego. Pero posteriormente la parte referente a Entity y a Attributable a quedado en desuso o directamente sobrescrito ya que la herencia no era tan flexible como lo necesitabamos.

Si bien no hemos seguido ningun patron de diseño por componentes, tenemos algunas clases que funcionan parecido, principalmente el manager de la vida del jugador, que se podria directamente añadir a un enemigo y con pocos cambios en la clase del enemigo, funcionar.

## Breve descripción del sistema y plataforma de comunicación.
A lo largo de todo el proyecto, utilizamos 3 plataformas de comunicación :
- GitHub: Para llevar un control de versiones efectivo del proyecto, así como una lista de objetivos.
- Google Drive: Para almacenar las presentaciones, así como la documentación importante como el GDD.
- Whatsapp: Para la comunicación en el día a día ya que consideramos que era lo más práctico.
- 
## Informe de pruebas, con los datos extraídos y las conclusiones.
5 amigos mios han probado el juego, cada uno aislado de los demas, les he preguntado del 1 al 4 como puntuarian al juego y me han dicho que 3, que esta bien el juego pero necesitaria retoques importantes para ser mejor. Teniendo en cuenta que son amigos mios, seguramente el juego sea un 2 en realidad.

## Informe de QA

Por supuesto se han encontrado con distintos bugs raros e inesperados que se han arreglado.

- Varias personas han ignorado por completo las instrucciones de como jugar que hay en la pagina web, justo debajo del canvas del game. La mayoria tambien se han saltado los dialogos que explican como jugar, pero curiosamente cuando han hablado con un NPC, si se han molestado en leerlo.

Para arreglar esto a falta de tiempo para hacer un tutorial en condiciones, he añadido unas imagenes en el fondo de la aldea y de la primera sala de la mazmorra para que vean los controles si o si, que no se pueden saltar ya que son parte del escenario. Similar a la primera habitacion en el The binding of Isaac.

- Tambien he visto como tardaban demasiado en matar a los esqueletos, incluso cuando sabian que iban a revivir y jugaban en torno a ello. Y que era absurdamente dificil esquivar las flechas de los arqueros sin recibir daño.

La respuesta ha sido reducir la vida de los esqueletos para que se maten mas rapido, y modificar los arqueros para que ataquen mas lento, hagan menos daño, y empujen menos al jugador si le dan.

- Otra queja común ha sido las hitbox, que no se sabe bien hasta donde llega, y recibian daño sin querer. 

No he podido hacer nada mas que reducir el tamaño de la hitbox de algunos enemigos, pero considero que el problema sigue estando y nose como arreglarlo. Supongo que obtener unos sprites de los enemigos mas similares a los del heroe, que sean de un juego topdown y no uno 2d ayudaria bastante, pero es dificil encontrarlos gratuitamente.

- Tambien ocurria que el jugador obtenia bastantes mas monedas de las pretendidas, y le sobraban muchas monedas incluso despues de comprar todo lo de la tienda. 

Se redució la % de lootear monedas de todos los enemigos

- Una persona en concreto no paraba de golpearse con los pinchos que hacen las veces de puerta y recibia daño por ello. 

Originalmente me parecio que tenia sentido que hicieran daño, pero la intencion de esa puerta es ser eso, una puerta cerrada, no hacer daño al jugador. Asi que se eliminó esa caracteristica

- La unica persona que llegó hasta el boss, se estuvo quedando a distancia del boss sin atacarle, al parecer no sabia cuando podia pegarle.

Decidí añadirle al spritesheet del boss un escudo mágico que deja bastante mas claro cuando esta protegido, y cuando no. Ademas hice algo similar con los arqueros ya que sufrian del mismo problema al huir del jugador. 

En general todos tienen un background de jugar a videojuegos y aun asi les ha costado avanzar más de lo que pensaba, porque hay muchas salas y hay muy poco acceso a las curaciones, aunque siendo el primer nivel me parece correcto, cuando han probado a jugar con varias mejoras de los NPCs ha sido todo mucho mas facil.

Tambien creo que han tardado demasiado en hacer cada run. No hemos arreglado esto, pero idealmente en vez de que todas las salas tengan enemigos, en algunas habria trampas o de puzzle que idealmente tardarian menos o al menos refrescarian la experiencia haciendo que no se note que tardan mucho.
