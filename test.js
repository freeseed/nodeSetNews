//const serviceHttp = require('./serviceHttp')
//serviceHttp('https://www.set.or.th/set/todaynews.do?period=all&language=th&country=TH&market=','newsHtml.txt')
//serviceHttp('https://www.settrade.com/C13_MarketSummary.jsp?order=Y','TopLossHtmlbuffer.txt')

// function getData() {
//     let p1 = new Promise( 
//         (resolve, reject) => {
//             fetch(url)
//                 .then(res => res.text())
//                 .then(body => console.log(body))
//                 .then( ()=> resolve() )
//         }
//     )
//     return p1
// }
// getData().then(()=>console.log('Called Async Function') )
//----------------------------------------------------------
// const fetch = require('node-fetch')

// const url  = 'https://jsonplaceholder.typicode.com/todos?_limit=1'

// async function getData() {
//     let res = await fetch(url)
//     let body = await res.text()
//     console.log(body)
// }

// console.log(getData())
// console.log('this should be print after result data, but it print first coz getData already be async function and return promise')

const optionDefinitions = [
    { name: 'all', alias: 'a', type: Boolean, defaultOption: false },
    { name: 'stock', alias: 's', type: String }
]

const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)

console.log(options)

if (options.stock) {
  stockName = options.stock.toUpperCase()
} else {
  console.log('Error : require parameter stock name [-s PIMO] or [--stock PIMO]')
  return
}

const showAll  = (options.all === true)

console.log(stockName, showAll)