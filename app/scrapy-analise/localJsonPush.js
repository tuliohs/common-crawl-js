const fs = require('fs')
const apinpl = require('../api/nlp.api')
const file = 'C:\\Users\\MGS\\Sistemas\\ai\\common-crawl-js\\json\\myjsonfile.json'

exports.localJsonPush = async (json) => {

    const lang = await apinpl.langDetect(json.content)

    if (lang?.data !== "en")
        return console.log(lang.data, ' is not english')

    let novoItem = json //Object.assign(json, { url: url });
    fs.readFile(file, 'utf8', function readFileCallback(err, data) {
        if (err) { console.log(err); } else {
            obj = JSON.parse(data); //now it an object
            obj.push(novoItem); //add some data
            novoJson = JSON.stringify(obj); //convert it back to json
            fs.writeFile(file, novoJson, 'utf8', () => {
                console.log('sussessufly')
            }); // write it back 
        }
    });
}
