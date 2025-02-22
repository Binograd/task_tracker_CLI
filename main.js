'use strict'
import fs from 'fs/promises'
import { styleText } from 'util'
import { colors } from './options.js'

const commands = initCommands()
const __dirname = import.meta.dirname

const tasks = await getTasks()

const args = process.argv.slice(2)

try {
  if (!commands[args[0]]) {
    throw new SyntaxError('Unknown command name, try "node main help"')
  }

  commands[args[0]](...(args.slice(1)))
} catch (err) {
  console.error(styleText(colors.err, err.message))
}

saveTasks()

function initCommands () {
  return {
    add: addNewTask,
    update: updateDescription,
    delete: deleteTask,
    list: listTasks,
    'mark-in-progress': (id) => { return updateStatus(id, 'in-progress') },
    'mark-done': (id) => { return updateStatus(id, 'done') }
  }
}

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
  checkId(id)

  delete tasks[id]

  logAction('delete', id)
}

function updateDescription (id, ...description) {
  checkId(id)

  description = description.join(' ')
  if (!description) {
    throw new TypeError('The "description" argument is required and cannot be empty')
  }

  const timeNow = new Date().toUTCString()
  tasks[id].description = description
  tasks[id].updatedAt = timeNow

  logAction('update description', id, description)
}

function updateStatus (id, status) {
  checkId(id)

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
  output += `TASK [${styleText(colors.taskId, `ID: ${id}`)}]`
  output += details
    ? ` - ${details}`
    : ''
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

function checkId (id) {
  id = Number(id)
  if (typeof id !== 'number' || isNaN(id) || id < 0) {
    throw new TypeError('Id should always be a natural number')
  }
  if (!tasks[id]) {
    throw new RangeError('Wrong id, try "node main list" to see list of and their id\'s')
  }
}
