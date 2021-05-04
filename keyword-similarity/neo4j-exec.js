const fs = require('fs')

exports.execute = async (query) => {//}, params = null }) {
  const neo4j = require('neo4j-driver');

  const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'root'),
    {/* encrypted: 'ENCRYPTION_OFF'*/ })

  const session = driver.session({ database: "neo4j" });
  let retorno = null

  fs.writeFileSync('./data/script-generate.txt', query + "\r\n", { flag: 'a+' })

  //return
  await session.run(query)//, params)
    .then((result) => {
      //result.records.forEach((record) => {
      //  return record .get('n')
      //})
      //return record .get('n')
      retorno = result.records
      return retorno
    }).catch((error) => {
      console.log('error -> ', error?.message)
      retorno = error
    })
    .finally(() => {
      session.close();
      driver.close();
      //return retorno
    })
}


exports.executeOut = async (query) => {//}, params = null }) {
  const neo4j = require('neo4j-driver');

  const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'root'),
    {/* encrypted: 'ENCRYPTION_OFF'*/ })

  const session = driver.session({ database: "neo4j" });

  return await session.run(query)

  //var writeTxResultPromise = 
  session.writeTransaction(async txc => {
    // used transaction will be committed automatically, no need for explicit commit/rollback

    var result = await txc.run(query)
    // at this point it is possible to either return the result or process it and return the
    // result of processing it is also possible to run more statements in the same transaction
    return result.records.map(record => record.get('exist'))
  })


  //.finally(() => {
  //  session.close();
  //  driver.close();
  //})
}




//const query = "CREATE CONSTRAINT ON (p:Page) ASSERT p.id IS UNIQUE;"// MATCH (n:Person) RETURN n LIMIT 2500"
//console.log(this.execute(query))
//  `
//MATCH (movie:Movie {title:$favorite})<-[:ACTED_IN]-(actor)-[:ACTED_IN]->(rec:Movie)
// RETURN distinct rec.title as title LIMIT 20
//`;
