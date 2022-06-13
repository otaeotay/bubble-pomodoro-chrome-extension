chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == 'startTimer'){
        startTimer(request.focusTime, request.focusTimeSeconds);
    } else if (request.action == 'pauseTimer'){
        pauseTimer();
    } else if (request.action == 'stopTimer'){
        stopTimer(request.focusTime, request.focusTimeSeconds);
    }
})

let everySecond;
let minutes;
let seconds;
chrome.storage.local.set({paused: false})
let startTimer = (focusTime, focusTimeSeconds) => {
    let paused = chrome.storage.local.get('paused', ({paused})=> {
        if (!paused) {
            minutes = focusTime;
            seconds = focusTimeSeconds;
        }
    });
    chrome.storage.local.set({paused: false});
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
    chrome.storage.local.set({paused: true});
  clearInterval(everySecond);
};

let stopTimer = (focusTime, focusTimeSeconds) => {
    pauseTimer();
  minutes = focusTime;
  seconds = focusTimeSeconds;
  chrome.runtime.sendMessage({ action: 'timer', minutes: minutes, seconds: seconds})
};
