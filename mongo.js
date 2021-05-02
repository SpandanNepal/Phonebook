if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

if (process.argv[3] && process.argv[4]){
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(result => {
        console.log(result)
        mongoose.connection.close()
    })
}
else{
    Person.find({}).then(result => {
        console.log("PHONEBOOK")
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}


