const mongoose = require('mongoose');

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

if (process.argv.length < 5) {
    console.error('Please provide the password, name, and number as arguments');
    process.exit(1);
}

const url = `mongodb+srv://root:${password}@cluster0.tlg8mcv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
    name: name,
    number: number
})

person.save().then(res => {
    console.log(`added ${res.name} number ${res.number} to phonebook`);
})

Person.find({}).then(persons => {    
    console.log('phonebook:');
    if (persons.length > 1) {
        persons.forEach((person) => {
            console.log(`${person.name} ${person.number}`);

        })
    }
    mongoose.connection.close()
});
