require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require('cors')
const Person = require('./models/person')

// app.use(express.static('build'))
// app.use(cors())
// app.use(express.json())

// let persons = [
//     { 
//     "name": "Arto Hellas", 
//     "number": "040-123456",
//     "id": 1
//     },
//     { 
//     "name": "Ada Lovelace", 
//     "number": "39-44-5323523",
//     "id": 2
//     },
//     { 
//     "name": "Dan Abramov", 
//     "number": "12-43-234345",
//     "id": 3
//     },
//     { 
//     "name": "Mary Poppendieck", 
//     "number": "39-23-6423122",
//     "id": 4
//     }
// ]

morgan.token('type', function (req, res) { 
    if (req.method === 'POST'){
        return JSON.stringify(req.body)
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', async (request, response) => {
    persons = await Person.find({})
    console.log(persons)
    const total = persons.length
    const datetime = new Date()
    response.write(`Phonebook has info for ${total} people \n\n`)
    response.write("" + datetime)
    response.end()
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    //const person = persons.find(person => person.id === parseInt(id))
    Person.findById(id)
    .then(person => {
        if (person){
            response.json(person)
        }
        else{
            response.status(404).end()
        } 
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then((result) => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const content = request.body
    if (!content.name && !content.number){
        response.status(400).json({
            'error': 'content is missing'
        })
    }
    else{
        const person = new Person({
            name: body.name,
            number: body.number
        })
        person.save().then(result => {
            response.json(result)
        })
        .then(savedandFormattedPerson => res.json(savedandFormattedPerson))
        .catch(error => next(error))
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    Person
    .findOneAndUpdate({_id:request.params.id}, request.body,{
        new: true
    })
    .then(updatePerson => {
        response.json(updatePerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'Malformatted ID' })
    } 
    else if (error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)