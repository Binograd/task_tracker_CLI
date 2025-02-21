'use strict'
import fs from 'fs/promises'

const __dirname = import.meta.dirname
const tasks = await getTasks()
addNewTask('asjkfioahwfksahd')
await saveTasks()

async function getTasks () {
  try {
    const json = await fs.readFile(`${__dirname}/tasks.json`)
    return JSON.parse(json)
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.writeFile(`${__dirname}/tasks.json`, '{}')
    }
  }

  return {}
}

function saveTasks () {
  const content = JSON.stringify(tasks)
  fs.writeFile(`${__dirname}/tasks.json`, content)
}

function addNewTask (decription) {
  const timeNow = new Date().toUTCString()
  tasks[getNextId()] = {
    decription,
    status: 'todo',
    createdAt: timeNow,
    updatedAt: timeNow
  }
}

function getNextId () {
  let nextId = 1
  for (const id in tasks) {
    if (nextId !== Number(id)) break
    nextId++
  }
  return nextId
}
