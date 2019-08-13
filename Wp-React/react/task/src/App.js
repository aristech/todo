import React, { useState, useEffect } from "react";
import { apiUrl } from "./apiUrl";

// Start app
function App() {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");

  // Runs once when window loads
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all tasks
  const fetchData = async () => {
    const dataRes = await fetch(`${apiUrl}/wp-json/wp/v2/task`);
    const data = await dataRes.json();
    setData(data);
  };

  // Add new task
  const addTask = async () => {
    if (input === "") {
      return;
    } else {
      const data = { title: input };
      await fetch(`${apiUrl}/wp-json/aris/v1/task`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          setData(data);
          setInput("");
        });
    }
  };

  // Delete task
  const deleteTask = async id => {
    const data = { postId: id };
    await fetch(`${apiUrl}/wp-json/aris/v1/deleteTask`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        setData(data);
        setInput("");
      });
  };

  return (

    <div className="App">
      <div className="input-box">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="add new task"
          type="text"
        />
        <button className="submit" onClick={addTask}>
          add task
        </button>
      </div>

      {data &&
        data.map(item => {
          return (
            <li key={item.id} className="list-item">
              {item.title.rendered}{" "}
              <button onClick={() => deleteTask(item.id)} className="submit">
                x
              </button>
            </li>
          );
        })}
    </div>
  );
}
export default App;
