import React, { useEffect, useState } from 'react';

function Test() {
    const [response, setResponse] = useState('');  // Single state to store the response or error

    useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/test');  // API call to the Python backend
        const data = await res.text();  // Expecting plain text response
        setResponse(data);  // Store response in the state
      } catch (error) {
        setResponse(`Error: ${error.message}`);  // Store error message in the same state
      }
    };

    fetchData();  // Call the function to fetch the data
  }, []);  // Empty dependency array, so it only runs on component mount

  return (
    <div>
      <h2>Server Response:</h2>
      <p>{response}</p>  {/* Display either the response or error */}
    </div>
  );
}

export default Test