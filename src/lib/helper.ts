export function validateEmail(email: string) {
    const rx = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);
    return rx.test(email);
}

export function formatNumber(number: number) {
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

export function getNameOfDay(dayOfWeek: number) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayOfWeek];
}

export function getNameOfMonth(monthOfYear: number) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[monthOfYear];
}

export function getMaxOfArray(arr: []) {
    return Math.max(...arr);
}