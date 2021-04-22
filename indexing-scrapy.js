const fs = require("fs");
const http = require("http");
const { recordIterator } = require("node-warc");
const zlib = require("zlib");
const axios = require("axios");

let entries = 0;
let matchingEntries = 0;
let hits = 0;
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
        if (!string)
            continue;

        let found = string.indexOf('forget') > 0

        if (found) {
            matchingEntries++;

            await scrapyAnalise(string, record.warcTargetURI)
        }
    }
}

const scrapyAnalise = async (html, url) => {
    let header = {
        'Content-Type': 'application/json',
        'Content-Length': html.length
    }
    await axios.post("http://127.0.0.1:5000/extraction", { url: url, html: html }, header)
        .then(c => localJsonPush(c.data))
        .catch(e => console.log("err -> ", e))
}

async function localJsonPush(json) {
    const lang = await axios.post("http://127.0.0.1:5000/lang", { text: json.content })
    if (lang?.data !== "en")
        return console.log(lang.data, ' is not english')

    let novoItem = json //Object.assign(json, { url: url });
    fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data) {
        if (err) { console.log(err); } else {
            obj = JSON.parse(data); //now it an object
            obj.push(novoItem); //add some data
            novoJson = JSON.stringify(obj); //convert it back to json
            fs.writeFile('myjsonfile.json', novoJson, 'utf8', () => { }); // write it back 
        }
    });
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