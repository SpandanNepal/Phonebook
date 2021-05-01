const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require('cors')

app.use(cors())

app.use(express.json())

let persons = [
    { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
    },
    { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
    },
    { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
    },
    { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
    }
]

morgan.token('type', function (req, res) { 
    if (req.method === 'POST'){
        return JSON.stringify(req.body)
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const total = persons.length
    const datetime = new Date()
    response.write(`Phonebook has info for ${total} people \n\n`)
    response.write("" + datetime)
    response.end()
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    //console.log(id, typeof id)
    const person = persons.find(person => person.id === parseInt(id))
    //console.log(person)

    if (person){
        response.json(person)
    }
    else{
        response.status(404).end()
    } 
})

app.delete('/api/persons/:id', (request, response) => {
    const id = parseInt(request.params.id)
    //console.log(id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const content = request.body
    if (!content.name && !content.number){
        response.status(400).json({
            'error': 'content is missing'
        })
    }
    else{
        const dubPerson = persons.filter(person => person.name === content.name)
        
        if (dubPerson.length >= 1){
            response.status(400).json({
                'error' : 'Name must be unique'
            })
        }
        else{
            const randId = Math.floor(Math.random() * 100)
            content.id = randId
            persons = persons.concat(content)
            response.json(persons)
        }
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)