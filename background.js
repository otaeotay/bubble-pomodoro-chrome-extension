chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == 'startTimer') {
    startTimer(
      request.focusTime,
      request.focusTimeSeconds,
      request.breakTime,
      request.breakTimeSeconds
    );
  } else if (request.action == 'pauseTimer') {
    pauseTimer();
  } else if (request.action == 'stopTimer') {
    stopTimer(request.focusTime, request.focusTimeSeconds);
  } else if (request.action == 'loadTime') {
    loadTime();
  }
});

let everySecond;
let minutes = 25;
let seconds = 0;
chrome.storage.local.set({ paused: false });

let startTimer = (focusTime, focusTimeSeconds, breakTime, breakTimeSeconds) => {
  let paused = chrome.storage.local.get('paused', ({ paused }) => {
    if (!paused) {
      minutes = focusTime;
      seconds = focusTimeSeconds;
    }
  });

  pauseTimer();
  chrome.storage.local.set({ paused: false });
  everySecond = setInterval(() => {
    seconds -= 1;
    if (seconds < 0) {
      seconds = 59;
      minutes -= 1;
    }

    if (minutes == 0 && seconds == 0) {
      chrome.storage.local.get('breakTimeStatus', ({ breakTimeStatus }) => {
        if (!breakTimeStatus) {
          minutes = breakTime;
          seconds = breakTimeSeconds;
          chrome.storage.local.set({ breakTimeStatus: true });
          playSound('bubbles');
        } else {
          minutes = focusTime;
          seconds = focusTimeSeconds;
          chrome.storage.local.set({ breakTimeStatus: false });

          playSound('bubbleBreak');
        }
      });
    }

    chrome.runtime.sendMessage({
      action: 'timer',
      minutes: minutes,
      seconds: seconds,
    });
  }, 1000);
};

let pauseTimer = () => {
  chrome.storage.local.set({ paused: true });
  clearInterval(everySecond);
};

let stopTimer = (focusTime, focusTimeSeconds) => {
  pauseTimer();
  minutes = focusTime;
  seconds = focusTimeSeconds;
  chrome.runtime.sendMessage({
    action: 'timer',
    minutes: minutes,
    seconds: seconds,
  });
};

let loadTime = () => {
  chrome.runtime.sendMessage({
    action: 'timer',
    minutes: minutes,
    seconds: seconds,
  });
};

let playSound = (source) => {
  chrome.storage.local.get('soundsEnabled', ({ soundsEnabled }) => {
    if (soundsEnabled) {
      let url = chrome.runtime.getURL('breakStart.html');

      // set this string dynamically in your code, this is just an example
      // this will play success.wav at half the volume and close the popup after a second
      url += `?volume=0.5&src=Sounds/${source}.wav&length=5000`;

      chrome.windows.create({
        type: 'popup',
        focused: false,
        top: 1,
        left: 1,
        height: 1,
        width: 1,
        url,
      });
    }
  });
};
