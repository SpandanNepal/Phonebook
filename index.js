require('dotenv').config()
const express = require('express')
const morgan = require("morgan")
const app = express()
//const cors = require('cors')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const Person = require('./models/person')

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
    const persons = await Person.find({})
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

app.post('/api/persons', (request, response, next) => {
    const content = request.body
    console.log(content)
    if (!content.name && !content.number){
        response.status(400).json({
            'error': 'content is missing'
        })
    }
    else{
        const person = new Person({
            name: content.name,
            number: content.number
        })
        person.save().then(result => {
            response.json(result)
        })
        .then(savedandFormattedPerson => response.json(savedandFormattedPerson))
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