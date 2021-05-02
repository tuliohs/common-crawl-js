const fs = require('fs')
const neo4j = require('./neo4j-exec')
const newfile = 'similar-keywords.json'


//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------
//---------------------------------------------------------------

async function localJsonPush() {

    fs.readFile('../myjsonfile.json', 'utf8', async function readFileCallback(err, data) {
        if (err) { console.log(err); } else {
            let obj = JSON.parse(data);
            let resume = []
            let erros = 0

            //percorre o array
            for (c of obj) {
                let hot_words = c?.keywords

                //percorre o array novamente para cada item
                for (x of obj) {
                    let hot_words_compare = x?.keywords
                    //não é verificado quando se trata do mesmo array
                    const hostname = new URL(c.url);
                    const hostname_similar = new URL(x.url);

                    if (x !== c && hostname.hostname !== hostname_similar.hostname) {
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

                                const keyName = 'Page'
                                const pageid = 'a${x.id.split(' - ')[0]}a'
                                const query = ` CREATE (${pageid}:${keyName}{hostname:'${hostname.hostname}'})`
                                await neo4j.execute(query)
                                //await neo4j.execute(`CREATE INDEX ON :Page(url);`)

                                for (var el of intersection) {
                                    const keyNamek = 'Keyword'
                                    const queryk = ` CREATE ( ${el}:${keyNamek}{name:'${el}'})`
                                    await neo4j.execute(queryk)

                                    const queryr = ` CREATE (${el})-[:BY_KEYWORD]->(${pageid}) `
                                    await neo4j.execute(queryr)


                                    const queryp = ` CREATE (${pageid})-[:KEYWORD_IN {by:['${el}']}]->(${el}) `
                                    await neo4j.execute(queryp)

                                }

                                c.keyword_similarity.push({
                                    similariry: res,
                                    id_similariry: x.id,
                                    keywords: intersection,
                                    content_similariry: x.content
                                })
                                console.log('ok', res)

                                //if (c.content.length > 80 && x.content.length > 80 &&
                                //    res > 0.30
                                //)
                                resume.push({
                                    similariry: res,
                                    id_similariry: x.id,
                                    url_similariry: x.url,
                                    id: c.id,
                                    url: c.url,
                                    //content: c.content,
                                    //content_similariry: x.content
                                })
                            }
                        }

                    }
                }
            }
            fs.writeFile('./data/' + newfile, JSON.stringify(obj), 'utf8', () => { })


            resume.sort(function (a, b) { return b.similariry - a.similariry })
            fs.writeFile(`./data/resume-${newfile}`,
                JSON.stringify(resume), 'utf8', () => { })
        }
    });
}
localJsonPush()

//console.log(a)