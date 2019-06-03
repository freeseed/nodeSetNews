const htmlparser = require("htmlparser2")
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

const urlStockSET="https://www.settrade.com/C13_MarketSummary.jsp?order=Y"
const urlStockMAI="https://www.settrade.com/C13_MarketSummary.jsp?order=Y&market=mai"
const urlWrSET="https://www.settrade.com/C13_MarketSummary.jsp?detail=RANKING&order=Y&market=SET&type=W"
const urlWrMAI="https://www.settrade.com/C13_MarketSummary.jsp?detail=RANKING&order=Y&market=mai&type=W"

function wrapHtmlParser (html) {

  const handler = new htmlparser.DomHandler(function (error, dom) {
    if (error)
      console.error(error)
    else {

     let alltb = htmlparser.DomUtils.find( (el)=> {
            return el.type === 'tag' && el.name === 'table'
          },dom, true, 20
      )

      console.log('alltb.lenth=', alltb.length)

      alltb.forEach(
        (tb,itb)=> {
          console.log('Table',itb)
          let alltr = htmlparser.DomUtils.find( (el)=> {
              return el.type === 'tag' && el.name === 'tr'
            },[tb], true, 50
          )

          console.log('alltr.length',alltr.length)
          alltr.forEach(
            (tr,itr) =>{
              let tds = htmlparser.DomUtils.find((el) => {
                return el.type === 'tag' && el.name === 'td'
              }, [tr], true, 50
              )

              //console.log('tds.lenth=', tds.length)

              let textintd = htmlparser.DomUtils.find((el) => {
                return el.type === 'text'
              }, tds, true, 50
              )

              let textArray = textintd.map(textNode=> textNode.data.trim())
              console.log('|',textArray.join('/'),'|')

            }
          )

        }
      )

    }

  })

  let parser = new htmlparser.Parser(handler)
  parser.write(html)
  parser.end()
}

fetch(urlStockSET)
    .then(res => res.text())
    .then(body => wrapHtmlParser(body))