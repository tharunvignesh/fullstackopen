import { useState } from "react";

const StatisticLine = ({ text, value }) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  );
};

const Button = ({ label, handleClick }) => {
  return (
    <>
      <button onClick={handleClick}>{label}</button>
    </>
  );
};

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (all && all > 0) {
    return (
      <div>
        <table>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} />
        </table>
      </div>
    );
  } else {
    return (
      <>
        <p>No feedback given</p>
      </>
    );
  }
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const all = good + neutral + bad;

  const average = (good - bad) / all;

  const positive = `${(good / all) * 100} %`;

  return (
    <div>
      <div>
        <h1>give feedback</h1>
      </div>
      <div>
        <Button handleClick={() => setGood(good + 1)} label="good"></Button>
        <Button
          handleClick={() => setNeutral(neutral + 1)}
          label="neutral"
        ></Button>
        <Button handleClick={() => setBad(bad + 1)} label="bad"></Button>
      </div>
      <div>
        <h1>statistics</h1>
      </div>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        positive={positive}
      />
    </div>
  );
};

export default App;
