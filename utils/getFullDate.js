function getFullDate() {
    const data = new Date();
    const day = String(data.getDate()).padStart(2, 0);
    const month = String(data.getMonth() + 1).padStart(2, 0);
    const fullYear = String(data.getFullYear());
    const hour = String(data.getHours()).padStart(2, 0);
    const minute = String(data.getMinutes()).padStart(2, 0);
    const Seconds = String(data.getSeconds()).padStart(2, 0);
    return `${day}-${month}-${fullYear} ${hour}:${minute}:${Seconds}`;
    // codigo baseado no link https://www.google.com/search?q=como+pegar+a+data+atual+em+javascript&oq=como+pegar+a+dta+&aqs=chrome.1.69i57j0i13l9.4871j0j7&sourceid=chrome&ie=UTF-8
}

module.exports = getFullDate;
