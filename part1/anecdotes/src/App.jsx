import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const getRandomInt = (max) => Math.floor(Math.random() * max);

  const generateRandomNumber = () => {
    const random = getRandomInt(anecdotes.length);
    setSelected(random);
  };

  const getAnecdoteOfDay = (updatedVotes) => {
    const copy = [...updatedVotes]
    const highestVote = Math.max(...copy);
    const anecdoteOfDayIndex = copy.indexOf(highestVote);
    const anecdoteOfDay = anecdotes[anecdoteOfDayIndex];
    setAnecdoteOfTheDay(anecdoteOfDay);
  }

  const vote = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
    getAnecdoteOfDay(copy);
  };

  const [selected, setSelected] = useState(0);

  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const [anecdoteOfTheDay, setAnecdoteOfTheDay] = useState('');

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <button onClick={vote}>vote</button>
      <button onClick={generateRandomNumber}>next anecdote</button>
      <h1>anecdote with the most votes</h1>
      {anecdoteOfTheDay && <div>{anecdoteOfTheDay}</div>}
      {anecdoteOfTheDay && <div>has {votes[anecdotes.indexOf(anecdoteOfTheDay)]} votes</div>}
    </div>
  );
};

export default App;
