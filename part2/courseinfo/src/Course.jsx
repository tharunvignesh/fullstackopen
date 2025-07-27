const Header = ({name}) => {
  return <h1>{name}</h1>;
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => <Part part={part} key={part.id} />)}
    </div>
  )
}

const Part = ({part}) => {
  return (
    <p>{part.name} {part.exercises}</p>
  )
}

const Total = ({total}) => {
  return (
    <>
      <h3>total of {total} excercises</h3>
    </>
  )
}

const Course = ({course}) => {
    const total = course.parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <>
      <Header name={course.name} />
      <Content 
        parts={course.parts}
      />
      <Total total={total} />
    </>
  );
}

export default Course;