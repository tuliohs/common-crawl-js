const fs = require("fs");
const http = require("http");
const zlib = require("zlib");

const iterateRecords = require('./iterateRecords').iterateRecords

let entries = 0;
let matchingEntries = 0;
let hits = 0;

const fileIndexName = "http://commoncrawl.s3.amazonaws.com/crawl-data/CC-MAIN-2019-30/segments/1563195523840.34/warc/CC-MAIN-20190715175205-20190715200159-00000.warc.gz";

if (fileIndexName.indexOf("http://") == 0) {
    http.get(fileIndexName, res => {
        iterateRecords(res.pipe(zlib.createGunzip())).then(() => {
            console.log(`node-warc: ${hits} of ${matchingEntries}/${entries}`);
        });
    });
} else {
    iterateRecords(fs.createReadStream(fileIndexName).pipe(zlib.createGunzip()).then(
        () => {
            console.log(`node-warc: ${hits} of ${matchingEntries}/${entries}`);
        }),
        entries, matchingEntries)

}