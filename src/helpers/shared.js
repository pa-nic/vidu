export function validateEmail(email) {
  const rx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
  return rx.test(email);
}

export function formatNumber(number) {
  const SI_POSTFIXES = ["", "k", "M", "G", "T", "P", "E"];
  // what tier? (determines SI prefix)
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;
  // if zero, we don't need a prefix
  if (tier == 0) return number;
  // get postfix and determine scale
  const postfix = SI_POSTFIXES[tier];
  const scale = Math.pow(10, tier * 3);
  // scale the number
  const scaled = number / scale;
  // format number
  let formatted = scaled.toPrecision(3);
  // remove '.0' case
  if (/\.0$/.test(formatted))
    formatted = formatted.substr(0, formatted.length - 2);
  // return with added postfix
  return formatted + postfix;
}

function getNameOfDay(dayOfWeek) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayOfWeek];
}

export function getNamesOfLastXDays(today, days) {
  let daysOfLastWeek = [days];
  daysOfLastWeek[0] = "Today";
  for (let i = 1; i < days; i++) {
    let index = (today+(7 * Math.ceil(days / 7)) - i) % 7;
    daysOfLastWeek[i] = getNameOfDay(index);
  }
  return daysOfLastWeek;
}

function getNameOfMonth(monthOfYear) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[monthOfYear];
}

export function getNamesOfLastXMonths(month, months) {
  let lastTwelveMonth = [months];
  for (let i = 0; i < months; i++) {
    let index = (month+(12 * Math.ceil(months / 12)) - i) % 12;
    lastTwelveMonth[i] = getNameOfMonth(index);
  }
  return lastTwelveMonth;
}

export function getMaxOfArray(arr) {
  return Math.max( ...arr );
}
