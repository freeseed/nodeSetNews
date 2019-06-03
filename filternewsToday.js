const htmlparser = require("htmlparser2")
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
let showAll  = (process.argv.indexOf('all') > -1)
const urlnews = 'https://www.set.or.th/set/todaynews.do?period=all&language=th&country=TH&market='

//mai News :ตลาดหลักทรัพย์ เอ็ม เอ ไอ ต้อนรับ บมจ. วี.แอล. เอ็นเตอรไพรส์ เริ่มซื้อขาย 21 พ.ค. นี้
//mai News :ตลาดหลักทรัพย์ เอ็ม เอ ไอ ต้อนรับ บมจ. ออลล์ อินสไปร์ ดีเวลลอปเม้นท์ (ALL) เริ่มซื้อขาย 8 พ.ค. นี้
//SET News :ตลาดหลักทรัพย์ฯ ต้อนรับ บมจ. วีรันดา รีสอร์ท (VRANDA) เริ่มซื้อขาย 3 พ.ค. นี้
//ตลาดหลักทรัพย์เพิ่มสินค้า : SINGER-W2 เริ่มซื้อขายวันที่ 17 พฤษภาคม 2562
//ตลาดหลักทรัพย์เพิ่มสินค้า : SINGER-W1 เริ่มซื้อขายวันที่ 17 พฤษภาคม 2562
//console.log('showAll',showAll,process.argv, process.argv.indexOf('all'))
function wrapHtmlParser (html) {

  const handler = new htmlparser.DomHandler(function (error, dom) {
    if (error)
      console.error(error)
    else {

     let alltr = htmlparser.DomUtils.find( (el)=> {
            return el.type === 'tag' && el.name === 'tr'
          },dom, true, 1000
      )

      console.log('alltr.lenth=', alltr.length)
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
                        const rowString = `${itr} / ${strTime} ${strSymbol} ${strSource} ${strTitle}`
                        const isDWSETTSDmai = (strSymbol.match(regexDW) || strSymbol.match(regexSET) || strSymbol.match(regexTSD) || strSymbol.match(regexmai)  )? true : false

                        //|| rowString.match(regex4)
                        if ( (showAll || strTitle.match(regex1) || strTitle.match(regex2) || 
                              strTitle.match(regex3) || strTitle.match(regex4) || strTitle.match(regex5) ||
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

fetch(urlnews)
    .then(res => res.text())
    .then(body => wrapHtmlParser(body))