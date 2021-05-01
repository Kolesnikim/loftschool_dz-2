const express = require('express');
const yargs = require('yargs');

const argv = yargs
    .usage('Usage: node $0 [options]')
    .help('help')
    .alias('help', 'h')
    .version('0.0.1')
    .alias('version', 'v')
    .example('node $0 -i [milliseconds] -t [milliseconds] -D')
    .option('interval', {
        alias: 'i',
        describe: 'Интервал между выводами',
        type: 'number',
        default: 1000
    })
    .option('time', {
        alias: 't',
        describe: 'Общее время вывода',
        type: 'number',
        default: 20000
    })
    .epilog('application')
    .argv;

const PORT = 3000;

const app = express();

let connections = [];
const interval = argv.interval;
const time = argv.time;

app.get('/', (req, res) => {
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

