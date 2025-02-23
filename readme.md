# Task Tracker CLI
Simple task tracker based on [task-tracker](https://roadmap.sh/projects/task-tracker) from [roadmap.sh](https://roadmap.sh/)
### Usage
Download or clone repo and go in main directory (task_tracker_CLI)  
```git clone https://github.com/Binograd/task_tracker_CLI.git```  
```cd task_tracker_CLI```  
Then use - 
```npm link```  
And now you can use task-cli command everywhere  
```task-cli command [args]```
### List of all available commands:
* add - 
```task-cli add [id] <description>  #Add new tasks at next free id with <description>```
* update - 
```task-cli update [id] <description>  #Update task <description> at [id]```  
You can use Add and Update with or without "" quotes around description.

* mark-(in-progress/done) - 
```task-cli mark-in-progress [id]```
```task-cli mark-done [id]```  
Change status of task with [id] to in-progress or done respectively.

* delete - 
```task-cli delete [id]  #Delete task with [id]```

* list - 
```task-cli list [status] #List all tasks with [status]```  
You can use task status as argument to list all with status and you can use 'all' or nothing to list all tasks

* help - 
```task-cli help```  
List all commands with description

### Options
Only options is colors in colors.js, you can change all colors used in programm in one place.

### Task example
Time is UTC string - 
```new Date().toUTCString()```  
```
{
  "1": {
    "status": "done",
    "description": "do something",
    "createdAt": "Sat, 22 Feb 2025 16:01:18 GMT",
    "updatedAt": "Sat, 22 Feb 2025 16:47:11 GMT"
  }
}
```
