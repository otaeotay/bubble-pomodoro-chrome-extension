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
resetButton.addEventListener('click', () => stop());

let start = () => {
  if(!paused){
    setFocusTime();
  }
  chrome.runtime.sendMessage({ action: 'startTimer', focusTime: focusTime, focusTimeSeconds: focusTimeSeconds})
  document.getElementById('start-audio').play();
}

let pause = () => {
  paused = true;
  chrome.runtime.sendMessage({action: 'pauseTimer'});
  document.getElementById('pause-audio').play();
}

let stop = () => {
  setFocusTime();
  chrome.runtime.sendMessage({action: 'stopTimer' , focusTime: focusTime, focusTimeSeconds: focusTimeSeconds});
  document.getElementById('stop-audio').play();
}

let timer = (minutes, seconds) => {
  
  minutesDisplay.innerText = formatTime(minutes);
  secondsDisplay.innerText = formatTime(seconds);
};

chrome.runtime.sendMessage({ action: 'loadTime'});

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
  if (request.action == 'timer'){
    timer(request.minutes, request.seconds);
  }
})

function formatTime(x) {
  return x >= 10 || x==='00' ? x : `0${x}`;
}

// function hide(element) {
//     element.classList.remove("active");
//     element.classList.add("inactive");
// }
