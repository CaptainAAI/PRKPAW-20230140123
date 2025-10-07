import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000")
      .then((response) => response.json())
      .then((data) => setServerMessage(data.message))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Integrasi React dan Node.js</h1>

      <input
        type="text"
        placeholder="Masukkan nama Anda"
        value={name}
        onChange={handleChange}
        style={{ padding: "8px", fontSize: "16px" }}
      />
      <h2>Hello, {name || "..."}</h2>

      <hr />
      <p>Pesan dari server: {serverMessage}</p>
    </div>
  );
}

export default App;
