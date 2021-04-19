const fs = require("fs");
const http = require("http");
const { recordIterator } = require("node-warc");
const zlib = require("zlib");
const axios = require("axios");

let entries = 0;
let matchingEntries = 0;
let hits = 0;
let arrayTemp = []
async function iterateRecords(warcStream) {
    for await (const record of recordIterator(warcStream)) {
        if (
            //somentes sites com ".com"
            record.warcHeader["WARC-Target-URI"] &&
            record.warcHeader["WARC-Target-URI"].indexOf(".com/") < 0
        )
            continue;

        entries++;
        const string = record.content.toString(); //toString("utf-8");
        let found = string.indexOf('forget') > 0

        if (found) {
            matchingEntries++;
            //console.log(record.warcTargetURI)
            await scrapyAnalise(string)
        }
    }
}

async function scrapyAnalise(html) {
    await axios.post("http://127.0.0.1:5000/extraction", {
        url: null,
        html: html
    }).then(c => {
        console.log(c.data)
        localJsonPush(c.data)
    })
        .catch(e => console.log("err -> ", e))
}

function localJsonPush(json) {
    arrayTemp.push(json)
    JSON.stringify(arrayTemp)
    fs.writeFile('myjsonfile.json', json, 'utf8', (e) => console.log(e));
}

const fileName = "http://commoncrawl.s3.amazonaws.com/crawl-data/CC-MAIN-2019-30/segments/1563195523840.34/warc/CC-MAIN-20190715175205-20190715200159-00000.warc.gz";

if (fileName.indexOf("http://") == 0) {
    http.get(fileName, res => {
        iterateRecords(res.pipe(zlib.createGunzip())).then(() => {
            console.log(`node-warc: ${hits} of ${matchingEntries}/${entries}`);
        });
    });
} else {
    iterateRecords(fs.createReadStream(fileName).pipe(zlib.createGunzip())).then(
        () => {
            console.log(`node-warc: ${hits} of ${matchingEntries}/${entries}`);
        }
    );
}