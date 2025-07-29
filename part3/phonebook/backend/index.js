require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.static('dist'));

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.body(req, res)
    ].join(' ')
}))


app.use(express.json())

const Person = require('./models/person');

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = Person.findById(id).then(person => {
        if (person) {
            res.json(person);
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    });
})

app.post('/api/persons', (req, res) => {
    const newPerson = req.body;
    if (!newPerson.name || !newPerson.number) {
        return res.status(400).json({ error: 'Name or number is missing' });
    }
    const person = new Person({
        name: newPerson.name,
        number: newPerson.number
    });
    person.save().then(savedPerson => {
        res.status(201).json(savedPerson);
    }).catch(error => {
        console.error(error);
    });
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id).then(result => {
        if (result) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    })
})

app.get('/info', (req, res) => {
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        `)
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})