function main(){
	//TODO
	//BOLAS BOMBA
	//CONTADOR DE TIEMPO
	//SIN REVIVIR
	var canvas = document.getElementById("myCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight-70;
	var ctx = canvas.getContext("2d");

	//Player structure
	function Ball(x, y, ballRadius, colour, tam) {
	    this.x = x;
	    this.y = y;
	    this.ballRadius = ballRadius;
	    this.colour = colour;
	    this.tam = tam;
	    this.cola = new Array(2000);
	    this. vel = 2;
	    this.lives = 3;
	}

	var maxBallRadius = 20;
	var minBallRadius = 5;
	var maxBombRadius = 20;
	var minBombRadius = 12;

	//Apple structure
	function Apple(x, y, ballRadius, colour) {
	    this.x = x;
	    this.y = y;
	    this.ballRadius = ballRadius;
	    this.colour = colour;
	    this.nIters = Math.floor(Math.random() * 400);
	    this.dirX = 0;
	    this.dirY = 0;
	    this.vel = 2;
	    this.eaten = false;
	}

	//Used to store the coords of the player tail
	function coords(x,y){
		this.x = x;
		this.y = y;
	}

	//random color for apples
	function getRandomColor() {
	    var letters = '0123456789ABCDEF';
	    var color = '#';
	    for (var i = 0; i < 6; i++) {
	    	color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}

	//player creation
	var ball = new Ball(canvas.width/2, canvas.height/2, 10, /*getRandomColor()*/'#FB0C06', 0);

	document.getElementById("lives").innerHTML = ball.lives;
	document.getElementById("score").innerHTML = '0';

	//enemy creation
	//var enemyBall = new Ball(canvas.width/4, canvas.height/4, 10, getRandomColor(), 0);

	//apple array creation
	var i;
	var maxballs = 10;
	var maxbombs = 10;
	var balls = new Array(maxballs);
	var bombs = new Array(maxbombs);
	var color = getRandomColor();;
	for(i = 0; i < maxballs; i++){
		if((i%10)==0)
			color = getRandomColor();
		balls[i] = new Apple(Math.random() * (canvas.width - 0) + 0, Math.random() * (canvas.height - 0) + 0, Math.random() * (maxBallRadius - minBallRadius) + minBallRadius, color);
	}

	for(i = 0; i < maxbombs; i++){
		bombs[i] = new Apple(Math.random() * (canvas.width - 0) + 0, Math.random() * (canvas.height - 0) + 0, Math.random() * (maxBombRadius - minBombRadius) + minBombRadius, '#000000');
	}

	//mouse event handler
	var mouseX = 0;
	var mouseY = 0;
	document.addEventListener("mousemove", mouseMoveHandler, false);
	function mouseMoveHandler(e){
	    mouseX = e.clientX;
    	mouseY = e.clientY-70;
	}

	document.addEventListener("mousedown", mouseDownHandler, false);
	function mouseDownHandler(e){
	    ball.vel = 4;
	}

	document.addEventListener("mouseup", mouseupUpHandler, false);
	function mouseupUpHandler(e) {
	    ball.vel = 2;
	}

	//draws the objects on the screen
	function drawBall() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	    ctx.beginPath();
	    ctx.arc(ball.x, ball.y, ball.ballRadius, 0, Math.PI*2);
	    ctx.fillStyle = ball.colour;
	    ctx.fill();
	    ctx.closePath();
	    ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.ballRadius, 0, Math.PI*2);
		ctx.fillStyle = "#000000";
		ctx.stroke();
		ctx.closePath();

	    var i;

		for(i = 0; i < ball.tam; i+=4){
			ctx.beginPath();
	    	ctx.arc(ball.cola[i].x, ball.cola[i].y, ball.ballRadius-2, 0, Math.PI*2);
	    	ctx.fillStyle = ball.colour;
	    	ctx.fill();
	    	ctx.closePath();
	    	ctx.beginPath();
			ctx.arc(ball.cola[i].x, ball.cola[i].y, ball.ballRadius-2, 0, Math.PI*2);
			ctx.fillStyle = "#000000";
			ctx.stroke();
			ctx.closePath();
		}
		var winFlag = 0;
	    for(i = 0; i < maxballs; i++){
	    	if(balls[i].eaten == false){ 
	    		winFlag++;                       
			    ctx.beginPath();
			    ctx.arc(balls[i].x, balls[i].y, balls[i].ballRadius, 0, Math.PI*2);
			    ctx.fillStyle = balls[i].colour;
			    ctx.fill();
			    ctx.closePath();
			    ctx.beginPath();
			    ctx.arc(balls[i].x+balls[i].ballRadius/2*0.707, balls[i].y-balls[i].ballRadius/2*0.707, balls[i].ballRadius/3, 0, Math.PI*2);
			    ctx.fillStyle = "#ffffff";
			    ctx.fill();
			    ctx.closePath();
			    ctx.beginPath();
			    ctx.arc(balls[i].x, balls[i].y, balls[i].ballRadius, 0, Math.PI*2);
			    ctx.fillStyle = "#000000";
			    ctx.stroke();
			    ctx.closePath();
			}
		}

		for(i = 0; i < maxbombs; i++){                                
		    ctx.beginPath();
		    ctx.arc(bombs[i].x, bombs[i].y, bombs[i].ballRadius, 0, Math.PI*2);
		    ctx.fillStyle = bombs[i].colour;
		    ctx.fill();
		    ctx.closePath();
		    ctx.beginPath();
		    ctx.arc(bombs[i].x+bombs[i].ballRadius/2*0.707, bombs[i].y-bombs[i].ballRadius/2*0.707, bombs[i].ballRadius/3, 0, Math.PI*2);
		    ctx.fillStyle = "#ffffff";
		    ctx.fill();
		    ctx.closePath();
		    ctx.beginPath();
		    ctx.arc(bombs[i].x, bombs[i].y-bombs[i].ballRadius, bombs[i].ballRadius/4, 0, Math.PI*2);
		    ctx.fillStyle = bombs[i].colour;
		    ctx.fill();
		    ctx.closePath();
		    ctx.beginPath();
			ctx.moveTo(bombs[i].x, bombs[i].y-bombs[i].ballRadius-bombs[i].ballRadius/4);
			ctx.lineTo(bombs[i].x, bombs[i].y-bombs[i].ballRadius-bombs[i].ballRadius/2);
			ctx.stroke();
			ctx.closePath();
		}


		if(!winFlag)
			win();
	}

	//controls the collisions between the player and the apple
	function collides(ball, ball2){
		if((ball.x + ball.ballRadius + 1 > ball2.x ) && (ball.x - ball.ballRadius < ball2.x + ball2.ballRadius) && (ball.y < ball2.y + ball2.ballRadius) && (ball.y > ball2.y - ball2.ballRadius)) {
	    	var i;
	    	for(i = 5; i <= ball2.ballRadius; i+=2){
	    		ball.cola[ball.tam] = new coords(2000, 2000);
		    	ball.tam++;
		    	ball.ballRadius+=0.02;
		    	document.getElementById("score").innerHTML = ball.tam;
	    	} 
	    	ball2.eaten = true;
	        ball2.x = Math.random() * (canvas.width - 0) + 0;
	        ball2.y = Math.random() * (canvas.height - 0) + 0;
	        ball2.ballRadius = Math.random() * (maxBallRadius - minBallRadius) + minBallRadius;
	    }

	    if((ball.x - ball.ballRadius - 1 < ball2.x + ball2.ballRadius) && (ball.x + ball.ballRadius > ball2.x - ball2.ballRadius) && (ball.y < ball2.y + ball2.ballRadius) && (ball.y > ball2.y - ball2.ballRadius)) {
	    	var i;
	    	for(i = 5; i <= ball2.ballRadius; i+=2){
	    		ball.cola[ball.tam] = new coords(2000, 2000);
		    	ball.tam++;
		    	ball.ballRadius+=0.02;
		    	document.getElementById("score").innerHTML = ball.tam;
	    	} 
	    	ball2.eaten = true;
	        ball2.x = Math.random() * (canvas.width - 0) + 0;
	        ball2.y = Math.random() * (canvas.height - 0) + 0;
	        ball2.ballRadius = Math.random() * (maxBallRadius - minBallRadius) + minBallRadius;
	    }
	}

	function collideBomb(ball, ball2){
		if((ball.x + ball.ballRadius + 1 > ball2.x ) && (ball.x - ball.ballRadius < ball2.x + ball2.ballRadius) && (ball.y < ball2.y + ball2.ballRadius) && (ball.y > ball2.y - ball2.ballRadius)) {
			ball.lives--;
	    	document.getElementById("lives").innerHTML = ball.lives;
	    	//bombExplosion(ball2);
	    	if(ball.lives == 0){
				loose();
			}
	        ball2.x = Math.random() * (canvas.width - 0) + 0;
	        ball2.y = Math.random() * (canvas.height - 0) + 0;
	        ball2.ballRadius = Math.random() * (maxBombRadius - minBombRadius) + minBombRadius;
	    }

	    if((ball.x - ball.ballRadius - 1 < ball2.x + ball2.ballRadius) && (ball.x + ball.ballRadius > ball2.x - ball2.ballRadius) && (ball.y < ball2.y + ball2.ballRadius) && (ball.y > ball2.y - ball2.ballRadius)) {
	    	ball.lives--;
	    	document.getElementById("lives").innerHTML = ball.lives;
	    	//bombExplosion(ball2);
	    	if(ball.lives == 0){
				loose();
			}
	        ball2.x = Math.random() * (canvas.width - 0) + 0;
	        ball2.y = Math.random() * (canvas.height - 0) + 0;
	        ball2.ballRadius = Math.random() * (maxBombRadius - minBombRadius) + minBombRadius;
	    }
	}

	//generates random movement for the apples
	function calculateRandMov(apple){
		//HITING X POS WALL 
	    if(((apple.x + apple.dirX*(apple.vel/2) + apple.ballRadius) > canvas.width)){ 
	    	if(apple.dirY == 1){
	    		apple.nIters = 301;			//GOING Y POS
	    	} else if(apple.dirY == -1){
	    		apple.nIters = 201;			//GOING Y NEG
	    	}
	    }

	    //HITING Y POS WALL 
	    else if(((apple.y + apple.dirY*(apple.vel/2) + apple.ballRadius) > canvas.height)){
	    	if(apple.dirX == 1){
	    		apple.nIters = 301;			//GOING X POS
	    	} else if(apple.dirX == -1){
	    		apple.nIters = 101;			//GOING X NEG
	    	}
	    }

	    //HITING X NEG WALL 
	    else if(((apple.x + apple.dirX*(apple.vel/2) - apple.ballRadius) < 0)){ 
	    	if(apple.dirY == 1){
	    		apple.nIters = 101;			//GOING Y POS
	    	} else if(apple.dirY == -1){
	    		apple.nIters = 0;			//GOING Y NEG
	    	}
	    }

	    //HITING Y NEG WALL GOING X POS
	    else if(((apple.y + apple.dirY*(apple.vel/2) - apple.ballRadius) < 0)){
	    	if(apple.dirX == 1){
	    		apple.nIters = 201;			//GOING X POS
	    	} else if(apple.dirX == -1){
	    		apple.nIters = 0;			//GOING X NEG
	    	}
	    }

	    apple.nIters++;

	    if(apple.nIters <= 100){
	    	apple.dirX = 1;
	    	apple.dirY = 1;
	    	if(apple.nIters == 100)
	    		apple.nIters = Math.floor(Math.random() * 400);
	    } else if(apple.nIters <= 200){
	    	apple.dirX = 1;
	    	apple.dirY = -1;
	    	if(apple.nIters == 200)
	    		apple.nIters = Math.floor(Math.random() * 400);
	    } else if(apple.nIters <= 300){
	    	apple.dirX = -1;
	    	apple.dirY = 1;
	    	if(apple.nIters == 300)
	    		apple.nIters = Math.floor(Math.random() * 400);
	    } else if(apple.nIters <= 400){
	    	apple.dirX = -1;
	    	apple.dirY = -1;
	    	if(apple.nIters == 400)
	    		apple.nIters = Math.floor(Math.random() * 400);
	    }
	}

	function calculatePlayerMovements(ball, objX, objY){
		var difX = objX - ball.x;
	    var difY = objY - ball.y;

	    var hipotenusa = Math.sqrt(difX*difX+difY*difY);

	    var relation = ball.vel/hipotenusa;

	    ball.x += difX*relation;
	    ball.y += difY*relation;
	}

	function loose(){
		clearInterval(refreshIntervalId);
		ctx.globalAlpha = 0.9;
		ctx.beginPath();
	    ctx.rect(0, 0, canvas.width, canvas.height);
	    ctx.fillStyle = "#ffffff";
	    ctx.fill();
	    ctx.closePath();
	    ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.font = "100px Roboto";
	    ctx.fillStyle = "#000000";
		ctx.textAlign = "center";
		ctx.fillText("Game Over", canvas.width/2, canvas.height/2); 
	    ctx.closePath();
	}

	function win(){
		clearInterval(refreshIntervalId);
		ctx.globalAlpha = 0.9;
		ctx.beginPath();
	    ctx.rect(0, 0, canvas.width, canvas.height);
	    ctx.fillStyle = "#ffffff";
	    ctx.fill();
	    ctx.closePath();
	    ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.font = "100px Roboto";
	    ctx.fillStyle = "#000000";
		ctx.textAlign = "center";
		ctx.fillText("You Win", canvas.width/2, canvas.height/2); 
	    ctx.closePath();
	}

	//main loop
	function draw() {
	    drawBall();

	    calculatePlayerMovements(ball, mouseX, mouseY);

	    var i;
	    for(i = 0; i < maxballs; i++){
	    	if(balls[i].eaten == false){
		    	if((i%(Math.floor(Math.random() * 2)))==0){
		    		calculateRandMov(balls[i]);
		    	}
		    	balls[i].x += balls[i].dirX*(balls[i].vel/2);
		    	balls[i].y += balls[i].dirY*(balls[i].vel/2);
		    	collides(ball, balls[i]);
		    }
	    }

	    for(i = 0; i < maxbombs; i++){
	    	if((i%(Math.floor(Math.random() * 2)))==0){
	    		calculateRandMov(bombs[i]);
	    	}
	    	bombs[i].x += bombs[i].dirX*(bombs[i].vel/2);
	    	bombs[i].y += bombs[i].dirY*(bombs[i].vel/2);
	    	collideBomb(ball, bombs[i]);
	    }

	    if(ball.tam != 0){
			var auxX2 = ball.cola[0].x;
	    	var auxY2 = ball.cola[0].y;
	    
	    	ball.cola[0].x = ball.x;
	    	ball.cola[0].y = ball.y;
	    	for(i = 0; i < ball.tam; i++){
		    	auxX = ball.cola[i].x;
		    	auxY = ball.cola[i].y;
		    	ball.cola[i].x = auxX2;
		    	ball.cola[i].y = auxY2;
		    	auxX2 = auxX;
		    	auxY2 = auxY;
		    }
		}
	}

	var refreshIntervalId = setInterval(draw, 10);
}
			