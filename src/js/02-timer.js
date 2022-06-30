// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
// Notiflix library
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  dateInput: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};
let deltaTime = null;
let timerId = null;

refs.btnStart.addEventListener('click', countDown);
disableBtn(refs.btnStart);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    deltaTime = selectedDates[0].getTime() - Date.now();
    if (deltaTime < 0) {
      disableBtn(refs.btnStart);
      Notify.failure('Please choose a date in the future');
    } else {
      refs.btnStart.disabled = false;
    }
  },
};

console.log(refs.dateInput);

flatpickr(refs.dateInput, options);

function disableBtn(btn) {
  btn.disabled = true;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function countDown() {
  this.disabled = true;
  timerId = setInterval(() => {
    if (deltaTime < 1000) {
      clearInterval(timerId);
      return;
    }
    deltaTime -= 1000;
    const { days, hours, minutes, seconds } = convertMs(deltaTime);
    refs.days.textContent = addLeadingZero(days);
    refs.hours.textContent = addLeadingZero(hours);
    refs.minutes.textContent = addLeadingZero(minutes);
    refs.seconds.textContent = addLeadingZero(seconds);
  }, 1000);
}
