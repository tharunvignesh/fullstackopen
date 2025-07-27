const Persons = ({ persons, filterInput, deletePerson }) => {
  if(persons) {
    const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filterInput))
  return (
    <div>
        {filteredPersons.map(person => <div key={person.id}>{person.name} {person.number}<button onClick={() => deletePerson(person.id)}>delete</button></div>)}
      </div>
  );
  } else {
    return <div>No persons found</div>;
  }
}

export default Persons;