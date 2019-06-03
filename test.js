//const serviceHttp = require('./serviceHttp')

//serviceHttp('https://www.set.or.th/set/todaynews.do?period=all&language=th&country=TH&market=','newsHtml.txt')
//serviceHttp('https://www.settrade.com/C13_MarketSummary.jsp?order=Y','TopLossHtmlbuffer.txt')
const fetch = require('node-fetch')

const url  = 'https://jsonplaceholder.typicode.com/todos?_limit=1'

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

async function getData() {
    let res = await fetch(url)
    let body = await res.text()
    console.log(body)
}

console.log(getData())
console.log('this should be print after result data, but it print first coz getData already be async function and return promise')