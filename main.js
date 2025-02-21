'use strict'
import fs from 'fs/promises'

const __dirname = import.meta.dirname
const tasks = await getTasks()
addNewTask(1, 'asjkfioahwfksahd')
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

function addNewTask (id, decription) {
  const timeNow = new Date().toUTCString()
  tasks[id] = {
    decription,
    status: 'todo',
    createdAt: timeNow,
    updatedAt: timeNow
  }
}
