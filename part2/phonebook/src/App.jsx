import { useState } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import { useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons';
import Notification from './Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterInput, setFilterInput] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState('')

  useEffect(() => {
    personsService.getAll().then(response => {
      setPersons(response);
    })
  }, []);

  const handleNewNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterInputChange = (event) => {
    setFilterInput(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName.trim());
    if (existingPerson && existingPerson.name === newName.trim()) {
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personsService.update(existingPerson.id, { ...existingPerson, number: newNumber.trim() }).then(res => {
          setPersons(persons.map(person => person.id == res.id ? { ...person, number: res.number } : person))
          setNewName('')
          setNewNumber('')
          setNotificationMessage(`Number changed for ${res.name}`);
          setNotificationType('success');
          setTimeout(() => {
            setNotificationMessage('');
            setNotificationType('');
          }, 5000);
        })
      } else {
        return;
      }
    } else {
      const payload = { name: newName.trim(), number: newNumber.trim() }
      personsService.create(payload).then(res => {
        setPersons(persons.concat(res));
        setNewName('')
        setNewNumber('')
        setNotificationMessage(`Added ${res.name}`);
        setNotificationType('success');
        setTimeout(() => {
          setNotificationMessage('');
          setNotificationType('');
        }, 5000);
      })
    }
  }

  const deletePerson = (id) => {
    if (confirm(`Delete ${persons.find(person => person.id === id).name}?`)) {
      personsService.remove(id).then(res => {
        setPersons(persons.filter(person => person.id !== id));
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType} />
      <Filter filterInput={filterInput} handleFilterInputChange={handleFilterInputChange} />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNewNameChange={handleNewNameChange}
        handleNewNumberChange={handleNewNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filterInput={filterInput} deletePerson={deletePerson} />
    </div>
  )
}

export default App