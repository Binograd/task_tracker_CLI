'use strict'
import fs from 'fs/promises'

const __dirname = import.meta.dirname
getTasks()

async function getTasks () {
  let tasks = {}

  try {
    const json = await fs.readFile(`${__dirname}/tasks.json`)
    tasks = await JSON.parse(json)
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.writeFile(`${__dirname}/tasks.json`, '{}')
    }
  }

  return tasks
}
