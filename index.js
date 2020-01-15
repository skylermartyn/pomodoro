//////////////////////////////////////////////////////////
// Global Variables: 
// Page Configuration: 
// Functions and Logic: 
//////////////////////////////////////////////////////////
                // Global Variables //

// DOM Variables
const header = document.querySelector('header');
const main = document.getElementById('main-module');
const buttons = document.getElementById('buttons');
const start25 = document.getElementById('start-25');
const start5 = document.getElementById('start-5');
const stop = document.getElementById('stop');
const underStop = document.getElementById('under-stop');
const instructions = document.getElementById('instructions');
const moreInfo = document.getElementById('more-info');
const xBox = document.getElementById('x-container');
const footer = document.querySelector('footer');

// Sounds

const chime25 = new Audio('sounds/chime25.mp3');
const chime5 = new Audio('sounds/chime5.mp3');

// State

// True if the user is has not interacted with timer
// since refresh or last 25min-5min cycle
let cleanHistory = true;

// True if more-info section was just navigated to, delaying responsive
// styling and button capabilities of more-info until after the cursor
// first leaves the section
let moreInfoJump = false;

// Is the timer active? Paused timer is still active
let timerActive = false;

// Interval timer identification for Pomodoro timer
let timerId = null;

// Interval timer identification for more info animation
let moreInfoAnimation = null;

// Stage 1 = 25 min timer, Stage 2 = 5 min timer
let currentStage = 1;


//////////////////////////////////////////////////////////
                // Page Configuration //

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
    if (startButton5.innerText == 'Restart 5') {
        startButton5.classList.remove('button-focus');
        startButton5.innerText = 'Start 5';
    }
    startButton25.classList.add('button-focus');
    startButton25.innerText = 'Restart 25'
    startTimer(25);
});

// Create start button for 5 minute timer
const startButton5 = document.createElement('button');
startButton5.innerText = 'Start 5';
startButton5.style.margin = 'auto';
start5.appendChild(startButton5);
startButton5.addEventListener('click', () => {
    if (startButton25.innerText == 'Restart 25') {
        startButton25.classList.remove('button-focus');
        startButton25.innerText = 'Start 25';
    }
    startButton5.classList.add('button-focus');
    startButton5.innerText = 'Restart 5'
    startTimer(5);
});

// Create stop button to be visible when timer is active
const stopButton = document.createElement('button');
stopButton.innerText = 'Stop';
stopButton.style.margin = 'auto';
stopButton.style.fontWeight = 'normal';
stopButton.style.borderWidth = '1px';
stopButton.addEventListener('click', () => stopTimer());


// Event handlers for instructions
instructions.addEventListener('mouseenter', () => {
    instructions.style.cursor = 'pointer';
    instructions.style.color = 'grey';
    underStop.innerHTML = '.<br>';
    moreInfoAnimation = setInterval( () => {
        if (underStop.innerHTML.length < 15) {
            underStop.innerHTML += '.<br>';    
        } else {
            underStop.innerHTML = '';
        }
    }, 500)  
});
instructions.addEventListener('mouseleave', () => {
    clearInterval(moreInfoAnimation);
    underStop.innerHTML = '';
    instructions.style.color = '#300';
})

instructions.addEventListener('click', () => {
    underStop.innerHTML = '';
    clearInterval(moreInfoAnimation);
    stop.removeChild(instructions);
    buttons.removeChild(start25);
    buttons.removeChild(start5);
    moreInfoJump = true;
    buttons.classList.add('more-info-container');
    moreInfo.classList.add('more-info-shown');
})

moreInfo.addEventListener('mouseenter', () => {
    if (!moreInfoJump) {
    moreInfo.style.cursor = 'pointer';
    moreInfo.style.color = 'grey';
    xBox.classList.add('x-box-shown');
    }
});

moreInfo.addEventListener('mouseleave', () => {
    if (moreInfoJump) moreInfoJump = false;
    moreInfo.style.color = '#300';
    xBox.classList.remove('x-box-shown');
})

moreInfo.addEventListener('click' () => {
    if (!moreInfoJump) {
        buttons.classList.add('more-info-container');
        moreInfo.classList.add('more-info-shown');
        stop.removeChild(instructions);
        buttons.removeChild(start25);
        buttons.removeChild(start5);
    }
})

//////////////////////////////////////////////////////////
                // Functions and Logic //

/*
Renders a circle to signify time passed
:param progress: <float> Number between 0 and 1 where 0 is start and 1 is finish
:param color: <string> Color of stroke to be rendered to make the circle
*/
function circleRender (progress, color) {
    // ball.clearRect(0, 0, ballCanvas.width, ballCanvas.height);      
    const radians = ((2 * Math.PI) * progress) + 1.5 * Math.PI;
    ball.beginPath();
    ball.arc(150, 110, 100, (1.5 * Math.PI), radians);
    ball.strokeStyle = color;
    ball.stroke();
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
    if (timerActive) {
        clearInterval(timerId);
        ball.clearRect(0, 0, ballCanvas.width, ballCanvas.height);
        length == 25 ? circleRender(1, '#000000') : circleRender(1, '#FFFFFF');
    }
    timerActive = true;
    if (timerActive) {
        if (cleanHistory) {
            cleanHistory = false;
            stop.removeChild(instructions);
        }
        stop.appendChild(stopButton);
    }

    // Initialize timer variables
    const totalTime = 60000 * length;
    let timePassed = 0;
    let lastRender = new Date().getTime();

    // Timer logic
    timerId = setInterval(function() {
        // Rerender new circle every opportunity, top speed 100 miliseconds
        let currentRender = new Date().getTime();
        timePassed += currentRender - lastRender;
        lastRender = currentRender;
        const progress = timePassed / totalTime;
        if (length == 5) ball.clearRect(0, 0, ballCanvas.width, ballCanvas.height);
        circleRender(progress, circleColor);
        let newTime = new Date().getTime();

        // If 25 minute timer has completed, move on to 5 minute timer
        if (timePassed >= totalTime && length == 25) {
            clearInterval(timerId);
            timerActive = false;
            ball.clearRect(0, 0, ballCanvas.width, ballCanvas.height);
            currentStage = 2;
            chime25.play(); 
            startButton25.classList.remove('button-focus');
            startButton25.innerText = 'Start 25';
            startButton5.classList.add('button-focus');
            startButton5.innerText = 'Restart 5';       
            startTimer(5);
        // If 5 minute timer has completed, revert to begining state
        } else if (timePassed >= totalTime && length == 5) {
            clearInterval(timerId);
            chime5.play();
            ball.clearRect(0, 0, ballCanvas.width, ballCanvas.height);
            circleRender(1, '#000000', 100);
            startButton5.classList.remove('button-focus');
            startButton5.innerText = 'Start 5';
            stop.removeChild(stopButton);
            stop.appendChild(instructions);
            cleanHistory = true;
        }
    }, 100)
}

/*
Stops timer and/or chimes
*/
function stopTimer () {
    // Stops timer
    clearInterval(timerId);

    // Removes button focus styling from timer buttons
    if (currentStage == 1) {
        startButton25.classList.remove('button-focus');
    } else if (currentStage == 2) {
        startButton5.classList.remove('button-focus');
    }

    // Pauses and resets whichever chimes are playing
    if (!chime25.paused) {
        chime25.pause();
        chime25.currentTime = 0;
    }
    if (!chime5.paused) {
        chime5.pause();
        chime5.currentTime = 0;
    }
}