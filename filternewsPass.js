//https://www.set.or.th/set/newslist.do?headline=&to=27%2F05%2F2019&source=&symbol=&submit=%E0%B8%84%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%B2&newsGroupId=&securityType=&from=20%2F05%2F2019&language=th&currentpage=1&country=TH
const htmlparser = require("htmlparser2")
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
let showAll  = (process.argv.indexOf('all') > -1)
const urlnews =  'https://www.set.or.th/set/newslist.do?headline=&source=&symbol=&submit=%E0%B8%84%E0%B9%89%E0%B8%99%E0%B8%AB%E0%B8%B2&newsGroupId=&securityType=&language=th&country=TH'
// example of paranews  '&to=27%2F05%2F2019&from=20%2F05%2F2019&currentpage=58'
let yesterdayDate = new Date()
yesterdayDate.setDate(yesterdayDate.getDate()-1);
let passdaysDate = new Date()
passdaysDate.setDate(passdaysDate.getDate()-6);

let fd=passdaysDate.getDate(), fm=passdaysDate.getMonth()+1 ,fy=passdaysDate.getFullYear()
let td=yesterdayDate.getDate(), tm=yesterdayDate.getMonth()+1 ,ty=yesterdayDate.getFullYear()

// let fd=yesterdayDate.getDate(), fm=yesterdayDate.getMonth()+1 ,fy=yesterdayDate.getFullYear()
// let td=passdaysDate.getDate(), tm=passdaysDate.getMonth()+1 ,ty=passdaysDate.getFullYear()

function wrapHtmlParser (html,intPage) {

  const handler = new htmlparser.DomHandler(function (error, dom) {
    if (error)
      console.error('error in DomHandler')
    else {

     let alltr = htmlparser.DomUtils.find( (el)=> {
            return el.type === 'tag' && el.name === 'tr'
          },dom, true, 1000
      )


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
      const regex6 = /หุ้นเพิ่มทุน/
      const regex7 = /พ้นเหตุ/

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
                      if(textintd.length >= 8){

                        const strTime =  textintd[0].data.trim()
                        const strSymbol =  textintd[2].data.trim()
                        const strSource =  textintd[3].data.trim()
                        const strTitle =  textintd[4].data.trim()

                        //console.log(textintd)
                        const rowString = `Page ${intPage+1}-${itr} / ${strTime} ${strSymbol} ${strSource} ${strTitle}`
                        const isDWSETTSDmai = (strSymbol.match(regexDW) || strSymbol.match(regexSET) || strSymbol.match(regexTSD) || strSymbol.match(regexmai)  )? true : false

                        //|| rowString.match(regex4)
                        if ( (showAll || strTitle.match(regex1) || strTitle.match(regex2) || 
                              strTitle.match(regex3) || strTitle.match(regex4) || strTitle.match(regex5)||
                              strTitle.match(regex6) || strTitle.match(regex7) ) 
                              && !isDWSETTSDmai )  { 
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
    //console.log(body)
    const str1 = '<strong>รวม'
    const str2 = 'หัวข้อข่าว</strong>'
    const posStart = body.indexOf(str1) + str1.length
    const posEnd = body.indexOf(str2,posStart)
    if(posEnd < posStart) throw 'Cannot find Total Page in function substringTogetPageNumber'
    const strNumberOfNews = body.slice(posStart,posEnd).trim().replace(/,/g,'')
    const intNumberOfPage = Math.ceil(parseInt(strNumberOfNews)/20)

    console.log(strNumberOfNews.slice(0,13),'news',intNumberOfPage,'pages') 
    return intNumberOfPage
}

async function processNewsByPage(url,intPage){
  
  // fetch(url)
  // .then(res => res.text())
  // .then(body => wrapHtmlParser(body,intPage))  
  let res = await fetch(url)
  let body = await res.text()
  wrapHtmlParser(body,intPage)

}

async function processPassNews(intPage){
  for(let i =0; i < intPage  ; i++){
      let paranews = `&from=${fd}%2F${fm}%2F${fy}&to=${td}%2F${tm}%2F${ty}&currentpage=${i}`

      await processNewsByPage(urlnews+paranews,i)

  }
  
}



function getAllNumberOfPageAndProcess(){
    let paranews =  `&from=${fd}%2F${fm}%2F${fy}&to=${td}%2F${tm}%2F${ty}&currentpage=0`
    console.log(`from=${fd}/${fm}/${fy} to=${td}/${tm}/${ty}`)
    fetch(urlnews+paranews)
    .then(res => res.text())
    .then(body => substringTogetPageNumber(body))
    .then(intPage => processPassNews(intPage)) //
}


getAllNumberOfPageAndProcess()

