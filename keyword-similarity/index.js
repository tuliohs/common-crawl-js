const fs = require('fs')
const newfile = 'similar-keywords.json'

async function localJsonPush() {

    fs.readFile('../myjsonfile.json', 'utf8', function readFileCallback(err, data) {
        if (err) { console.log(err); } else {
            let obj = JSON.parse(data);
            let resume = []

            //percorre o array
            for (c of obj) {
                let hot_words = c?.keywords

                //percorre o array novamente para cada item
                for (x of obj) {
                    let hot_words_compare = x?.keywords
                    //não é verificado quando se trata do mesmo array
                    if (x !== c && c.url !== x.url) {
                        //caso todas as keywords sejam iguais
                        if (hot_words === hot_words_compare) {
                            let item = c
                            let item_compare = x
                        }
                        else {
                            //keywords iguais
                            let intersection = hot_words_compare.filter(a => hot_words.includes(a))
                            if (intersection.length > 0) {
                                let res =
                                    ((intersection.length / hot_words_compare.length)
                                        + (intersection.length / hot_words.length))
                                    / 2

                                //cria o campo caso não exista
                                if (!c?.keyword_similarity)
                                    c.keyword_similarity = []

                                c.keyword_similarity.push({
                                    similariry: res,
                                    id_similariry: x.id,
                                    keywords: intersection,
                                    content_similariry: x.content
                                })
                                console.log('ok', res)

                                resume.push({
                                    similariry: res,
                                    id_similariry: x.id,
                                    url_similariry: x.url,
                                    id: c.id,
                                    url: c.url,
                                    content: c.content,
                                    content_similariry: x.content
                                })
                            }
                        }

                    }
                }
            }
            fs.writeFile(newfile, JSON.stringify(obj), 'utf8', () => { })


            resume.sort(function (a, b) { return b.similariry - a.similariry })
            fs.writeFile(`resume-${newfile}`, JSON.stringify(resume), 'utf8', () => { })
        }
    });
}
localJsonPush()

//console.log(a)