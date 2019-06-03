const https = require('https')
const fs = require('fs')

// this file create for helping save html to text file

module.exports = function getDataFromURL(url,filename) {
  let htmldata =Buffer.from('');
  //let url = url || 'https://www.settrade.com/C13_MarketSummary.jsp?order=Y'

  https.get(url, (res) => {
    //console.log('statusCode:', res.statusCode)
    //console.log('headers:', res.headers)
  
    res.on('data', (d) => {
      htmldata += d;
    })
  
    res.on('end', () => {
        //console.log('receive data completed.')
        fs.writeFile(filename, htmldata, function (err) {
          if (err) throw err
          console.log('Saved!')
      })
    })

  }).on('error', (err) => { console.error(err) })
}