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
    'mark-done': (id) => { return updateStatus(id, 'done') },
    help: showHelp
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

function addNewTask (...description) {
  description = description.join(' ')
  if (!description) {
    throw new TypeError('The "description" argument is required and cannot be empty')
  }

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
    if (status && status !== 'all' && tasks[id].status !== status) {
      continue
    }

    printTask(id, tasks[id])
  }
}

function showHelp () {
  const startStr = styleText(colors.cliStart, 'node main')
  const idStr = styleText(colors.taskId, '[id]')
  const descStr = styleText(colors.taskDescription, '<description>')

  let output = 'List of all available commands:\n\n'
  output += `${startStr} ${styleText(colors.cliCommand, 'add')}`
  output += ` ${idStr} ${descStr}`
  output += `${styleText(colors.cliDesc, '  #Add new tasks at next free id with <description>\n')}`
  output += `${startStr} ${styleText(colors.cliCommand, 'update')}`
  output += ` ${idStr} ${descStr}`
  output += `${styleText(colors.cliDesc, '  #Update task <description> at [id]\n\n')}`
  output += `${styleText(colors.cliDesc, '#You can use Add and Update without "" quotes around description\n\n')}`
  output += `${startStr} ${styleText(colors.cliCommand, 'mark-in-progress')} ${idStr}\n`
  output += `${startStr} ${styleText(colors.cliCommand, 'mark-done')} ${idStr}\n`
  output += `${styleText(colors.cliDesc, '#Change status at [id] to in-progress or done\n\n')}`
  output += `${startStr} ${styleText(colors.cliCommand, 'delete')} ${idStr}`
  output += `${styleText(colors.cliDesc, ' #Delete task with [id]\n\n')}`
  output += `${startStr} ${styleText(colors.cliCommand, 'list')}`
  output += ` ${styleText(colors.taskStatus, '[status]')} `
  output += `${styleText(colors.cliDesc, '#List all tasks with [status]\n')}`
  output += `${styleText(colors.cliDesc, '#You can use with "all" or nothing to print all tasks\n\n')}`
  output += `${startStr} ${styleText(colors.cliCommand, 'help')}`
  output += `${styleText(colors.cliDesc, ' #You already know about it')}`

  console.log(output)
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
