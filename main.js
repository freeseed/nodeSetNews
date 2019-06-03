const htmlparser = require("htmlparser2")
const fs = require('fs')
const path = require('path')

let datatop = ''

function wrapHtmlParser (html) {

  const handler = new htmlparser.DomHandler(function (error, dom) {
    if (error)
      console.error(error)
    else {
      //console.log('dom.length : ', dom.length)

      /*
      let allscript = htmlparser.DomUtils.find( (el)=> {
        return el.type === 'script' && el.name == 'script'
      },dom, true, 3)


      allscript.forEach( (el,i)=>{
        console.log(i, el)
      })
      */

      /*
      let alltd = htmlparser.DomUtils.find( (el)=> {
            return el.type === 'tag' && el.name == 'td'
          },dom, true, 500
      )

      let alltextintd = htmlparser.DomUtils.find( (el)=> {
            return el.type === 'text' && el.data.trim() !== '' // && !el.data.match(/&nbsp/) 
          },alltd, true, 500
      )

      alltextintd.forEach( (el,i)=>{
        console.log(i, el.data.trim())
      })
      */
     let alltable = htmlparser.DomUtils.find( (el)=> {
            return el.type === 'tag' && el.name == 'table'
          },dom, true, 500
      )

      console.log('alltable.lenth=', alltable.length)

      alltable.forEach(
        (el,i)=> console.log(i)
      )

    }

  })

  let parser = new htmlparser.Parser(handler)
  parser.write(html)
  parser.end()
}

fs.readFile('TopLossHtml.txt', function(err, data) {
  if (err) throw err
  datatop = data.toString()
  //console.log(datatop)
  wrapHtmlParser(datatop) 
})