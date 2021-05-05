
const { recordIterator } = require("node-warc");
const scrapyAnalise = require('../api/nlp.api').scrapyAnalise
const localJsonPush = require('./localJsonPush').localJsonPush

exports.iterateRecords = async (warcStream, entries, matchingEntries, filtro = null) => {

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

        if (string.indexOf(filtro) > 0 || filtro) {
            matchingEntries++;

            await scrapyAnalise(string, record.warcTargetURI)
                .then(c => localJsonPush(c.data))
                .catch(e => console.log("err -> ", e))
        }
    }
}
