import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RequestList() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/request').then((res) => setRequests(res.data));
  }, []);

  return (
    <div>
      <h2>Existing Requests</h2>
      <ul>
        {requests.map((r) => (
          <li key={r.id}>
            {r.clientName} - {r.status} ({new Date(r.submittedAt).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RequestList;
