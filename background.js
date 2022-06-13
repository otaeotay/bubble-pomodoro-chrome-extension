chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == 'startTimer'){
        startTimer(request.focusTime, request.focusTimeSeconds, request.paused);
    } else if (request.action == 'pauseTimer'){
        pauseTimer();
    } else if (request.action == 'stopTimer'){
        stopTimer();
    }
})

let everySecond;
let minutes;
let seconds;

let startTimer = (focusTime, focusTimeSeconds, paused) => {
    if (!paused) {
        minutes = focusTime;
        seconds = focusTimeSeconds;
    }
    paused = false;
    pauseTimer();
    everySecond = setInterval(() => {
        seconds -= 1;
        if (seconds < 0) {
            seconds = 59;
            minutes -= 1;
        }
        chrome.runtime.sendMessage({ action: 'timer', minutes: minutes, seconds: seconds})
    }, 1000);
}

let pauseTimer = () => {
  clearInterval(everySecond);
};

let stopTimer = () => {
    pauseTimer();
    setFocusTime();
  minutes = focusTime;
  seconds = focusTimeSeconds;
  minutesDisplay.innerText = formatTime(minutes);
  secondsDisplay.innerText = formatTime(seconds);
};
