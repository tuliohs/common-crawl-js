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

            //Neo4j variables
            const keyName_page = 'pagesN'
            const keyName_keyword = 'keywordsN'
            const relatName = 'by_keywordsN'
            //create constanst if not existis
            await neo4j.execute(`CREATE CONSTRAINT IF NOT EXISTS ON (p:${keyName_page}) ASSERT p.hostname IS UNIQUE;`)
            await neo4j.execute(`CREATE CONSTRAINT IF NOT EXISTS ON (m:${keyName_keyword}) ASSERT m.name IS UNIQUE;`)


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

                                //inside string
                                const pageid = `A${hostname.hostname}`.replaceAll('.', '')
                                //Salva a page
                                const query = `CREATE (${pageid}:${keyName_page}{hostname:'${hostname.hostname}'});`
                                await neo4j.execute(query)

                                for (var el of intersection) {
                                    //salva a keyword
                                    const queryk = `CREATE (${el}:${keyName_keyword} {name:'${el}'});`
                                    await neo4j.execute(queryk)

                                    //relaciona a keyword com a pagina (Não funcionou diretamente)
                                    //const queryr = `CREATE (${el})-[:${relatName}]->(${pageid})`

                                    try {
                                        const queryRelatExist = `
                                        MATCH (a:${keyName_keyword}), (b:${keyName_page}) WHERE a.name ='${el}' AND b.hostname='${hostname.hostname}'   
                                        RETURN  exists((a)-[:${relatName}]->(b) )                                      
                                        `
                                        //verify if already exist
                                        const result = await neo4j.executeOut(queryRelatExist)
                                        if (!result.records.map(record => record.get(0))[0]) {
                                            //forçando o relacionamento com match
                                            const queryCreateRelat = `
                                            MATCH (a:${keyName_keyword}), (b:${keyName_page}) WHERE a.name ='${el}' AND b.hostname='${hostname.hostname}'   
                                            CREATE (a)-[:${relatName}]->(b) RETURN a,b                                       
                                            `
                                            await neo4j.execute(queryCreateRelat)
                                        }
                                        //relacionando com match para forçar o relacionamento
                                    } catch (e) { console.error('error in relationship', e) }
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