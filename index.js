var ballCanvas = document.getElementById("ball-canvas");
ballCanvas.height = '300';
ballCanvas.width = '300';
ballCanvas.style.margin = 'auto';
var ball = ballCanvas.getContext("2d");
ball.beginPath();
ball.arc(150, 150, 100, 0, 2 * Math.PI);
ball.stroke();