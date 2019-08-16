import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Board from "./board/Board";
import Modal from "./modal/Modal";
import { apiUrl } from "../apiUrl";

class App extends React.Component {
  state = {
    open: false,
    task: {},
    data: [],
    title: "",
    description: "",
    columns: {},
    columnOrder: ["start", "doing", "done"]
  };

  componentDidMount() {
    this.fetchData();
  }

  // Fetch all tasks
  fetchData = async () => {
    const dataRes = await fetch(`${apiUrl}/wp-json/aris/v1/data`);
    const data = await dataRes.json();
    const start = data.filter(item => item.category === "start");
    const doing = data.filter(item => item.category === "doing");
    const done = data.filter(item => item.category === "done");
    const columns = {
      start: {
        id: "start",
        title: "To do",
        bgColor: "#FF5964",
        taskIds: start.map(item => item.id)
      },
      doing: {
        id: "doing",
        title: "Doing",
        bgColor: "#80b5ea",
        taskIds: doing.map(item => item.id)
      },
      done: {
        id: "done",
        title: "Done",
        bgColor: "#6BF178",
        taskIds: done.map(item => item.id)
      }
    };
    this.setState({ data, columns, start });
  };

  handleChange = (name, e) => {
    this.setState({
      [name]: e.target.value
    });
  };
  onDragEnd = result => {
    const { source, destination, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      };

      this.setState(newState);
    } else {
      // Moving to another column

      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTaskIds
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        }
      };
      this.setState(newState);

      const data = { postId: draggableId, category: destination.droppableId };
      fetch(`${apiUrl}/wp-json/aris/v1/move_task`, {
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
          console.log(data);
        });
    }
  };

  addTask = async () => {
    if (this.state.title === "") {
      return;
    } else {
      const data = {
        title: this.state.title,
        description: this.state.description
      };
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
          this.setState({
            title: "",
            description: ""
          });
          this.fetchData();
        });
    }
  };

  deleteTask = async id => {
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
        this.setState({
          open: !this.state.open
        });
        this.fetchData();
      });
  };

  setOpen = () => {
    this.setState({
      open: !this.state.open
    });
  };
  setTask = (id, title, description) => {
    this.setState({
      task: {
        id,
        title,
        description
      }
    });
  };
  render() {
    if (this.state.data.length === 0) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center"
          }}
        >
          <div className="input-box" style={{ padding: 30 }}>
            <input
              value={this.state.title}
              style={{
                width: 120,
                height: 40,
                borderRadius: 5,
                marginRight: 10,
                textAlign: "center"
              }}
              onChange={e => this.handleChange("title", e)}
              placeholder="Title"
              type="text"
            />
            <input
              value={this.state.description}
              style={{
                width: 240,
                height: 40,
                borderRadius: 5,
                marginRight: 10,
                textAlign: "center"
              }}
              onChange={e => this.handleChange("description", e)}
              placeholder="Description"
              type="text"
            />
            <button
              onClick={() => this.addTask()}
              style={{
                boxShadow: "inset 0px 1px 3px 0px #91b8b3",
                backgroundColor: "#768d87",
                borderRadius: 5,
                border: "1px solid #566963",
                cursor: "pointer",
                textDecoration: "none",
                textShadow: "0px -1px 0px #2b665e",
                color: "#fff",
                height: 40,
                lineHeight: 0
              }}
            >
              add task
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center"
          }}
        >
          <div className="input-box" style={{ padding: 30 }}>
            <input
              value={this.state.title}
              style={{
                width: 120,
                height: 40,
                borderRadius: 5,
                marginRight: 10,
                textAlign: "center"
              }}
              onChange={e => this.handleChange("title", e)}
              placeholder="Title"
              type="text"
            />
            <input
              value={this.state.description}
              style={{
                width: 240,
                height: 40,
                borderRadius: 5,
                marginRight: 10,
                textAlign: "center"
              }}
              onChange={e => this.handleChange("description", e)}
              placeholder="Description"
              type="text"
            />
            <button
              onClick={() => this.addTask()}
              style={{
                boxShadow: "inset 0px 1px 3px 0px #91b8b3",
                backgroundColor: "#768d87",
                borderRadius: 5,
                border: "1px solid #566963",
                cursor: "pointer",
                textDecoration: "none",
                textShadow: "0px -1px 0px #2b665e",
                color: "#fff",
                height: 40,
                lineHeight: 0
              }}
            >
              add task
            </button>
          </div>
          <div className="boards">
            {this.state.open ? (
              <Modal
                deleteTask={this.deleteTask}
                task={this.state.task}
                isOpen={this.state.open}
                setOpen={this.setOpen}
              />
            ) : null}
            <DragDropContext onDragEnd={this.onDragEnd}>
              {this.state.columnOrder.map(columnId => {
                const column = this.state.columns[columnId];
                const arrayToObject = array =>
                  array.reduce((obj, item) => {
                    obj[item.id] = item;
                    return obj;
                  }, {});
                const ob = arrayToObject(this.state.data);

                const tasks = column.taskIds.map(id => ob[id]);

                return (
                  <Board
                    key={column.id}
                    column={column.id}
                    bgColor={column.bgColor}
                    title={column.title}
                    setOpen={this.setOpen}
                    setTask={this.setTask}
                    tasks={tasks}
                  />
                );
              })}
            </DragDropContext>
          </div>
        </div>
      );
    }
  }
}

export default App;
