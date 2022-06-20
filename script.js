let closeButton = document.getElementById('close-button');
let startButton = document.getElementById('play-button');
let pauseButton = document.getElementById('pause-button');
let resetButton = document.getElementById('stop-button');
let minutesDisplay = document.getElementById('minutes');
let secondsDisplay = document.getElementById('seconds');

let focusTimeElement = document.getElementById('focus-time');
let breakTimeElement = document.getElementById('break-time');
let timeError = document.getElementById('time-error');

let focusTime = 25,
  focusTimeSeconds = 0;
let breakTime = 5,
  breakTimeSeconds = 0;
let paused = false;

chrome.storage.local.set({ breakTimeStatus: false });

focusTimeElement.addEventListener('input', () => {
  if (/^([0-9]?[0-9]):[0-9][0-9]$/.test(focusTimeElement.value)) {
    startButton.style.pointerEvents = '';
    timeError.style.display = 'none';
  } else {
    startButton.style.pointerEvents = 'none';
    timeError.style.display = 'block';
  }
});

breakTimeElement.addEventListener('input', () => {
  if (/^([0-1]?[0-9]|2[0-3]):[0-9][0-9]$/.test(breakTimeElement.value)) {
    startButton.style.pointerEvents = '';
    timeError.style.display = 'none';
  } else {
    startButton.style.pointerEvents = 'none';
    timeError.style.display = 'block';
  }
});

let setTimes = () => {
  return new Promise((resolve, reject) => {
    focusTimeElement = document.getElementById('focus-time');
    breakTimeElement = document.getElementById('break-time');
    if (focusTimeElement.value.slice(0, 2)) {
      focusTime = focusTimeElement.value.split(':')[0];
      focusTimeSeconds = focusTimeElement.value.split(':')[1];
      console.log(focusTime);
    } else {
      focusTime = 25;
      focusTimeSeconds = 0;
    }
    if (breakTimeElement.value.slice(0, 2)) {
      breakTime = breakTimeElement.value.split(':')[0];
      breakTimeSeconds = breakTimeElement.value.split(':')[1];
    } else {
      breakTime = 25;
      breakTimeSeconds = 0;
    }
    chrome.storage.local.set({
      prevFocusTime: focusTimeElement.value,
      prevBreakTime: breakTimeElement.value,
    });
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
    // stop();
  }
  chrome.runtime.sendMessage({
    action: 'startTimer',
    focusTime: focusTime,
    focusTimeSeconds: focusTimeSeconds,
    breakTime: breakTime,
    breakTimeSeconds: breakTimeSeconds,
  });
  chrome.storage.local.get('soundsEnabled', ({ soundsEnabled }) => {
    if (soundsEnabled) {
      document.getElementById('start-audio').play();
    }
  });
};

let pause = () => {
  hide(pauseButton);
  show(startButton);
  show(resetButton);

  paused = true;
  chrome.runtime.sendMessage({ action: 'pauseTimer' });
  chrome.storage.local.get('soundsEnabled', ({ soundsEnabled }) => {
    if (soundsEnabled) {
      document.getElementById('pause-audio').play();
    }
  });
};

let stop = () => {
  paused = false;
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
  chrome.storage.local.get('soundsEnabled', ({ soundsEnabled }) => {
    if (soundsEnabled) {
      document.getElementById('stop-audio').play();
    }
  });
};

let timer = (minutes, seconds) => {
  minutesDisplay.innerText = formatTime(minutes);
  secondsDisplay.innerText = formatTime(seconds);
};

let completion = () => {
  chrome.storage.local.get('soundsEnabled', ({ soundsEnabled }) => {
    if (soundsEnabled) {
      document.getElementById('completion-audio').play();
    }
  });
};

let breakCompletion = () => {
  chrome.storage.local.get('soundsEnabled', ({ soundsEnabled }) => {
    if (soundsEnabled) {
      document.getElementById('break-audio').play();
    }
  });
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
  element.style.animation = '5s forwards float-away';
}

function show(element) {
  element.classList.remove('inactive');
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
      pauseButton.style.animation = '';
      startButton.style.animation = '';
      resetButton.style.animation = '';
      toggleOff(pauseButton);
      toggleOn(startButton);
      toggleOn(resetButton);
    } else if (!currentState.paused && currentState.running) {
      startButton.style.animation = '';
      pauseButton.style.animation = '';
      resetButton.style.animation = '';
      toggleOff(startButton);
      toggleOn(pauseButton);
      toggleOn(resetButton);
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
    toggleOn(homeElement);
    toggleOff(settingsElement);
    toggleOff(paletteElement);
  }
};

let settings = () => {
  if (settingsElement.classList.contains('inactive')) {
    toggleOff(homeElement);
    toggleOn(settingsElement);
    toggleOff(paletteElement);
  }
};

let palette = () => {
  if (paletteElement.classList.contains('inactive')) {
    toggleOff(homeElement);
    toggleOff(settingsElement);
    toggleOn(paletteElement);
  }
};

// ***Palette/color selection section***

let blueButton = document.getElementById('palette-blue');
let greenButton = document.getElementById('palette-green');
let orangeButton = document.getElementById('palette-orange');
let pinkButton = document.getElementById('palette-pink');
let root = document.querySelector(':root');

blueButton.addEventListener('click', () => {
  blueBubbleChange();
  paletteChange();
});
greenButton.addEventListener('click', () => {
  greenBubbleChange();
  paletteChange();
});
orangeButton.addEventListener('click', () => {
  orangeBubbleChange();
  paletteChange();
});
pinkButton.addEventListener('click', () => {
  pinkBubbleChange();
  paletteChange();
});

// timerElement is the main bubble element to change color
let timerElement = document.getElementById('timer');

// Initialize the color when popup opens
chrome.storage.local.get('theme', ({ theme }) => {
  if (theme == 'blue') {
    blueBubbleChange();
  } else if (theme == 'green') {
    greenBubbleChange();
  } else if (theme == 'orange') {
    orangeBubbleChange();
  } else {
    pinkBubbleChange();
  }
});

// onclick effects for changing buttons
let paletteChange = () => {
  chrome.storage.local.get('soundsEnabled', ({ soundsEnabled }) => {
    if (soundsEnabled) {
      document.getElementById('palette-audio').play();
    }
  });
};

let blueBubbleChange = () => {
  blueButton.classList.add('palette-selected');
  greenButton.classList.remove('palette-selected');
  orangeButton.classList.remove('palette-selected');
  pinkButton.classList.remove('palette-selected');
  root.style.setProperty('--button-outer-color', '#5cb9de');
  root.style.setProperty('--button-fill-color', '#9ad8f2');
  chrome.storage.local.set({ theme: 'blue' });
  timerElement.style.backgroundImage = 'url(/Images/bubble-blue.svg)';
};
let greenBubbleChange = () => {
  greenButton.classList.add('palette-selected');
  blueButton.classList.remove('palette-selected');
  orangeButton.classList.remove('palette-selected');
  pinkButton.classList.remove('palette-selected');
  root.style.setProperty('--button-outer-color', '#3b6b39');
  root.style.setProperty('--button-fill-color', '#5bbc57');
  chrome.storage.local.set({ theme: 'green' });
  timerElement.style.backgroundImage = 'url(/Images/bubble-green.svg)';
};
let orangeBubbleChange = () => {
  orangeButton.classList.add('palette-selected');
  blueButton.classList.remove('palette-selected');
  greenButton.classList.remove('palette-selected');
  pinkButton.classList.remove('palette-selected');
  root.style.setProperty('--button-outer-color', '#fba400');
  root.style.setProperty('--button-fill-color', '#ffc978');
  chrome.storage.local.set({ theme: 'orange' });
  timerElement.style.backgroundImage = 'url(/Images/bubble-orange.svg)';
};
let pinkBubbleChange = () => {
  pinkButton.classList.add('palette-selected');
  blueButton.classList.remove('palette-selected');
  greenButton.classList.remove('palette-selected');
  orangeButton.classList.remove('palette-selected');
  root.style.setProperty('--button-outer-color', '#f0a6a5');
  root.style.setProperty('--button-fill-color', '#fbcdcc');
  chrome.storage.local.set({ theme: 'pink' });
  timerElement.style.backgroundImage = 'url(/Images/bubble-pink.svg)';
};

// ***Settings section***
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason == 'install') {
    chrome.storage.local.set({ soundsEnabled: true });
    chrome.storage.local.set({ notificationsEnabled: true });
  } else if (details.reason == 'update') {
    chrome.storage.local.set({ soundsEnabled: true });
    chrome.storage.local.set({ notificationsEnabled: true });
  }
});

let soundToggleElement = document.getElementById('sound-toggle');
let notificationToggleElement = document.getElementById('notification-toggle');

soundToggleElement.addEventListener('change', (e) => {
  if (e.target.checked) {
    chrome.storage.local.set({ soundsEnabled: true });
  } else {
    chrome.storage.local.set({ soundsEnabled: false });
  }
});

notificationToggleElement.addEventListener('change', (e) => {
  if (e.target.checked) {
    chrome.storage.local.set({ notificationsEnabled: true });
  } else {
    chrome.storage.local.set({ notificationsEnabled: false });
  }
});
// Load state on startup
chrome.storage.local.get(
  [
    'soundsEnabled',
    'notificationsEnabled',
    'prevFocusTime',
    'prevBreakTime',
    'running',
  ],
  (currentState) => {
    if (currentState.soundsEnabled) {
      soundToggleElement.checked = true;
    } else {
      soundToggleElement.checked = false;
    }
    if (currentState.notificationsEnabled) {
      notificationToggleElement.checked = true;
    } else {
      notificationToggleElement.checked = false;
    }
    //sets timers
    if (currentState.prevFocusTime) {
      focusTimeElement.value = currentState.prevFocusTime;
      breakTimeElement.value = currentState.prevBreakTime;
      if (!currentState.running) {
        minutesDisplay.innerText = focusTimeElement.value.split(':')[0];
        secondsDisplay.innerText = focusTimeElement.value.split(':')[1];
      }
    }
  }
);

const img = document.querySelectorAll('img');
img.forEach((e) => {
  e.ondragstart = () => {
    return false;
  };
});
