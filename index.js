// Global Variables
const main = document.getElementById('main-module');
const buttons = document.getElementById('buttons');
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

// Create start and stop buttons
const startButton = document.createElement('button');
startButton.innerText = 'Start';
startButton.style.margin = 'auto';
buttons.appendChild(startButton);
// Click listener to start/restart current timer
startButton.addEventListener('click', () => {
    if (currentStage == 1) {
        startTimer(25);
    } else if (currentStage == 2) {
        startTimer(5);
    }
});

// Click listener to reset timer to beginning of the 25 minutes
startButton.addEventListener('dblclick', () => {
    if (currentStage == 2) {
        currentStage = 1;
        startTimer(25);
    } else if (currentStage == 1) {
        currentStage = 2;
        startTimer(5);
    }
})

const stopButton = document.createElement('button');
stopButton.innerText = 'Stop';
stopButton.style.margin = 'auto';
stopButton.addEventListener('click', () => stopTimer())

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
    if (length == 5) circleColor = '#000000';
    
    // Clear timer for restart if already running
    if (timerRunning) {
        clearInterval(timerId);
        ball.clearRect(0, 0, ballCanvas.width, ballCanvas.height);
        length == 25 ? circleRender(1, '#000000') : circleRender(1, '#FFFFFF');
    }
    timerRunning = true;
    if (timerRunning) {
        startButton.innerText = 'Restart';
        buttons.appendChild(stopButton);
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
            startTimer(5);
        } 
    }, 100)
}

function stopTimer () {
    clearInterval(timerId);
}
