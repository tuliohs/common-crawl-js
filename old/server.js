const commoncrawl = require('commoncrawl')

let options = {
    index: 'CC-MAIN-2019-30-index',
    from: '2018',
    to: '2019',
    matchType: 'domain', // exact, prefix, host , domain,
    limit: 100,
    page: 1,
    pageSize: 100,
    showNumPages: false,
}

//commoncrawl.getIndex().then((data) => {
//    console.log(data.length);
//});

commoncrawl.searchURL('example.com/*')
    .then((data) => {
        console.log(data);
    });