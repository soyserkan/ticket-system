import fs from 'fs';

export class Directories {
    static main: string = __dirname;
    static scripts: string = `${Directories.main}/../scripts`;
    static public: string = `${Directories.main}/../public`;
    static images: string = `${Directories.public}/images`;
    static log: string = `${Directories.public}/log`;

    static async createDirectories() {
        var directories = [Directories.scripts, Directories.public, Directories.images, Directories.log];
        for (var dir of directories) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        }
    }
}