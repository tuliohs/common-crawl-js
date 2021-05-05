
const axios = require("axios");
exports.scrapyAnalise = async (html, url) => {
    let header = {
        'Content-Type': 'application/json',
        'Content-Length': html.length
    }
    return await axios.post("http://127.0.0.1:5000/extraction", { url: url, html: html }, header)
}
exports.langDetect = async (content) => {
    return axios.post("http://127.0.0.1:5000/lang", { text: content })
}