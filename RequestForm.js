import React, { useState } from 'react';
import axios from 'axios';

function RequestForm() {
  const [clientName, setClientName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/request', { clientName });
    setClientName('');
    alert('Request submitted!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Access Request</h2>
      <input
        type="text"
        placeholder="Client Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default RequestForm;
