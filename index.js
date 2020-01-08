var ballCanvas = document.getElementById("ball-canvas");
var ball = ballCanvas.getContext("2d");
ball.beginPath();
ball.arc(100, 75, 50, 0, 2 * Math.PI);
ball.stroke();