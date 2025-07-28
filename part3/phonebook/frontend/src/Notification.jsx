const Notification = ({ message, type }) => {
  if (!message) {
    return null;
  }

  const notificationStyle = {
    color: type === 'error' ? 'red' : 'green',
    backgroundColor: 'lightgrey',
    border: `2px solid ${type === 'error' ? 'red' : 'green'}`,
    padding: '0.5rem',
    marginBottom: '0.625rem',
    borderRadius: '5px',
  };

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  );
}

export default Notification;