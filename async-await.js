const util = require('util');
const fs = require('fs');
const path = require('path');

const readDir = util.promisify(fs.readdir);
const mkDir = util.promisify(fs.mkdir, {recursive: true});
const rmDir = util.promisify(fs.rmdir, {recursive: true});
const stat = util.promisify(fs.stat);
const copyFile = util.promisify(fs.copyFile);
const unlink = util.promisify(fs.unlink);

const customDir = process.argv[2] ?? 'source';
const newCustomDir = process.argv[3] ?? 'new-source';
const deleteSource = process.argv[4] ?? true;

const base = path.join(__dirname, customDir);
const newBase = path.join(__dirname,  newCustomDir);

async function readDirRecursivelyAsync(base, level) {
    try {
        const files = await readDir(base);

        for await (let file of files) {
            const firstLetter = file[0].toUpperCase();
            await mkDir(path.join(newBase, firstLetter), {recursive: true});

            const futureLocation = path.join(newCustomDir, firstLetter, file)
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

readDirRecursivelyAsync(base, 0)
    .then(() => {
        if (eval(deleteSource)) return rmDir(base, {recursive: true});
    })
    .then(() => {})
    .catch(error => console.log(error))

