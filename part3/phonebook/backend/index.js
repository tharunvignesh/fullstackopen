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

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id == id);
    if(person) {
        res.json(person);
    } else {
        res.status(404).json({ error: 'Person not found' });
    }
})

app.post('/api/persons', (req, res) => {
    const newPerson = req.body;
    if(!newPerson.name || !newPerson.number) {
        return res.status(400).json({ error: 'Name or number is missing' });
    }
    const existingPerson = persons.find(person => person.name === newPerson.name);
    if(existingPerson) {
        return res.status(400).json({ error: 'Name must be unique' });
    }
    newPerson['id'] = Math.round(Math.random() * 999999);
    persons = persons.concat(newPerson);
    res.status(201).json(newPerson);
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id == id);
    if(person) {
        persons = persons.filter(person => person.id != id);
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Person not found' });
    }
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