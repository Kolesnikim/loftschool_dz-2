const express = require('express');

const PORT = 3000;

const app = express();

let connections = [];
const interval = process.argv[2] ?? 1000;
const time = process.argv[3] ?? 20000;

app.get('/', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    connections.push(res);
})

const startDate = new Date();

setTimeout(function run() {
    let date = new Date();
    if (date - startDate > time) {
        connections.map((res, i) => {
            console.log(`Connection ${i + 1}: ${date.toUTCString()}`)
            res.write(date.toUTCString());
            res.end();
        })
        connections = [];
        date = new Date();
    }
    connections.map((res, i) => {
        console.log(`Connection ${i + 1}: ${date.toUTCString()}`);
    })
    setTimeout(run, interval);
}, interval)

app.listen(PORT, () => {
    console.log('I listen')
})

