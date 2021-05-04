const express = require('express');

const PORT = 3000;

const app = express();

const interval = process.argv[2] ?? 500;
const time = process.argv[3] ?? 3000;

app.get('*', (req, res) => {
    const showTimeInterval = setInterval(() => {
        console.log(new Date().toUTCString());
    }, interval);

    setTimeout(() => {
        clearInterval(showTimeInterval);
        let date = new Date().toUTCString();
        console.log(date);
        res.end(date);
    }, time);
})

app.listen(PORT, () => {
    console.log('I listen')
})

