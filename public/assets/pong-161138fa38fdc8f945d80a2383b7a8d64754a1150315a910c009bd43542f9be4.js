$(function(){
  var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
          window.setTimeout(callback, 1000 / 60)
      };
  // var canvas = document.createElement("canvas");
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var width = canvas.clientWidth;
  var height = canvas.clientHeight;
  var player = new Player();
  var computer = new Computer();
  var ball = new Ball(300, 200);

  var keysDown = {};

  var render = function () {
      context.fillStyle = "#008080";
      context.fillRect(0, 0, width, height);
      player.render();
      computer.render();
      ball.render();
  };

  var update = function () {
      player.update();
      computer.update(ball);
      ball.update(player.paddle, computer.paddle);
  };

  var step = function () {
      update();
      render();
      animate(step);
  };

  function Paddle(x, y, width, height) {
      this.position.x = x;
      this.position.y = y;
      this.width = width;
      this.height = height;
      this.direction.x = 0;
      this.direction.y = 0;
  }

  Paddle.prototype.render = function () {
      context.fillStyle = "#0000FF";
      context.fillRect(this.position.x, this.position.y, this.width, this.height);
  };

  Paddle.prototype.move = function (x, y) {
      this.position.x += x;
      this.position.y += y;
      if (this.position.y < 0) {
          this.position.y = 0;
      } else if (this.position.y + this.height > 400) {
          this.position.y = 400 - this.height;
      }
  };

  function Computer() {
      this.paddle = new Paddle(10, 175, 10, 50);
  }

  Computer.prototype.render = function () {
      this.paddle.render();
  };

  Computer.prototype.update = function (ball) {
      var y_pos = ball.y;
      var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
      if (diff < 0 && diff < -4) {
          diff = -5;
      } else if (diff > 0 && diff > 4) {
          diff = 5;
      }
      this.paddle.move(0, diff);
      if (this.paddle.y < 0) {
          this.paddle.y = 0;
      } else if (this.paddle.y + this.paddle.width > 400) {
          this.paddle.y = 400 + this.paddle.width;
      }
  };

  function Player() {
      this.paddle = new Paddle(580, 175, 10, 50);
  }

  Player.prototype.render = function () {
      this.paddle.render();
  };

  Player.prototype.update = function () {
      for (var key in keysDown) {
          var value = Number(key);
          if (value == 38) {
              this.paddle.move(0, -4);
          } else if (value == 40) {
              this.paddle.move(0, 4);
          } else {
              this.paddle.move(0, 0);
          }
      }
  };

  function Ball(x, y) {
      this.position.x = x;
      this.position.y = y;
      this.direction.x = 0;
      this.direction.y = 0;
  }

  Ball.prototype.render = function () {
      context.beginPath();
      context.arc(this.position.x, this.position.y, 5, 2 * Math.PI, false);
      context.fillStyle = "#000000";
      context.fill();
  };

  Ball.prototype.update = function (paddle1, paddle2) {
      this.position.x += this.direction.x;
      this.position.y += this.direction.y;
      var top_x = this.position.x - 5;
      var top_y = this.position.y - 5;
      var bottom_x = this.position.x + 5;
      var bottom_y = this.position.y + 5;

      if(this.direction.x ==0 && this.direction.y == 0 && keyCode == 32)
      {
        this.direction.x = 3;
      }
      //if ball hits the wall bounce back
      if (this.position.y - 5 < 0) {
          this.position.y = 5;
          this.direction.y = -this.direction.y;
      } else if (this.position.y + 5 > 400) {
          this.position.y = 395;
          this.direction.y = -this.direction.y;
      }

      //reset ball back to center
      if (this.position.x < 0 || this.position.x > 600) {
          this.direction.y = 0;
          this.direction.x = 3;
          this.position.y = 200;
          this.position.x = 300;
      }

      if (top_x > 300) {
          if (top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x && top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y) {
              this.direction.x = -3;
              this.direction.y += (paddle1.y_speed / 2);
              this.position.x += this.direction.x;
          }
      } else {
          if (top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x && top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y) {
              this.direction.x = 3;
              this.direction.y += (paddle2.y_speed / 2);
              this.position.x += this.x_speed;
          }
      }
  };

  document.body.appendChild(canvas);
  animate(step);

  window.addEventListener("keydown", function (event) {
      keysDown[event.keyCode] = true;
  });

  window.addEventListener("keyup", function (event) {
      delete keysDown[event.keyCode];
  });

});
