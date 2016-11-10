
function normalize(vector) {
  var length = Math.sqrt(vector.x*vector.x + vector.y*vector.y);
  return { x: vector.x/length, y: vector.y/length };
}

function subtract(vec1, vec2) {
  return { x: vec1.x - vec2.x, y: vec1.y - vec2.y };
}

function add(vec1, vec2) {
  return { x: vec1.x + vec2.x, y: vec1.y + vec2.y };
}

function mult(vector, times) {
  return { x: vector.x*times, y: vector.y*times };
}

function rightSide(object) {
  return { x: object.position.x + object.width, y: object.position.y };
}

function centre(object) {
  return { x: object.position.x + object.width/2, y: object.position.y + object.height/2 };
}

 function getRandomArbitrary(min, max) {
     return Math.random() * (max - min) + min;
}

function randomLaunch(object){
    var getY = getRandomArbitrary(-700,700);
    if(getY < 40 && getY > -40)
      getY+=40;
    return { x: object.position.x + object.width/2, y: object.position.y + (object.height/2 + getY) };
}

//ball angle depending on where it hits
// function ballYAngle(ball, paddle, moved){
//
//    var upperhalf = (paddle.position.y + (paddle.height / 2));
//    var lowerhalf = upperhalf + (paddle.height /2);
//
//    if(ball.position.y >= paddle.position.y && ball.position.y < upperhalf){
//      var dist = ball.position.y- paddle.position.y;
//    }
//    else if (ball.position.y >= upperhalf && ball.position.y < lowerhalf){
//      var dist = lowerhalf - ball.position.y;
//    }
//    if(moved){
//     ball.direction.y *= -((Math.abs((dist - (paddle.height/2)))/ 500) + 1);
//   }else {
//      ball.direction.y *= ((Math.abs((dist - (paddle.height/2)))/ 500) + 1);
//    }
//    //alert(ball.direction.y + "!");
// }
//
function within(ball, paddle) {
  //  if(!ball.position.x <= 0 && !ball.position.x >= 800)
  //  {
  //   var upperhalf = (paddle.position.y + (paddle.height / 2));
  //   var lowerhalf = upperhalf + (paddle.height /2);
  //
  //   if(ball.position.y >= paddle.position.y && ball.position.y < upperhalf)
  //     var dist =  ball.position.y- paddle.position.y;
  //   else if (ball.position.y >= upperhalf && ball.position.y < lowerhalf)
  //     var dist = lowerhalf - ball.position.y;
  //
  //   ball.direction.x *= (Math.abs((dist - (paddle.height/2))) / 1000) + 1;
  // }

  return ball.position.y >= paddle.position.y && ball.position.y <= paddle.position.y + paddle.height;
}

$(function() {

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var cHeight = canvas.clientHeight;
  var cWidth = canvas.clientWidth;

  var PADDLE_WIDTH = 5;
  var PADDLE_HEIGHT = cHeight/6;
  var PADDLE_DIST_FROM_SIDE = 15;
  var moving = false;

  var Paddle = function(id, x_pos, controller) {
    this.id = id;
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.position = { x: x_pos, y: cHeight/2 - PADDLE_HEIGHT/2 };
    this.direction = 0;
    this.speed = 4;
    this.controller = controller;
  };

  Paddle.prototype.move = function(ball) {
    this.direction = this.controller(ball);
    this.position.y += this.direction*this.speed;
    if (this.position.y <= 0)
      this.position.y = 0;
    else if (this.position.y + this.height >= cHeight)
      this.position.y = cHeight - this.height;
  };

  Paddle.prototype.render = function() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  };

  var BALL_RADIUS = 5;

  var ball = {
    lastTouched: '',
    width: BALL_RADIUS,
    height: BALL_RADIUS,
    position: {
      x: cWidth/2,
      y: cHeight/2
    },
    direction: {
      x: 0,
      y: 0
    },
    speed: 4,
    stopped: true
  };

  ball.move = function() {
    this.position = add(this.position, mult(this.direction, this.speed));
    this.direction.x*=1.00001;
    document.getElementById("ballspeed").innerHTML = "Ball Speed: " + (Math.abs(this.direction.x)).toFixed(4);
  };

  ball.reset = function() {
    this.position = {
      x: cWidth/2,
      y: cHeight/2
    };
    this.direction = { x: 0, y: 0 };
    this.stopped = true;
  }

  ball.bounceOffPaddle = function(paddle) {
    if (this.lastTouched != paddle.id) {
      this.direction = {
        x: -(this.direction.x * 1.05),
        //x: -(this.direction.x),
        y: this.direction.y
      };
    }
    //ballYAngle(this, paddle, moving);
    this.lastTouched = paddle.id;
  }

  var playerScore = 0;
  var aiScore = 0;

  ball.collide = function(paddleL, paddleR) {
    if (this.position.x <= 0) {
      aiScore++;
      this.reset();
    }

    if (this.position.x >= cWidth) {
      playerScore++;
      this.reset();
    }

    if (this.position.y <= 5 || this.position.y >= cHeight-5)
      this.direction.y = -this.direction.y;
    else if (this.position.x - 4 <= rightSide(paddleL).x && within(this, paddleL))// && !(this.position.x + this.width) < paddleL.position.x)
      this.bounceOffPaddle(paddleL);
    else if (this.position.x + 4 >= paddleR.position.x && within(this, paddleR))// && !this.position.x > (paddleR.position.x + paddleR.width))
      this.bounceOffPaddle(paddleR);

  };

  ball.render = function() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 5, 2 * Math.PI, false);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  };

  var userController = (function() {
    var keysDown = {};
    window.addEventListener('keydown', function (event) {
        keysDown[event.keyCode] = true;
    });

    window.addEventListener('keyup', function (event) {
        keysDown[event.keyCode] = false;
    });

    return function() {
      var direction = 0;
      if (keysDown[38])
      {
        direction -= 1;
        moving = true;
      }else {
        moving = false;
      }
      if (keysDown[40])
      {
        direction += 1;
        moving = true;
      }else {
        moving = false;
      }
      return direction;
    }
  })();

  var aiController = function(ball, paddle) {
    if (centre(this).y < centre(ball).y)
      return 1;
    else if (centre(this).y > centre(ball).y)
      return -1;
    else
      return 0;
  };

  var leftPaddle = new Paddle('left', PADDLE_DIST_FROM_SIDE, userController);
  var rightPaddle = new Paddle('right', cWidth - PADDLE_DIST_FROM_SIDE, aiController);

  var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
          window.setTimeout(callback, 1000 / 60);
  };

  var step = function() {
    ctx.fillStyle = '#00b2a0';
    ctx.fillRect(0, 0, cWidth, cHeight);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = "50px Helvetica";
    ctx.fillText(playerScore, 100, 50);
    ctx.fillText(aiScore, cWidth - 125, 50);

    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(cWidth/2, 0);
    ctx.lineTo(cWidth/2, cHeight);
    ctx.stroke();

    leftPaddle.move(ball);
    leftPaddle.render();
    rightPaddle.move(ball);
    rightPaddle.render();
    ball.move();
    ball.collide(leftPaddle, rightPaddle);
    ball.render();
    animate(step);
  };

  window.addEventListener('keydown', function(event) {
    if (event.keyCode == 32 && ball.stopped) {
      ball.direction = normalize(subtract(randomLaunch(leftPaddle), centre(ball)));
      ball.stopped = false;
      //randomLaunch
    }
  });

  animate(step);

  $('#logo').on('click', function(){
    $.ajax({
      type: "GET",
      url: "/pong/hi",
      dataType: 'JSON',
      success: function(data) { alert("Hello from the server at " + data); },
      error: function(jqXHR, textStatus, errorThrown) {console.log(textStatus, errorThrown);}
    });
  });

});
