'use strict'
import fs from 'fs/promises'
import { styleText } from 'util'
import { colors } from './options.js'

const __dirname = import.meta.dirname
const tasks = await getTasks()

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
  const id = getNextId()
  tasks[id] = {
    description,
    status: 'todo',
    createdAt: timeNow,
    updatedAt: timeNow
  }

  logAction('create', id, description)
}

function deleteTask (id) {
  delete tasks[id]

  logAction('delete', id)
}

function updateDescription (id, description) {
  const timeNow = new Date().toUTCString()
  tasks[id].description = description
  tasks[id].updatedAt = timeNow

  logAction('update description', id, description)
}

function updateStatus (id, status) {
  const timeNow = new Date().toUTCString()
  tasks[id].status = status
  tasks[id].updatedAt = timeNow

  logAction('update status', id, status)
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
  const time = new Date().toUTCString()

  const actionColor = action === 'delete'
    ? colors.actionDelete
    : colors.actionBase

  let output = styleText(colors.actionTime, `TIME ${time} - `)
  output += styleText(actionColor, `${action} `)
  output += `TASK [${styleText(colors.taskId, `ID: ${id}`)}] - `
  output += details
  console.log(output)
}

function listTasks (status = null) {
  function printTask (id, task) {
    let output = `[${styleText(colors.taskId, `ID: ${id}`)}] - `
    output += styleText(colors.taskStatus, `${task.status}\n`)
    output += `Description: ${styleText(colors.taskDescription, task.description)}\n`
    output += `Create time: ${styleText(colors.actionTime, task.createdAt)} - `
    output += `Update time: ${styleText(colors.actionTime, task.updatedAt)}`

    console.log(output)
  }

  for (const id in tasks) {
    if (status && tasks[id].status !== status) {
      continue
    }

    printTask(id, tasks[id])
  }
}
