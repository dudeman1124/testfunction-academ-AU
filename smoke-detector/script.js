const button = document.querySelector('#test-button');
const audio = document.querySelector('#alarm-audio');
const message = document.querySelector('#message');

button.addEventListener('click', async () => {
  audio.currentTime = 0;
  button.classList.add('is-playing');
  message.textContent = 'Alarm sounding...';

  try {
    await audio.play();
  } catch {
    message.textContent = 'Playback was blocked. Open the source link and try again.';
  }
});

audio.addEventListener('ended', () => {
  button.classList.remove('is-playing');
  message.textContent = 'System ready for another sound check.';
});

audio.addEventListener('error', () => {
  button.classList.remove('is-playing');
  message.textContent = 'The audio source could not be reached. Check the source link below.';
});