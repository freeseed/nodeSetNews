//https://www.set.or.th/set/companynews.do?symbol=PIMO&ssoPageId=8&language=th&country=TH
//https://www.set.or.th/set/companynews.do?symbol=PIMO&language=th&ssoPageId=8&country=TH&currentpage=0
const htmlparser = require("htmlparser2")
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const urlnews =  'https://www.set.or.th/set/companynews.do?ssoPageId=8&language=th&country=TH'

const optionDefinitions = [
  { name: 'all', alias: 'a', type: Boolean, defaultOption: false },
  { name: 'stock', alias: 's', type: String }
]

let stockName = 'XO'

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


function wrapHtmlParser (html,intPage) {

  const handler = new htmlparser.DomHandler(function (error, dom) {
    if (error)
      console.error(error)
    else {

     let alltr = htmlparser.DomUtils.find( (el)=> {
            return el.type === 'tag' && el.name === 'tr'
          },dom, true, 1000
      )

      //console.log('alltr.lenth=', alltr.length)
      //lastResultRows = alltr.length

      const regexDW = /\d\d\d\d\w/
      const regexSET = /SET/
      const regexTSD = /TSD/
      const regexmai = /mai/


      const regex1 = /ต้อน/
      //const regex2 = /-W.*เริ่ม/
      const regex2 = /-W/
      const regex3 = /วันซื้อขายวันสุดท้ายของ/
      const regex4 = /สรุปผลการดำเนินงาน/
      const regex5 = /การห้ามซื้อหรือขาย/
      //const regex6 = /การห้ามซื้อหรือขาย/
      //const regex7 = /การห้ามซื้อหรือขาย/

      alltr.forEach(
        (tr,itr)=> {
                    if(itr < 1000){ 
                      //console.log(tr)

                       let tds = htmlparser.DomUtils.find( (el)=> {
                            return el.type === 'tag' && el.name === 'td'
                          },[tr], true, 50
                      )

                      //console.log('tds.lenth=', tds.length)

                      let textintd = htmlparser.DomUtils.find( (el)=> {
                            return el.type === 'text'
                          },tds, true, 50
                      )

                      //console.log('textintd.lenth=', textintd.length)
                      if(textintd.length >= 7){

                        const strTime =  textintd[0].data.trim()
                        const strSymbol =  textintd[2].data.trim()
                        const strTitle =  textintd[3].data.trim()
                        //const strTitle =  textintd[4].data.trim()

                        //console.log(textintd)
                        const rowString = `Page ${intPage+1}-${itr} / ${strTime} ${strSymbol} ${strTitle}`

                        //console.log(rowString)
                        //|| rowString.match(regex4)
                        if ( (showAll || strTitle.match(regex1) || strTitle.match(regex2) || 
                              strTitle.match(regex3) || strTitle.match(regex4) || strTitle.match(regex5)) 
                               )  { 
                          console.log(rowString)
                        }

                      }

                    }
                }
      )

    }

  })

  let parser = new htmlparser.Parser(handler)
  parser.write(html)
  parser.end()
}

function substringTogetPageNumber(body){

    const str1 = '<strong>รวม'
    const str2 = 'หัวข้อข่าว</strong>'
    const posStart = body.indexOf(str1) + str1.length
    const posEnd = body.indexOf(str2,posStart)
    const strNumberOfNews = body.slice(posStart,posEnd).trim().replace(/,/g,'')
    const intNumberOfPage = Math.ceil(parseInt(strNumberOfNews)/20)

    return intNumberOfPage
}

async function processNewsByPage(url,intPage){
  
  let res = await fetch(url)
  let body = await res.text()
  wrapHtmlParser(body,intPage)

}

async function processPassNews(intPage){
  for(let i =0; i < intPage  ; i++){
      let paranews = `&symbol=${stockName}&currentpage=${i}`
      
      console.log('Process ', paranews)
      await processNewsByPage(urlnews+paranews,i)

      // fetch(urlnews+paranews)
      //     .then(res => res.text())
      //     .then(body => wrapHtmlParser(body,i+1) ) 
  }
  
}

function getAllNumberOfPageAndProcess(){
    let paranews =  `&symbol=${stockName}&currentpage=0`
    console.log(urlnews+paranews)
    fetch(urlnews+paranews)
    .then(res => res.text())
    .then(body => substringTogetPageNumber(body) )  
    .then(intPage => processPassNews(intPage)) 
}


getAllNumberOfPageAndProcess()

