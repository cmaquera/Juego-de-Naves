//Objetos importantes
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
//Crear el objeto de la Nave
var nave = {
	x: 100,
	y: canvas.height - 50,
	width: 50,
	height: 50,
	contador: 0
}
//creacion del objeto juego
var juego = {
	estado: 'iniciando'
};
//crear un objeto en el se muestre un mensaje
var textoRespuesta = {
	contador: -1,
	titulo: '',
	subtitulo: ''
}
//variable teclado
var teclado = {};
//creacion de un arreglo para los disparos
var disparos = [];
//creacion de un arreglo para los disparos de los enemigos
var disparosEnemigos = [];
// creacion de un arreglo que almacena los enemigos
var enemigos = [];
//Definir variables para las imagenes
var fondo,imgNave, imgEnemigo, imgLaser, imgLaserEnemigo;
//definir variables para los sonidos
var audMuerteNave, audMuerteEnemigo, audFin, audLaser, audLaserEnemigo;

//Definicion de funciones
function LoadMedia(){
	//cargamos las imagenes
	imgNave = new Image();
	imgNave.src = 'recursos/nave.png';
	imgEnemigo = new Image();
	imgEnemigo.src = 'recursos/enemigo.png';
	imgLaser = new Image();
	imgLaser.src = 'recursos/laser.png';
	imgLaserEnemigo = new Image();
	imgLaserEnemigo.src = 'recursos/laserEnemigo.png';
	fondo = new Image();
	fondo.src = 'recursos/space.jpg';

	//cargamos los audios
	audLaser = document.createElement('audio');
	document.body.appendChild(audLaser);
	audLaser.setAttribute('src','recursos/laserNave.wav');

	audLaserEnemigo = document.createElement('audio');
	document.body.appendChild(audLaserEnemigo);
	audLaserEnemigo.setAttribute('src', 'recursos/laserEnemigo.wav');
	
	audMuerteNave = document.createElement('audio');
	document.body.appendChild(audMuerteNave);
	audMuerteNave .setAttribute('src', 'recursos/muerteNave.wav');
	
	audMuerteEnemigo = document.createElement('audio');
	document.body.appendChild(audMuerteEnemigo);
	audMuerteEnemigo.setAttribute('src', 'recursos/muerteEnemigo.wav');

	audFin = document.createElement('audio');
	document.body.appendChild(audFin);
	audFin.setAttribute('src', 'recursos/finJuego.wav');


	fondo.onload = function(){
		var intervalo = window.setInterval(frameLoop,1000/60);
		
		imgEnemigo.onload = function(){
			var intervalo = window.setInterval(frameLoop,1000/20);
		}
		imgNave.onload = function(){
			var intervalo = window.setInterval(frameLoop,1000/20);
		}
		imgLaser.onload = function(){
			var intervalo = window.setInterval(frameLoop,1000/20);
		}
		imgLaserEnemigo.onload = function(){
			var intervalo = window.setInterval(frameLoop,1000/20);
		}
	}

}
//funcion para mostrar lo enemigos en el canvas
function dibujarEnemigos(){
	for(var i in enemigos){
		var enemigo = enemigos[i];
		//ctx.save();
		if(enemigo.estado == 'vivo') ctx.fillStyle = 'red';
		if(enemigo.estado == 'muerto') ctx.fillStyle = 'black';
		ctx.drawImage(imgEnemigo,enemigo.x,enemigo.y,enemigo.width,enemigo.height);
		//ctx.fillRect(enemigo.x,enemigo.y,enemigo.width,enemigo.height);
		//ctx.restore(); 
	}
}
//mostrar la imagene en la pagina
function dibujarFondo(){
	ctx.drawImage(fondo,0,0);
}
//funcion pata dibujar nave
function dibujarNave(){
	//ctx.save();//guardar la informacion del contexto
	ctx.fillStyle= 'white';
	ctx.drawImage(imgNave, nave.x, nave.y, nave.width, nave.height);
	//ctx.fillRect(nave.x, nave.y, nave.width, nave.height); //pintamos la nave
	//ctx.restore(); //restaurar la informacion del contexto

}
//funcion de los eventos del teclado
function agregarEventosTeclado(){
	agregarEventos(document, "keydown", function(e){
		//ponemos en true la tecla presionada
		teclado[e.keyCode] = true;
		console.log(e.keyCode);
	});
	agregarEventos(document, "keyup", function(e){
		//ponemos en falso la tecla dejo de se presionada
		teclado[e.keyCode] = false;
	});
	function agregarEventos(elemento,nombreEvento, funcion){
		if(elemento.addEventListener){
			//Navegadores de verdad
			elemento = addEventListener(nombreEvento, funcion, false);
		}
		else if(elemento.attachEvent){
			//Interner explorer :(
			elemento.attachEvent(nombreEvento, funcion);
		}
	}
}
//funcion para mover la nave en el canavas
function moverNave(){
	if(teclado[37]){
		//movimiento a la izquierda
		nave.x -= 6;
		if(nave.x < 0) nave.x = 0; //definimos limites
	}
	if(teclado[39]){
		//movimiento a la derecha
		var limite = canvas.width - nave.width; //de finimos el limite
		nave.x += 6;
		if(nave.x > limite) nave.x = limite; //definimos limites
	}
	if(teclado[32]){
		//controlar los disparos
		if(!teclado.fire){
			fire();
			teclado.fire = true;
		}
	}
	else teclado.fire = false;
	if(nave.estado == 'hit'){
		nave.contador++;
		if(nave.contador >= 20){
			nave.contador = 0;
			nave.estado = 'muerto';
			juego.estado = 'perdido';
			textoRespuesta.titulo = 'Game Over';
			textoRespuesta.subtitulo = 'Presiona la tecla R para continuar';
			textoRespuesta.contador = 0;
		}
	}
}
//funcion para mover los dsiparos de los enemigos
function moverDisparosEnemigos(){
	for(var i in disparosEnemigos){
		var disparo = disparosEnemigos[i];
		disparo.y += 3; 
	}
	disparosEnemigos = disparosEnemigos.filter(function(disparo){
		return disparo.y < canvas.height;
	});
}
//funcion para que los enemigos disparen
function dibujarDisparosEnemigos(){
	for(var i in disparosEnemigos){
		var disparo = disparosEnemigos[i];
		//ctx.save();
		ctx.fillStyle = 'yellow';
		//ctx.fillRect(disparo.x, disparo.y, disparo.width, disparo.height);
		ctx.drawImage(imgLaserEnemigo, disparo.x,disparo.y  + 45, disparo.width, disparo.height);
		//ctx.restore();

	}
}
//funcion para actualizar las naves enemigas
function actualizaEnemigos(){
	function agregarDisparosEnemigos(enemigo){
		return {
			x: enemigo.x,
			y: enemigo.y,
			width: 10,
			height: 33,
			contador: 0
		}
	}

	if(juego.estado == 'iniciando'){
		for(var i = 0; i < 10; i++){
			enemigos.push({
				x: 10 + (i*50),
				y: 10,
				height: 40,
				width: 40,
				estado: 'vivo',
				contador: 0
			});
		}
		juego.estado = 'jugando';
	}
	//algoritmo para que los ememigos varin su posicion de 1 a -1 y viseversa
	for(var i in enemigos){
		var enemigo = enemigos[i];
		if(!enemigo) continue;
		if(enemigo && enemigo.estado == 'vivo'){
			enemigo.contador++;
			enemigo.x += Math.sin(enemigo.contador * Math.PI / 90)*5;
			//numero aleatorio de diparos enemigos	
			if(aleatorio(0, enemigos.length * 10) == 4){
				//agregamos disparos
				audLaserEnemigo.pause();
				audLaserEnemigo.currentTime = 0;
				audLaserEnemigo.play();
				disparosEnemigos.push(agregarDisparosEnemigos(enemigo));
			}
		}
		//canbiamos el estado de los enemigos si existe la colicion
		if(enemigo && enemigo.estado == 'hit'){
			enemigo.contador++;
			if(enemigo.contador >= 20){
				enemigo.estado = 'muerto';
				enemigo.contador = 0;
			}
		}
	}
	//filtramos a los enemigos
	enemigos = enemigos.filter(function(enemigo){
		if(enemigo && enemigo.estado !=  'muerto') return true;
		return false;
	});
}
//funcion para mover los disparos
function moverDisparos(){
	for(var i in disparos){
		var disparo = disparos[i];
		disparo.y -= 2;
	}
	disparos = disparos.filter(function(disparo){
		return disparo.y > 0;
	});
}
// creacion del disparo
function fire (){
	//audio del disparo
	audLaser.pause();
	audLaser.currentTime = 0;
	audLaser.play();
	disparos.push({
		x : nave.x + 20,
		y : nave.y - 10,
		width : 10,
		height : 30
	});
}
//funcion para mostrar los disparos
function dibujarDisparos(){
	//ctx.save();
	ctx.fillStyle = 'white';
	for(var i in disparos){
		var disparo = disparos[i];
		ctx.drawImage(imgLaser,disparo.x, disparo.y, disparo.width, disparo.height);
		//ctx.fillRect(disparo.x, disparo.y, disparo.width, disparo.height);
	}
	//ctx.restore();
}
function dibujaTexto(){
	if(textoRespuesta.contador == -1) return;
	var alpha = textoRespuesta.contador/50.0;
	if(alpha > 1){
		for(var i in enemigos){
			delete enemigos[i];
		}
	}
	ctx.save();
	ctx.globalAlpha = alpha;
	if(juego.estado == 'perdido'){
		ctx.fillStyle = 'white';
		ctx.font = 'Bold 40pt Arial';
		ctx.fillText(textoRespuesta.titulo, 140,200);
		ctx.font = '20pt Arial';
		ctx.fillText(textoRespuesta.subtitulo, 190,250);
	}
	if(juego.estado == 'victoria'){
		ctx.fillStyle = 'white';
		ctx.font = 'Bold 40pt Arial';
		ctx.fillText(textoRespuesta.titulo, 140,200);
		ctx.font = '20pt Arial';
		ctx.fillText(textoRespuesta.subtitulo, 190,250);
	}
}
function actualzarEstadoJuego(){
	if(juego.estado == 'jugando' && enemigos.length == 0){
		juego.estado = 'victoria';
		textoRespuesta.titulo = 'Derrotaste a los enemigos';
		textoRespuesta.subtitulo = 'Presiona la tecla R para reiniciar';
		textoRespuesta.contador = 0;
	}
	if(textoRespuesta.contador >= 0){
		textoRespuesta.contador++;
	}
	if((juego.estado == 'perdido' || juego.estado == 'victoria') && teclado[82]){
		juego.estado = 'iniciando';
		nave.estado = 'vivo';
		textoRespuesta.contador = -1;
	}
}
//funcion para detectar coliciones - logica
function hit(a,b){
	var hit = false;
	if(b.x + b.width >= a.x && b.x < a.x + a.width){
		if(b.y + b.height >= a.y && b.y < a.y + a.height){
			hit = true;
		}
	}
	if(b.x <= a.x && b.x + b.width >= a.x + a.width){
		if(b.y <= a.y && b.y + b.height >= a.y + a.height){
			hit = true;
		}
	}
	if(a.x <= b.x && a.x + a.width >= b.x + b.width){
		if(a.y <= b.y && a.y + a.height >= b.y + b.height){
			hit = true;
		}
	}

	return hit;
}
//funcion para verefica si hay o no hay colicion 
function verificarContacto(){
	for(var i in disparos){
		var disparo = disparos[i];
		for(j in enemigos){
			var enemigo = enemigos[j];
			if(hit(disparo,enemigo)){
				//sonido de muerte enemigo
				audMuerteEnemigo.pause();
				audMuerteEnemigo.currentTime = 0;
				audMuerteEnemigo.play();
				enemigo.estado = 'hit';
				enemigo.contador = 0;
			}
		}
	}
	//verificar en si hay contacto del disparo enemiga
	for(var i in disparosEnemigos){
		var disparo = disparosEnemigos[i];
		if(hit(disparo,nave)){
			//sonido muete de la nave
			audMuerteNave.play();
			nave.estado = 'hit';
			console.log('contacto');
		}
	}
}
//funcion con el algoritmo de numeros aleatorios
function aleatorio(inferior,superior){
	var posibilidades = superior - inferior;
	var a = Math.random() * posibilidades;
	a = Math.floor(a);
	return parseInt(inferior) + a;
}
//actualizar los frames
function frameLoop(){
	actualzarEstadoJuego();
	moverNave();
	moverDisparos();
	moverDisparosEnemigos();
	dibujarFondo();
	verificarContacto();
	actualizaEnemigos();
	dibujarEnemigos();
	dibujarDisparosEnemigos();
	dibujarDisparos();
	dibujaTexto();
	dibujarNave();
}

//ejecucion de funciones
LoadMedia();
agregarEventosTeclado();