const fs = require('fs')
const newfile = 'similar-keywords.json'

async function localJsonPush() {

    fs.readFile(newfile, 'utf8', function readFileCallback(err, data) {
        if (err) { console.log(err); } else {
            let obj = JSON.parse(data);
            let arrayTemp = []
            //percorre o array
            for (c of obj) {
                if (!c.keyword_similarity) continue

                //percorre o array de similaridade
                for (k of c.keyword_similarity)
                    arrayTemp.push({
                        value: k.similariry,
                        id: c.id,
                        content_similariry: k.content_similariry,
                        id_compare: k.id_similariry,
                        json: c
                    })
            }
            arrayTemp.sort(function (a, b) { return a.value - b.value })
            arrayTemp.map(c => {
                {
                    console.log(
                        "==================================================================================================",
                        c.json.content,
                        " -------------------------------------------------------------------------------------------------",
                        c.content_similariry
                    )

                }
            })
        }
    })
}
localJsonPush()
