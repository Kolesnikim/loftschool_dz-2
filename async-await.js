const util = require('util');
const fs = require('fs');
const path = require('path');

const yargs = require('yargs');

const readDir = util.promisify(fs.readdir);
const mkDir = util.promisify(fs.mkdir, {recursive: true});
const rmDir = util.promisify(fs.rmdir, {recursive: true});
const stat = util.promisify(fs.stat);
const copyFile = util.promisify(fs.copyFile);
const unlink = util.promisify(fs.unlink);

const argv = yargs
    .usage('Usage: node $0 [options]')
    .help('help')
    .alias('help', 'h')
    .version('0.0.1')
    .alias('version', 'v')
    .example('node $0 -e [path] -o [path] -D')
    .option('entry', {
        alias: 'e',
        describe: 'Путь к читаемой папке',
        demandOption: true
    })
    .option('output', {
        alias: 'o',
        describe: 'Путь к итоговой папке',
        default: './output'
    })
    .option('delete', {
        alias: 'D',
        describe: 'Удалить исходню директорию?',
        type: 'boolean',
        default: false
    })
    .epilog('application')
    .argv;

const paths = {
    src: path.normalize(path.resolve(__dirname, argv.entry)),
    dist: path.normalize(path.resolve(__dirname, argv.output))
}

const deleteSource = argv.delete;

async function readDirRecursivelyAsync(base, level) {
    try {
        const files = await readDir(base);

        for await (let file of files) {
            const firstLetter = file[0].toUpperCase();
            await mkDir(path.join(paths.dist, firstLetter), {recursive: true});

            const futureLocation = path.join(paths.dist, firstLetter, file)
            const currentLocation = path.join(base, file);

            const state = await stat(currentLocation);

            if (state.isDirectory()) {
                await readDirRecursivelyAsync(currentLocation, level + 1)
            } else {
                await copyFile(currentLocation, futureLocation);

                if (eval(deleteSource)) {
                    await unlink(currentLocation);
                }
            }
        }
    } catch (error) {
        throw error;
    }
}

readDirRecursivelyAsync(paths.src, 0)
    .then(() => {
        if (deleteSource) return rmDir(paths.src, {recursive: true});
    })
    .then(() => {})
    .catch(error => console.log(error))

