import fs from 'node:fs'
import path from 'node:path'
import b from 'benny'
import { parseString, parseStringPromise } from 'xml2js'
import { jsonFolder, xmlFolder } from './common'

const dataLength = 1000

b.suite(
  'JSON-XML',

  b.add('Read and Parse JSON by JSON.parse', () => {
    for (let i = 1; i <= dataLength; i++) {
      const jsonText = fs.readFileSync(path.resolve(jsonFolder, `${i}.json`), 'utf-8')
      JSON.parse(jsonText)
    }
  }),

  b.add('Read and Parse XML by xml2js without promise', async () => {
    for (let i = 1; i <= dataLength; i++) {
      const xmlText = fs.readFileSync(path.resolve(xmlFolder, `${i}.xml`), 'utf-8')
      parseString(xmlText, () => {})
    }
  }),

  b.add('Read and Parse XML by xml2js', async () => {
    for (let i = 1; i <= dataLength; i++) {
      const xmlText = fs.readFileSync(path.resolve(xmlFolder, `${i}.xml`), 'utf-8')
      await parseStringPromise(xmlText, {
        explicitArray: false,
      })
    }
  }),

  b.cycle(),
  b.complete(),

  b.save({ file: 'json-xml', format: 'chart.html' }),
)
