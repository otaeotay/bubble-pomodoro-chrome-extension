const APP_URL =
  "https://chrome.google.com/webstore/detail/otto-%E2%80%93-pomodoro-timer-and/jbojhemhnilgooplglkfoheddemkodld?hl=en&authuser=0";

function show(element) {
  element.classList.remove("hide");
  element.classList.add("show");
}

function hide(element) {
  element.classList.remove("show");
  element.classList.add("hide");
}

const actions = {
  switchToMain: {
    action: "switchScreen",
    payload: { currentScreenState: "startScreen" },
  },
  switchToTimer: {
    action: "switchScreen",
    payload: { currentScreenState: "timerScreen" },
  },
  switchToPayment: {
    action: "switchScreen",
    payload: { currentScreenState: "proVersionScreen" },
  },
  switchToSetting: {
    action: "switchScreen",
    payload: { currentScreenState: "settingScreen" },
  },
  switchToInsights: {
    action: "switchScreen",
    payload: { currentScreenState: "insightsScreen" },
  },
  updateTimerCount: {
    action: "updateTimer",
    payload: { value: null },
  },
  startTimer: {
    action: "startTimer",
    payload: { value: null },
  },
  stopTimer: {
    action: "stopTimer",
    payload: { value: null },
  },
  pauseTimer: {
    action: "pauseTimer",
    payload: { value: null },
  },
  playTimer: {
    action: "playTimer",
    payload: { value: null },
  },
  getTimerState: {
    action: "getTimerState",
    payload: { value: null },
  },
  getAllState: {
    action: "getAllState",
    payload: { value: null },
  },
};

function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  );
}

function validateTimer(timer) {
  return /^(?:[0-5]?\d):(?:[0-5]?\d)$/.test(timer);
}

function percentage(partialValue, totalValue) {
  return ((100 * partialValue) / totalValue).toFixed(0);
}

function gotoSection(name) {
  var i;
  var x = document.getElementsByClassName("tab_section");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  // settings_section
  document.getElementById(name).style.display = "block";
  const settingsLabel = document.querySelector("#tabSettings");
  const blockListLabel = document.querySelector("#tabBlockList");
  const sharingLabel = document.querySelector("#tabSharing");
  const autoblockLabel = document.querySelector("#tabAutoblock");

  if (name === "blocklist_section") {
    settingsLabel.classList.remove("tabLabelActive");
    sharingLabel.classList.remove("tabLabelActive");
    autoblockLabel.classList.remove("tabLabelActive");
    blockListLabel.classList.add("tabLabelActive");
  } else if (name === "settings_section") {
    settingsLabel.classList.add("tabLabelActive");
    blockListLabel.classList.remove("tabLabelActive");
    autoblockLabel.classList.remove("tabLabelActive");
    sharingLabel.classList.remove("tabLabelActive");
  } else if (name === "sharing_section") {
    settingsLabel.classList.remove("tabLabelActive");
    blockListLabel.classList.remove("tabLabelActive");
    autoblockLabel.classList.remove("tabLabelActive");
    sharingLabel.classList.add("tabLabelActive");
  } else if (name === "autoblock_section") {
    settingsLabel.classList.remove("tabLabelActive");
    blockListLabel.classList.remove("tabLabelActive");
    sharingLabel.classList.remove("tabLabelActive");
    autoblockLabel.classList.add("tabLabelActive");
  }
}

function gotoInsightSection(name) {
  var i;
  var x = document.getElementsByClassName("tab_insights_section");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  // settings_section
  document.getElementById(name).style.display = "block";

  const tabInsights = document.querySelector("#tabInsights");
  const tabAdvancedInsights = document.querySelector("#tabAdvancedInsights");

  if (name === "GeneralInsightsSection") {
    tabAdvancedInsights.classList.remove("tabLabelActive");
    tabInsights.classList.add("tabLabelActive");
  } else {
    tabAdvancedInsights.classList.add("tabLabelActive");
    tabInsights.classList.remove("tabLabelActive");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // analytics
  _gaq.push(["_trackPageview"]);

  const startButton = document.querySelector(".startButton");
  const pauseButton = document.querySelector(".pauseButton");
  const playButton = document.querySelector(".playButton");

  const stopButton = document.querySelector(".stopButton");
  const settingsButton = document.querySelector(".settingsButton");
  const backButton = document.querySelector(".backButton");
  const insightsButton = document.querySelector(".insightsButton");
  const proVersionButton = document.querySelector(".proVersionButton");

  const appStartScreen = document.querySelector(".showStartScreen");
  const appTimerScreen = document.querySelector(".showTimerScreen");
  const appSettingScreen = document.querySelector(".showSettingsScreen");

  const appInsightsScreen = document.querySelector(".showInsightsScreen");
  const appProVersionScreen = document.querySelector(".showProVersionTab");

  const animationContainer = document.querySelector(".animationContainer");

  const blockSiteButton = document.querySelector(".blockSite");
  const BlockScreenCard = document.querySelector(".BlockScreenCard");
  const blockSiteLable = document.querySelector(".blockScreenText");

  const BlockListContainer = document.querySelector(".BlockListCard");

  const timerCounter = document.querySelector(".timeCount");
  const breakCounter = document.querySelector(".breakCount");

  const blockBoxSiteText = document.querySelector(".blockBoxSiteText");
  const blockBoxSiteButton = document.querySelector(".blockBoxButton");

  const tabBlockList = document.querySelector("#tabBlockList");
  const tabSettings = document.querySelector("#tabSettings");
  const tabSharing = document.querySelector("#tabSharing");
  const tabAutoBlock = document.querySelector("#tabAutoblock");

  const addNewSiteButton = document.querySelector(".addNewAutoBlockSite");

  const tabInsights = document.querySelector("#tabInsights");
  const tabAdvancedInsights = document.querySelector("#tabAdvancedInsights");

  // analytics event tracking
  startButton.addEventListener("click", () => trackButton("startSession"));
  insightsButton.addEventListener("click", () => trackButton("insights"));
  settingsButton.addEventListener("click", () => trackButton("settings"));
  proVersionButton.addEventListener("click", () =>
    trackButton("proVersionSection")
  );

  blockBoxSiteButton.addEventListener("click", () =>
    trackButton("block_from_main_page")
  );
  tabSettings.addEventListener("click", () => trackButton("go_to_settings"));
  tabBlockList.addEventListener("click", () => trackButton("go_to_blocklist"));
  tabSharing.addEventListener("click", () => trackButton("go_to_sharing"));
  tabAutoBlock.addEventListener("click", () => trackButton("go_to_autoblock"));

  blockSiteButton.addEventListener("click", () =>
    trackButton("big_block_button")
  );

  addNewSiteButton.addEventListener("click", () =>
    trackButton("new_autoblock_site")
  );

  tabAdvancedInsights.addEventListener("click", () =>
    trackButton("show_advanced_insights")
  );

  // end of event tracking

  tabInsights.addEventListener("click", () => {
    gotoInsightSection("GeneralInsightsSection");
  });

  tabAdvancedInsights.addEventListener("click", () => {
    gotoInsightSection("advancedInsightsSection");
  });

  addNewSiteButton.addEventListener("click", () => {
    gotoSection("blocklist_section");
  });

  tabBlockList.addEventListener("click", () => {
    gotoSection("blocklist_section");
  });

  tabSettings.addEventListener("click", () => {
    gotoSection("settings_section");
  });

  tabSharing.addEventListener("click", () => {
    gotoSection("sharing_section");
  });

  tabAutoBlock.addEventListener("click", () => {
    gotoSection("autoblock_section");
  });

  // reads timer input field
  timerCounter.addEventListener("input", (event) => {
    const timer = event.target.value;
    checkTimerInput(timer, "setCountTimer");
  });

  breakCounter.addEventListener("input", (event) => {
    const timer = event.target.value;
    checkTimerInput(timer, "setBreakTimer");
  });

  function checkTimerInput(timer, action) {
    if (validateTimer(timer)) {
      startButton.disabled = false;
      chrome.runtime.sendMessage({
        action: action,
        payload: { timer: timer },
      });
    } else {
      startButton.disabled = true;
    }
  }

  // settings page, blocksite button
  blockSiteButton.addEventListener("click", () => {
    const blockSiteName = document.querySelector(".blockSiteName");
    if (blockSiteName.value !== "" || blockSiteName.value !== undefined) {
      BlockScreenCard.classList.remove("errorCard");
      blockSiteLable.textContent = "Block site";
      blockSiteLable.classList.remove("errorText");

      if (validateUrl(blockSiteName.value)) {
        chrome.runtime.sendMessage(
          {
            action: "addSiteToBlock",
            url: blockSiteName.value,
          },
          (response) => {
            updateBlockedList(blockSiteName.value);
            blockSiteName.value = "";
          }
        );
      } else {
        BlockScreenCard.classList.add("errorCard");
        blockSiteLable.classList.add("errorText");
        blockSiteLable.textContent = "URL is invalid!";
      }
    }
  });

  // stop the timer
  playButton.addEventListener("click", (e) => {
    hide(playButton);
    show(pauseButton);
    chrome.runtime.sendMessage(actions.pauseTimer);
    chrome.runtime.sendMessage({
      action: "startAnimation",
      animationName: "sleep",
    });
  });

  // resume paused timer
  pauseButton.addEventListener("click", (e) => {
    hide(pauseButton);
    show(playButton);
    chrome.runtime.sendMessage(actions.playTimer);
    chrome.runtime.sendMessage({
      action: "startAnimation",
      animationName: "workout",
    });
  });

  // start session
  startButton.addEventListener("click", (e) => {
    if (timerCounter.value === "" || breakCounter.value === "") {
      e.preventDefault();
      startButton.disabled = true;
    } else {
      startButton.disabled = false;

      chrome.runtime.sendMessage(actions.switchToTimer, function (response) {
        hide(appStartScreen);
        show(appTimerScreen);

        chrome.runtime.sendMessage(actions.startTimer);
      });
    }
  });

  // end session
  stopButton.addEventListener("click", (e) => {
    chrome.runtime.sendMessage(actions.stopTimer);
    chrome.runtime.sendMessage(actions.switchToMain, function (response) {
      hide(appTimerScreen);
      show(appStartScreen);
    });
  });

  proVersionButton.addEventListener("click", (e) => {
    chrome.runtime.sendMessage(actions.switchToPayment, function (response) {
      hide(appStartScreen);
      hide(appTimerScreen);
      hide(animationContainer);
      hide(appInsightsScreen);
      show(appProVersionScreen);
      hide(appSettingScreen);
    });
  });

  // go to settings page
  settingsButton.addEventListener("click", (e) => {
    chrome.runtime.sendMessage(actions.switchToSetting, function (response) {
      hide(appStartScreen);
      hide(appTimerScreen);
      hide(animationContainer);
      hide(appInsightsScreen);
      hide(appProVersionScreen);
      show(appSettingScreen);
    });
  });

  insightsButton.addEventListener("click", () => {
    chrome.runtime.sendMessage(actions.switchToInsights, function (response) {
      hide(appStartScreen);
      hide(appTimerScreen);
      hide(animationContainer);
      hide(appSettingScreen);
      hide(appProVersionScreen);
      show(appInsightsScreen);
    });
  });

  // go back to main page
  backButton.addEventListener("click", (e) => {
    chrome.runtime.sendMessage(actions.switchToMain, function (response) {
      hide(appInsightsScreen);
      hide(appTimerScreen);
      hide(appSettingScreen);
      hide(appProVersionScreen);
      show(appStartScreen);
      show(animationContainer);
      // unhide settings
    });
  });

  // â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“-
  // RUN TIME EVENTS - When the popup is opened
  // â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“

  // When the popup is opened init everything with the correct state
  chrome.runtime.sendMessage(actions.getAllState, function (response) {
    let timerMinutes = Math.floor(response.payload.timerCount / 60);
    let timerSeconds = response.payload.timerCount - timerMinutes * 60;

    let breakMinutes = Math.floor(response.payload.breakCount / 60);
    let breakSeconds = response.payload.breakCount - breakMinutes * 60;

    let timerString = `${timerMinutes}:${
      timerSeconds <= 9 ? `0${timerSeconds}` : timerSeconds
    }`;
    let breakString = `${breakMinutes}:${
      breakSeconds <= 9 ? `0${breakSeconds}` : breakSeconds
    }`;

    timerCounter.value = timerString;
    breakCounter.value = breakString;

    // init health bar
    const health = parseInt(response.payload.health);
    const healthPercent = percentage(health, 100);
    const healthProgressMeter = document.querySelector(
      ".healthprogressBarMeter"
    );
    healthProgressMeter.style.width = healthPercent + "%";

    // if timer is on and popup is opened show the timer screen
    if (response.payload.isTimerOn) {
      hide(appStartScreen);
      show(appTimerScreen);

      // while state of the timer is paused, the button should correspond with it's state
      if (response.payload.isPaused) {
        hide(playButton);
        show(pauseButton);
        // sleep animation when paused
        chrome.runtime.sendMessage({
          action: "startAnimation",
          animationName: "sleep",
        });
      } else {
        // work out animation when timer is on
        chrome.runtime.sendMessage({
          action: "startAnimation",
          animationName: "workout",
        });
      }
    } else {
      // timer is off, show idle animtion
      chrome.runtime.sendMessage({
        action: "startAnimation",
        animationName: "idle",
      });
    }

    // this part should only run if the screen is a timerScreen
    // add breakTime class to all elements
    if (response.payload.currentScreenState === "timerScreen") {
      if (response.payload.isBreakTime) {
        updateTimerUI("break");
        chrome.runtime.sendMessage({
          action: "startAnimation",
          animationName: "sleep",
        });
      } else {
        updateTimerUI("work");
        chrome.runtime.sendMessage({
          action: "startAnimation",
          animationName: "workout",
        });
      }
    }

    chrome.tabs.query(
      { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
      function (tabs) {
        const currentURL = tabs[0].url;
        if (validateUrl(currentURL)) {
          blockBoxSiteButton.disabled = false;

          const strippedBase = currentURL
            .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
            .split("/")[0];

          if (response.payload.blockedSites.includes(strippedBase)) {
            blockBoxSiteText.innerHTML = `You are on ${strippedBase}`;
            blockBoxSiteButton.innerHTML = "Blocked";
          } else {
            blockBoxSiteText.innerHTML = `You are on ${strippedBase}`;
            blockBoxSiteButton.addEventListener("click", () => {
              chrome.runtime.sendMessage({
                action: "addSiteToBlock",
                url: strippedBase,
              });
              blockBoxSiteButton.innerHTML = "Blocked";
            });
          }
        } else {
          blockBoxSiteText.innerHTML = `You must be on a website`;
          blockBoxSiteButton.disabled = true;
        }
      }
    );
  });

  // â€“â€“â€“â€“â€“â€“incoming messagesâ€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“â€“
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // update the timer progress bar
    if (message.action === "setPercentage") {
      const percentage = message.payload.percentage;
      const countdown = message.payload.count;
      const progressBarMeter = document.querySelector(".progressBarMeter");
      const timerCountdownText = document.querySelector(".timerScreenCounter");
      timerCountdownText.textContent = countdown;
      progressBarMeter.style.width = percentage + "%";
    }

    if (message.action === "updateHealthMeter") {
      const health = parseInt(message.health);
      const healthPercent = percentage(health, 100);
      const healthProgressMeter = document.querySelector(
        ".healthprogressBarMeter"
      );
      healthProgressMeter.style.width = healthPercent + "%";
    }

    // set the UI to break timer
    if (message.action === "requestBreakTimer") {
      updateTimerUI("break");
      chrome.runtime.sendMessage({
        action: "startAnimation",
        animationName: "sleep",
      });
    }

    // clean up break timer and start work timer
    if (message.action === "requestWorkTimer") {
      updateTimerUI("work");
      chrome.runtime.sendMessage(actions.startTimer);
      chrome.runtime.sendMessage({
        action: "startAnimation",
        animationName: "workout",
      });
    }
  });

  // render blocked site data every time popup is opened
  chrome.runtime.sendMessage({ action: "requestBlockList" }, (response) => {
    const blockedSites = response.data;
    blockedSites.map((site) => {
      updateBlockedList(site);
    });
  });

  const updateBlockedList = (site) => {
    let element = document.createElement("DIV");
    element.classList.add("BlockListItem");
    let p = document.createElement("p");
    p.innerHTML = site;

    let button = document.createElement("button");
    button.classList.add("unblockButton");
    button.innerHTML = "unblock";
    button.dataset.url = site;
    button.addEventListener("click", removeURLFromList);

    element.appendChild(p);
    element.appendChild(button);

    BlockListContainer.appendChild(element);
  };

  // onClick method to remove URL from the DOM
  const removeURLFromList = (event) => {
    const url = event.target.dataset.url;
    chrome.runtime.sendMessage(
      { action: "requestUnblockURL", payload: { url: url } },
      (response) => {
        BlockListContainer.removeChild(event.target.parentNode);
      }
    );
  };
});

function updateTimerUI(uiType) {
  const pauseButton = document.querySelector(".pauseButton");
  const playButton = document.querySelector(".playButton");
  const progressBarMeter = document.querySelector(".progressBarMeter");
  const timerLabel = document.querySelector(".timerScreenLabel");
  const stopButton = document.querySelector(".stopButton");

  if (uiType === "work") {
    timerLabel.textContent = "until break";
    progressBarMeter.classList.remove("breakColor");
    playButton.classList.remove("breakColor");
    pauseButton.classList.remove("breakColor");
    stopButton.classList.remove("breakColorDark");
  } else {
    timerLabel.textContent = "until work";
    progressBarMeter.classList.add("breakColor");
    playButton.classList.add("breakColor");
    pauseButton.classList.add("breakColor");
    stopButton.classList.add("breakColorDark");
  }
}
