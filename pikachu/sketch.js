let N=7;
let size=100;
let newGameButton;
let infoTextArea;
let sliderN;

let posCop;
let posRobber;
let lastClick;
let arrow = "none";

let pikachu;
let pokeball;
let caught;

let gameState;
let turn;

let MODE_AUTO;

function setup() {
	createCanvas(1000,500);
	textSize(32);
	
	infoTextArea = createElement('div');
	infoTextArea.position(10,height+50);
	
	sliderN = createSlider(2,10,6);
	sliderN.position(50,height-50);
	
	newGameButton = createButton("Nouvelle partie");
	newGameButton.mousePressed(newGame);
	newGameButton.position(230,height-50);
	
	posCop = createVector(-1,-1);
	posRobber = createVector(-1,-1);
	lastClick = createVector(-1,-1);
	
	if(int(random(10)) == 0) {
		pikachu = createImg('https://www.serebii.net/pokemongo/pokemon/shiny/025.png', '', function () {
			image(pikachu, 0, 0);
		});
	} else {
		pikachu = createImg('https://www.serebii.net/pokemongo/pokemon/025.png', '', function () {
			image(pikachu, 0, 0);
		});
	}
	pikachu.hide();
	pokeball = createImg('https://www.serebii.net/itemdex/sprites/pgl/pokeball.png', '', function () {
		image(pokeball, 0, 0);
	});
	pokeball.hide();
	caught = createImg('https://img10.androidappsapk.co/300/6/c/1/pikcachu.classic.pikachuclassic.png', '', function () {
		image(caught, 0, 0);
	});
	caught.hide();
	
	
	
	MODE_AUTO = false;
	gameState = "newGame";
}

function draw() {
	if(MODE_AUTO) {
		background(200,200,50);
	} else {
		background(150);
	}
	fill(0);
	text("Largeur = "+sliderN.value(), 50, height-70);
	text(turn,width/2,100);
	window[gameState]();
	drawGraph();
	if(gameState == "victory") {
		drawVictory();
	} else {
		drawCop();
		drawRobber();
	}
}

function drawGraph() {
	translate((width-(N-1)*size)/2,200);
	stroke(0);
	strokeWeight(2);
	// Draw edges
	for(let i=0; i<N; i++)
	{
		line(size*i,0,size*i,size);
	}
	line(0,0,(N-1)*size,0);
	line(0,size,(N-1)*size,size);
	
	// Draw loops
	noFill();
	let offset=size/6;
	let diameter=2*offset*sqrt(2);
	ellipse(-offset,-offset,diameter,diameter);
	ellipse((N-1)*size+offset,-offset,diameter,diameter);
	
	// Draw vertices
	fill(255);
	for(let i=0; i<N; i++) {
		ellipse(size*i,0,size/4,size/4);
		ellipse(size*i,size,size/4,size/4);
	}
}

function drawCop() {
	if(posCop.x >= 0) {
		fill(0,0,255);
		image(pokeball,posCop.x*size-25,posCop.y*size-25,50,50);
	}
}

function drawRobber() {
	if(posRobber.x >= 0) {
		fill(255,0,0);
		image(pikachu,posRobber.x*size-25,posRobber.y*size-40,80,80);
	}
}

function drawVictory() {
	if(posRobber.x >= 0) {
		fill(255,0,255);
		image(caught,posRobber.x*size-40,posRobber.y*size-40,80,80);
	}
}

function positionFromXY(x,y) {
	i = Math.floor(y/size+0.5);
	j = Math.floor(x/size+0.5);
	if(i>=0 && i<2 && j>=0 && j<N) {
		let dist2 = (x-size*j)**2 + (y-size*i)**2;
		if(dist2 <= (size/8)**2) {
			return [i,j];
		}
	}
	return [];
}

function mousePressed() {
	if(mouseX > width-10  && mouseX < width && mouseY > height-10 && mouseY < height) {
		MODE_AUTO = !MODE_AUTO;
		gameState = "newGame";
	}
	
	let x = mouseX - (width-(N-1)*size)/2;
	let y = mouseY - 200;
	pos = positionFromXY(x,y);
	if(pos.length > 0) {
		lastClick.y = pos[0];
		lastClick.x = pos[1];
	}
}

function keyPressed() {
	if(keyCode == UP_ARROW) {
		arrow="up";
	}
	if(keyCode == DOWN_ARROW) {
		arrow="down";
	}
	if(keyCode == LEFT_ARROW) {
		arrow="left";
	}
	if(keyCode == RIGHT_ARROW) {
		arrow="right";
	}
}

function posAfterKey(key,pos) {
	if(key == "up") {
		if(pos.y == 1) {
			return [pos.x,0];
		}
		if(pos.x == 0 || pos.x == N-1) {
			return [pos.x,pos.y];
		}
	} else if(key=="left") {
		if(pos.x > 0) {
			return [pos.x-1,pos.y];
		} else if(pos.y == 0) {
			return [pos.x, pos.y];
		}
	} else if(key == "down") {
		if(pos.y == 0) {
			return [pos.x, 1];
		}
	} else if(key == "right") {
		if(pos.x < N-1) {
			return [pos.x+1,pos.y];
		} else if(pos.y==0) {
			return [pos.x, pos.y];
		}
	}
	return [];
}

function newGame() {
	N = sliderN.value();
	lastClick.x = -1;
	lastClick.y = -1;
	arrow = "none";
	posCop.x = -1;
	posCop.y = -1;
	posRobber.x = -1;
	posRobber.y = -1;
	turn = 0;
	gameState = "chooseCopPosition";
}

function chooseCopPosition() {
	infoTextArea.elt.innerHTML = "Choisissez votre position";
	if(lastClick.x >= 0) {
		posCop.x = lastClick.x;
		posCop.y = lastClick.y;
		
		if(MODE_AUTO) {
			gameState = "chooseRobberPositionAuto";
		} else {
			gameState = "chooseRobberPositionManual";
		}
		lastClick.x = -1;
		lastClick.y = -1;
	}
}

function chooseRobberPositionManual() {
	infoTextArea.elt.innerHTML = "Choisissez la position du voleur";
	if(lastClick.x >= 0) {
		posRobber.x = lastClick.x;
		posRobber.y = lastClick.y;
		
		gameState = "copMove";
		lastClick.x = -1;
		lastClick.y = -1;
	}
}

function chooseRobberPositionAuto() {
	infoTextArea.elt.innerHTML = "Le voleur choisit sa position...";
	if(N%2 == 0) {
		posRobber.x = N-1-posCop.x;
		posRobber.y = 1-posCop.y;
	} else {
		if(posCop.x == Math.floor(N/2)) {
			if(int(random(2))==0) {
				posRobber.x = posCop.x+1;
			} else {
				posRobber.x = posCop.x-1;
			}
			posRobber.y = 1-posCop.y;
		} else {
			posRobber.x = N-1-posCop.x;
			posRobber.y = posCop.y;
		}
	}
	gameState = "copMove";
	lastClick.x = -1;
	lastClick.y = -1;
}

function possibleMove(x1,y1,x2,y2) {
	if( (x1-x2)**2 + (y1-y2)**2 == 1) {
		return true;
	}
	if(x1 == 0 && y1 == 0 && x2 == 0 && y2 == 0) {
		return true;
	}
	if(x1 == N-1 && y1 == 0 && x2 == N-1 && y2 == 0) {
		return true;
	}
	return false;
}

function copMove() {
	infoTextArea.elt.innerHTML = "À <strong>vous</strong> de jouer. Cliquez sur la case où vous souhaitez vous déplacer.";
	if(lastClick.x >= 0) {
		if(possibleMove(posCop.x,posCop.y,lastClick.x,lastClick.y)) {
			posCop.x = lastClick.x;
			posCop.y = lastClick.y;
			turn++;
			
			if(MODE_AUTO) {
				gameState = "robberMoveAuto";
			} else {
				gameState = "robberMoveManual";
			}
		}
		lastClick.x = -1;
		lastClick.y = -1;
	}
	if(arrow != "none") {
		newPos = posAfterKey(arrow, posCop);
		if(newPos.length > 0)
		{
			turn++;
			posCop.x = newPos[0];
			posCop.y = newPos[1];
			
			if(MODE_AUTO) {
				gameState = "robberMoveAuto";
			} else {
				gameState = "robberMoveManual";
			}
		}
		arrow = "none";
	}
			
	if(posCop.x == posRobber.x && posCop.y == posRobber.y) {
		gameState = "victory";
		return;
	}
}

function robberMoveManual() {
	infoTextArea.elt.innerHTML = "Où voulez-vous déplacer le voleur ?";
	if(lastClick.x >= 0) {
		if(possibleMove(posRobber.x,posRobber.y,lastClick.x,lastClick.y)) {
			posRobber.x = lastClick.x;
			posRobber.y = lastClick.y;
			gameState = "copMove";
		}
		lastClick.x = -1;
		lastClick.y = -1;
	}
	if(arrow != "none") {
		newPos = posAfterKey(arrow, posRobber);
		if(newPos.length > 0)
		{
			posRobber.x = newPos[0];
			posRobber.y = newPos[1];
			gameState = "copMove";
		}
		arrow = "none";
	}
	if(posCop.x == posRobber.x && posCop.y == posRobber.y) {
		gameState = "victory";
	}
}

function robberMoveAuto() {
	infoTextArea.elt.innerHTML = "Au tour du <strong>voleur</strong>...";
	
	if((posCop.x+posCop.y+posRobber.x+posRobber.y)%2==0) {
		if(posRobber.y == 0 && (posRobber.x == 0 || posRobber.x == N-1)) {
			// Prendre la boucle
		} else {
			if(posRobber.x < posCop.x) {
				if(posRobber.x > 0) {
					posRobber.x--;
				} else {
					posRobber.y = 1-posRobber.y;
				}
			} else {
				if(posRobber.x < N-1) {
					posRobber.x++;
				} else {
					posRobber.y = 1-posRobber.y;
				}
			}
		}
	} else {
		if(posCop.y == 1 && posRobber.y == 1)
		{
			posRobber.y = 0;
		} else if(posCop.y==0 && posRobber.y==0 && (posCop.x == posRobber.x+1 || posCop.x == posRobber.x-1)) {
			posRobber.y = 1;
		} else {
			if(posRobber.x > N-1-posCop.x) {
				if(posRobber.x == 0) {
					posRobber.y = 1-posRobber.y;
				} else {
					posRobber.x--;
				}
			} else {
				if(posRobber.x == N-1) {
					posRobber.y = 1-posRobber.y;
				} else {
					posRobber.x++;
				}
			}
		}
	}
	
	if(posCop.x == posRobber.x && posCop.y == posRobber.y) {
		gameState = "victory";
	} else {
		gameState = "copMove";
	}
}

function victory() {
	let plural = "";
	if(turn > 1) {
		plural += "s";
	}
	infoTextArea.elt.innerHTML = "<h2>Bravo, vous avez attrapé le voleur en <strong>"+turn+"</strong> tour"+plural+" !</h2>";
}