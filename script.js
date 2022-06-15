let closeButton = document.getElementById('close-button');
let startButton = document.getElementById('play-button');
let pauseButton = document.getElementById('pause-button');
let resetButton = document.getElementById('stop-button');
let minutesDisplay = document.getElementById('minutes');
let secondsDisplay = document.getElementById('seconds');

let focusTime = 25,
  focusTimeSeconds = 0;
let breakTime = 5,
  breakTimeSeconds = 0;
let paused = false;

chrome.storage.local.set({ breakTimeStatus: false });

let setTimes = () => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('focus-time').value.slice(0, 2)) {
      focusTime = document.getElementById('focus-time').value.slice(0, 2);
      focusTimeSeconds = document.getElementById('focus-time').value.slice(3);
      console.log(focusTimeSeconds);
    } else {
      focusTime = 25;
      focusTimeSeconds = 0;
    }
    if (document.getElementById('break-time').value.slice(0, 2)) {
      breakTime = document.getElementById('break-time').value.slice(0, 2);
      breakTimeSeconds = document.getElementById('break-time').value.slice(3);
    } else {
      breakTime = 25;
      breakTimeSeconds = 0;
    }
    resolve();
  });
};

closeButton.addEventListener('click', () => window.close());
startButton.addEventListener('click', () => start());
pauseButton.addEventListener('click', () => pause());
resetButton.addEventListener('click', () => stop());

let start = async () => {
  hide(startButton);
  show(pauseButton);
  show(resetButton);

  chrome.storage.local.set({ running: true });
  if (!paused) {
    await setTimes();
  }
  chrome.runtime.sendMessage({
    action: 'startTimer',
    focusTime: focusTime,
    focusTimeSeconds: focusTimeSeconds,
    breakTime: breakTime,
    breakTimeSeconds: breakTimeSeconds,
  });
  document.getElementById('start-audio').play();
};

let pause = () => {
  hide(pauseButton);
  show(startButton);
  show(resetButton);

  paused = true;
  chrome.runtime.sendMessage({ action: 'pauseTimer' });
  document.getElementById('pause-audio').play();
};

let stop = () => {
  show(startButton);
  hide(pauseButton);
  hide(resetButton);
  setTimes();
  chrome.storage.local.set({ running: false });
  chrome.runtime.sendMessage({
    action: 'stopTimer',
    focusTime: focusTime,
    focusTimeSeconds: focusTimeSeconds,
  });
  document.getElementById('stop-audio').play();
};

let timer = (minutes, seconds) => {
  minutesDisplay.innerText = formatTime(minutes);
  secondsDisplay.innerText = formatTime(seconds);
};

let completion = () => {
  document.getElementById('completion-audio').play();
};

let breakCompletion = () => {
  document.getElementById('break-audio').play();
};

chrome.runtime.sendMessage({ action: 'loadTime' });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == 'timer') {
    timer(request.minutes, request.seconds);
  }
  if (request.action == 'completion') {
    completion();
  }

  if (request.action == 'breakCompletion') {
    breakCompletion();
  }
});

function formatTime(x) {
  return x >= 10 || x === '00' ? x : `0${x}`;
}

function hide(element) {
  element.classList.remove('active');
  // element.classList.add('inactive');
  element.style.animation = '5s forwards float-away';
}

function show(element) {
  element.classList.remove('inactive');
  // element.classList.add('active');
  element.style.animation = '5s forwards float-in';
}

function toggleOn(element) {
  element.classList.remove('inactive');
  element.classList.add('active');
}

function toggleOff(element) {
  element.classList.add('inactive');
  element.classList.remove('active');
}

new Promise((resolve, reject) => {
  chrome.storage.local.get(['paused', 'running'], (currentState) => {
    if (currentState.paused && currentState.running) {
      toggleOff(pauseButton);
      toggleOn(startButton);
      toggleOn(resetButton);
      pauseButton.style.animation = '';
      startButton.style.animation = '';
      resetButton.style.animation = '';
    } else if (!currentState.paused && currentState.running) {
      toggleOff(startButton);
      toggleOn(pauseButton);
      toggleOn(resetButton);
      startButton.style.animation = '';
      pauseButton.style.animation = '';
      resetButton.style.animation = '';
    }
  });
  resolve();
});

// Nav bar
let homeButton = document.getElementById('home-button');
let settingsButton = document.getElementById('settings-button');
let paletteButton = document.getElementById('palette-button');
let homeElement = document.getElementById('home');
let settingsElement = document.getElementById('settings');
let paletteElement = document.getElementById('palette');

homeButton.addEventListener('click', () => home());
settingsButton.addEventListener('click', () => settings());
paletteButton.addEventListener('click', () => palette());

let home = () => {
  if (homeElement.classList.contains('inactive')) {
    toggle(homeElement);
    toggle(settingsElement);
    toggle(paletteElement);
  }
};

let settings = () => {
  if (settingsElement.classList.contains('inactive')) {
    toggle(homeElement);
    toggle(settingsElement);
    toggle(paletteElement);
  }
};

let palette = () => {
  if (paletteElement.classList.contains('inactive')) {
    toggle(homeElement);
    toggle(settingsElement);
    toggle(paletteElement);
  }
};
