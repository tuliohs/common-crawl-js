
exports.execute = async (query) => {//}, params = null }) {
  const neo4j = require('neo4j-driver');

  const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'root'),
    {/* encrypted: 'ENCRYPTION_OFF'*/ })

  const session = driver.session({ database: "neo4j" });
  let retorno = null
  await session.run(query)//, params)
    .then((result) => {
      //result.records.forEach((record) => {
      //  return record .get('n')
      //})
      //return record .get('n')
      retorno = result.records
    }).catch((error) => {
      console.log('error -> ', error?.message)
      retorno = error
    })
    .finally(() => {
      session.close();
      driver.close();
      return retorno
    })
}


//const query = "CREATE CONSTRAINT ON (p:Page) ASSERT p.id IS UNIQUE;"// MATCH (n:Person) RETURN n LIMIT 2500"
//console.log(this.execute(query))
//  `
//MATCH (movie:Movie {title:$favorite})<-[:ACTED_IN]-(actor)-[:ACTED_IN]->(rec:Movie)
// RETURN distinct rec.title as title LIMIT 20
//`;
