// Global Variables
const header = document.querySelector('header');
const main = document.getElementById('main-module');
const buttons = document.getElementById('buttons');
const start25 = document.getElementById('start-25');
const start5 = document.getElementById('start-5');
const stop = document.getElementById('stop');
const instructions = document.getElementById('instructions');
const footer = document.querySelector('footer');

const chime25 = new Audio('sounds/chime25.mp3');
const chime5 = new Audio('sounds/chime5.mp3');
let cleanHistory = true;
let timerRunning = false;
let timerId = null;
let currentStage = 1;



// Create canvas for circle and initial render
const ballCanvas = document.getElementById("ball-canvas");
ballCanvas.height = '300';
ballCanvas.width = '300';
ballCanvas.style.margin = 'auto';
const ball = ballCanvas.getContext("2d"); 
circleRender(1, '#000000', 100);

// Create start button for 25 minute timer
const startButton25 = document.createElement('button');
startButton25.innerText = 'Start 25';
startButton25.style.margin = 'auto';
start25.appendChild(startButton25);
startButton25.addEventListener('click', () => {
    if (currentStage == 2 || !timerRunning) {
        startButton25.innerText = 'Restart 25';
        startButton5.innerText = 'Start 5';
    }
    startTimer(25);
});

// Create start button for 5 minute timer
const startButton5 = document.createElement('button');
startButton5.innerText = 'Start 5';
startButton5.style.margin = 'auto';
start5.appendChild(startButton5);
startButton5.addEventListener('click', () => {
    if (currentStage == 1 || timerRunning) {
        startButton25.innerText = 'Start 25';
        startButton5.innerText = 'Restart 5';
    }
    startTimer(5);
});

// Create stop button to be visible when timer is running
const stopButton = document.createElement('button');
stopButton.innerText = 'Stop';
stopButton.style.margin = 'auto';
stopButton.style.fontWeight = 'normal';
stopButton.style.borderWidth = '1px';
stopButton.addEventListener('click', () => stopTimer());

/*
Renders a circle to signify time passed
:param progress: <float> Number between 0 and 1 where 0 is start and 1 is finish
:param color: <string> Color of stroke to be rendered to make the circle
:param stage: <int> Stage of timer, 1 being the 25 min timer & 2 being the 5 minutes timer
*/
function circleRender (progress, color) {
    // ball.clearRect(0, 0, ballCanvas.width, ballCanvas.height);      
    const radians = ((2 * Math.PI) * progress) + 1.5 * Math.PI;
    ball.beginPath();
    ball.arc(150, 150, 100, (1.5 * Math.PI), radians);
    ball.strokeStyle = color;
    ball.stroke();
    console.log(new Date().getTime());
}

/*
Starts the timer that presents progress by rerendering a circle
:param length: <int> Length of timer in minutes
*/
function startTimer (length) {
    // Modulate color based on timer stage
    let circleColor = '#FFFFFF';
    if (length == 5) {
        circleColor = '#000000';
        currentStage = 2;
    } else if (length == 25) {
        currentStage = 1;
    }
    
    // Clear timer for restart if already running
    if (timerRunning) {
        clearInterval(timerId);
        ball.clearRect(0, 0, ballCanvas.width, ballCanvas.height);
        length == 25 ? circleRender(1, '#000000') : circleRender(1, '#FFFFFF');
    }
    timerRunning = true;
    if (timerRunning) {
        if (cleanHistory) {
            cleanHistory = false;
            stop.removeChild(instructions);
        }
        stop.appendChild(stopButton);
    }

    // Initialize timer variables
    const totalTime = 60000 * length;
    let timePassed = 0;
    
    // Timer logic
    timerId = setInterval(function() {
        timePassed += 100;
        const progress = timePassed / totalTime;
        if (length == 5) ball.clearRect(0, 0, ballCanvas.width, ballCanvas.height);
        circleRender(progress, circleColor);
        
        if (timePassed >= totalTime && length == 25) {
            clearInterval(timerId);
            timerRunning = false;
            ball.clearRect(0, 0, ballCanvas.width, ballCanvas.height);
            currentStage = 2;
            chime25.play();
            startTimer(5);
        } else if (timePassed >= totalTime && length == 5) {
            clearInterval(timerId);
            chime5.play();
            ball.clearRect(0, 0, ballCanvas.width, ballCanvas.height);
            circleRender(1, '#000000', 100);
            startButton5.innerText = 'Start 5';
            startButton5.blur();
            stop.removeChild(stopButton);
        }
    }, 100)
}

function stopTimer () {
    clearInterval(timerId);

}
