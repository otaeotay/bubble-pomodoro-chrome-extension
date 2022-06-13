let closeButton = document.getElementById('close-button');
let startButton = document.getElementById('play-button');
let pauseButton = document.getElementById('pause-button');
let resetButton = document.getElementById('stop-button');
let minutesDisplay = document.getElementById('minutes');
let secondsDisplay = document.getElementById('seconds');

let focusTime, focusTimeSeconds, breakTime, breakTimeSeconds;
let paused = false;

let setFocusTime = () => {
    if (document.getElementById('focus-time').value.slice(0, 2)) {
        focusTime = document.getElementById('focus-time').value.slice(0, 2)
        focusTimeSeconds = document.getElementById('focus-time').value.slice(3)
    } else{
        focusTime = 25;
        focusTimeSeconds=0;
    }
}

let setBreakTime = () => {
    if (document.getElementById('break-time').value.slice(0, 2)) {
        breakTime = document.getElementById('break-time').value.slice(0, 2)
        breakTimeSeconds = document.getElementById('break-time').value.slice(3)
    } else{
        breakTime = 25;
        breakTimeSeconds=0;
    }
}

closeButton.addEventListener('click', () => window.close());
startButton.addEventListener('click', () => start());
pauseButton.addEventListener('click', () => pause());
resetButton.addEventListener('click', () => reset());

let start = () => {
  if(!paused){
    setFocusTime();
  }
  chrome.runtime.sendMessage({ action: 'startTimer', focusTime: focusTime, focusTimeSeconds: focusTimeSeconds, paused: paused})
}

let pause = () => {
  paused = true;
  chrome.runtime.sendMessage({action: 'pauseTimer'});
}

let stop = () => {
  chrome.runtime.sendMessage({action: 'stopTimer'});
}

let timer = (minutes, seconds) => {
  
  minutesDisplay.innerText = minutes;
  secondsDisplay.innerText = seconds;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
  if (request.action == 'timer'){
    timer(request.minutes, request.seconds);
  }
})

// function formatTime(x) {
//   // return x > 10 ? x : `0${x}`;
//   return x;
// }

// function hide(element) {
//     element.classList.remove("active");
//     element.classList.add("inactive");
// }
