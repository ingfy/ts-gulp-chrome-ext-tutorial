declare module 'gulp-zip' {
    function zip(filename: string): NodeJS.ReadWriteStream;
    
    export = zip;
}