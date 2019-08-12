import React, { useState } from "react";
import { apiUrl } from "./apiUrl";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const dataRes = await fetch(`${apiUrl}/wp-json/wp/v2/task`);
    const data = await dataRes.json();
    setData(data);
  };

  const [input, setInput] = useState("");

  return (
    <div className="App">
      <div className="input-box">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="add new task"
          type="text"
        />
        <button className="submit">
          add task
        </button>
      </div>

      {data &&
        data.map(item => {
          return (
            <li key={item.id} className="list-item">
              {item.title.rendered}{" "}
              <button className="submit">
                x
              </button>
            </li>
          );
        })}
    </div>
  );
}

export default App;