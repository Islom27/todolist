const express = require('express')
const app = express()
const PORT = 8000
const fs = require('fs')

//setting pug for frontend
app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded( { 
    extended: false
}))
//get the existing note
app.get('/', (req, res) => {
    fs.readFile('./data/todo.json', (err, data) => {
        if (err) throw err

        const todos = JSON.parse(data)

        res.render('home', {todos: todos})
    })
})
//add function for notes
app.post('/add', (req, res) => {
    const formData = req.body

    if(formData.todo.trim() == '') {

        fs.readFile('./data/todo.json', (err, data) => {
            if (err) throw err

            const todos = JSON.parse(data)

            res.render('home', {error: true, todos: todos})
        })
    }
    else {
        fs.readFile('./data/todo.json', (err, data) => {
            if (err) throw err
            const todos = JSON.parse(data)

            const todo = {
                id: id(),
                description: formData.todo,
                done: false
            }

            todos.push(todo)

            fs.writeFile('./data/todo.json', JSON.stringify(todos), (err) => {
                if(err) throw err

                fs.readFile('./data/todo.json', (err, data) => {
                    if (err) throw err

                    const todos = JSON.parse(data)

                    res.render('home', {success: true, todos: todos})
                })
            })
        })
    }
})
//delete button functions
app.get('/:id/delete', (req, res) => {
    //Saving the ID value
    const id = req.params.id

    fs.readFile('./data/todo.json', (err, data) => {
        if (err) throw err

        const todos = JSON.parse(data)

        const filteredTodos = todos.filter(todo => todo.id != id)

        fs.writeFile('./data/todo.json', JSON.stringify(filteredTodos), (err) => {
            if (err) throw err
            
            res.render('home', { todos: filteredTodos, delete: true})
        })
    })
})
//updateing the existing note
app.get('/:id/update', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/todo.json', (err, data) => {
        if (err) throw err
        // Indetify the TODO to change 
        const todos = JSON.parse(data)
        const todo = todos.filter(todo => todo.id == id)[0]

        //Getting it
        const todoIdx = todos.indexOf(todo)
        const splicedTodo = todos.splice(todoIdx, 1)[0]

        //Changing the status
        splicedTodo.done = true

        //Adding it back
        todos.push(splicedTodo)

        fs.writeFile('./data/todo.json', JSON.stringify(todos), (err) => {
            if (err) throw err

            res.render(`home`, { todos: todos })
        })
    })
    
})
//print the running port number
app.listen(PORT, (err) => {
    if(err) throw err
    console.log(`Running ${PORT}`)
})
//generate randomm id
function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
  };
//link for login page
app.get('/login', (req, res) => {
    res.render('login.ejs')
})
//link for register page
app.get('/register', (req, res) => {
    res.render('register.ejs')
})