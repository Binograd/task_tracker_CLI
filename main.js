'use strict'
import fs from 'fs/promises'
import { styleText } from 'util'

const __dirname = import.meta.dirname

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

function addNewTask (description) {
  const timeNow = new Date().toUTCString()
  tasks[getNextId()] = {
    description,
    status: 'todo',
    createdAt: timeNow,
    updatedAt: timeNow
  }
}

function deleteTask (id) {
  delete tasks[id]
}

function updateDescription (id, description) {
  const timeNow = new Date().toUTCString()
  tasks[id].description = description
  tasks[id].updatedAt = timeNow
}

function updateStatus (id, status) {
  const timeNow = new Date().toUTCString()
  tasks[id].status = status
  tasks[id].updatedAt = timeNow
}

function getNextId () {
  let nextId = 1
  for (const id in tasks) {
    if (nextId !== Number(id)) break
    nextId++
  }
  return nextId
}

function logAction (action, id, details = '') {
  const timeNow = new Date().toUTCString()

  const actionColor = action === 'delete'
    ? 'redBright'
    : 'greenBright'
  const timeColor = 'black'
  const idColor = 'cyanBright'

  let output = styleText(timeColor, `TIME ${timeNow} - `)
  output += styleText(actionColor, `${action} `)
  output += `TASK [${styleText(idColor, `ID: ${id}`)}] - `
  output += details
  console.log(output)
}
