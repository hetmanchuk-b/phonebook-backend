require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express();

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :response-time :body', {
  skip: function (req) {return req.method !== 'POST'}
}));

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then((persons) => {
      res.json(persons)
    })
})

app.get('/info', (req, res) => {
  let persons = null;
  Person.find({}).then((data) => {
    persons = data
  })
  if (persons) {
    res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    `)
  }
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(() => {
      res.status(500).end()
    })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.deleteOne(id)
    .then((data) => {
      if (data.deletedCount === 1) {
        res.status(204).end()
      } else {
        res.status(404).end()
      }
    })
    .catch(() => {
      res.status(500).end()
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({error: 'Missing name or number'})
  }

  // const existingPerson = persons.find((person) => person.name === body.name)
  // if (existingPerson) {
  //   return res.status(403).json({error: 'Name already exists'})
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch(() => {
      res.status(500).end()
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})