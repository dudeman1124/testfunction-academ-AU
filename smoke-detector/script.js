const button = document.querySelector('#test-button');
const audio = document.querySelector('#alarm-audio');
const message = document.querySelector('#message');
const fixedButton = document.querySelector('#fixed-interval-button');
const randomButton = document.querySelector('#random-interval-button');
const secondsInput = document.querySelector('#interval-seconds');

let fixedTimer = null;
let randomTimer = null;

function playAlarm(status = 'Alarm sounding...') {
  audio.currentTime = 0;
  button.classList.add('is-playing');
  message.textContent = status;
  return audio.play().catch(() => {
    button.classList.remove('is-playing');
    message.textContent = 'Playback was blocked. Open the source link and try again.';
  });
}

function setToggleState(control, enabled, activeLabel, inactiveLabel) {
  control.classList.toggle('is-active', enabled);
  control.setAttribute('aria-pressed', String(enabled));
  control.querySelector('span:last-of-type').textContent = enabled ? activeLabel : inactiveLabel;
}

function stopFixedInterval() {
  clearInterval(fixedTimer);
  fixedTimer = null;
  setToggleState(fixedButton, false, 'Stop set interval', 'Start set interval');
}

function stopRandomInterval() {
  clearTimeout(randomTimer);
  randomTimer = null;
  setToggleState(randomButton, false, 'Stop random interval', 'Start random interval');
}

function scheduleRandomBeep() {
  const delay = Math.floor(Math.random() * 120 + 1) * 1000;
  randomTimer = setTimeout(() => {
    playAlarm('Random alarm sounding...');
    scheduleRandomBeep();
  }, delay);
}

button.addEventListener('click', async () => {
  await playAlarm();
});

fixedButton.addEventListener('click', () => {
  if (fixedTimer) {
    stopFixedInterval();
    message.textContent = 'Set interval stopped.';
    return;
  }

  const seconds = Math.min(3600, Math.max(1, Number(secondsInput.value) || 30));
  secondsInput.value = seconds;
  stopRandomInterval();
  fixedTimer = setInterval(() => playAlarm(`Set alarm sounding every ${seconds} seconds...`), seconds * 1000);
  setToggleState(fixedButton, true, 'Stop set interval', 'Start set interval');
  message.textContent = `Set interval enabled: every ${seconds} seconds.`;
});

randomButton.addEventListener('click', () => {
  if (randomTimer) {
    stopRandomInterval();
    message.textContent = 'Random interval stopped.';
    return;
  }

  stopFixedInterval();
  setToggleState(randomButton, true, 'Stop random interval', 'Start random interval');
  message.textContent = 'Random interval enabled: next beep in 1–120 seconds.';
  scheduleRandomBeep();
});

audio.addEventListener('ended', () => {
  button.classList.remove('is-playing');
  if (!fixedTimer && !randomTimer) message.textContent = 'System ready for another sound check.';
});

audio.addEventListener('error', () => {
  button.classList.remove('is-playing');
  message.textContent = 'The audio source could not be reached. Check the source link below.';
});