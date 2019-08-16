import React from "react";
import PropTypes from "prop-types";
import "./modal.scss";

const Modal = ({ isOpen, setOpen, task, deleteTask }) => {
  return (
    <>
      {isOpen ? (
        <div className="modal">
          <div className="inner">
            <div className="inner-header">
              <h1 className="title">{task.title}</h1>
            </div>
            <div className="inner-body">
              <p className="description">{task.description}</p>
            </div>
            <div
              className="inner-footer"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center"
              }}
            >
              <button
                onClick={() => deleteTask(task.id)}
                className="modal-button"
              >
                delete
              </button>
              <button onClick={() => setOpen(!isOpen)} className="modal-button">
                close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired
};
export default Modal;
