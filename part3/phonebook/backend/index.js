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

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
        res.json(persons);
    }).catch(error => next(error));
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    const person = Person.findById(id).then(person => {
        if (person) {
            res.json(person);
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    }).catch(error => next(error));
})

app.post('/api/persons', (req, res, next) => {
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
    }).catch(error => next(error));
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id).then(result => {
        if (result) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    }).catch(error => next(error));
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    const { name, number } = req.body;
    Person.findById(id).then(person => {
        if (!person) {
            res.status(404).end();
        }
        const personToBeUpdated = {
            name: name, 
            number: number,
            id: id
        };
        Person.updateOne({}, personToBeUpdated, { runValidators: true }).then(result => {
            res.json(personToBeUpdated);
        }).catch(error => next(error));
    }).catch(error => next(error));
})

app.get('/info', (req, res, next) => {
    Person.find({}).then(persons => {
        res.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>
        `)
    }).catch(error => next(error));
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error);
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})