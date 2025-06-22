const mongoose = require('mongoose');
const Person = require('./models/person');

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1);
}

const password = process.argv[2]

const url = `mongodb+srv://hetmanchukkwts:${password}@cluster0.u6mk86u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

if (process.argv.length === 3) {
  Person
    .find({})
    .then((person) => {
      person.forEach((person) => {
        console.log(person?.name, person?.number)
      })
      mongoose.connection.close()
    })
} else {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  newPerson.save().then(result => {
    console.log('person saved!!')
    mongoose.connection.close()
  })
}

