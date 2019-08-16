import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import styled from "styled-components";
import CalendarIcon from "../svg/CalendarIcon";
import CircleIcon from "../svg/CircleIcon";
import "./task.scss";
import { Draggable } from "react-beautiful-dnd";

const Task = ({
  date,
  title,
  index,
  description,
  bgColor,
  setTask,
  setOpen,
  id,
  column
}) => {
  return (
    <>
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <TaskWrapper
              className="task"
              bgColor={bgColor}
              onClick={() => {
                setOpen(true);
                setTask(id, title, description);
              }}
            >
              <div className="task-header">
                <span className="date">{format(date, "DD-MM-YYYY")}</span>
                <span className="icon">
                  <CalendarIcon fill={"#c7c7c7"} />
                </span>
              </div>
              <div className="task-body">
                <div className="title">
                  <span className="icon">
                    <CircleIcon fill={"#fff"} stroke={"#c7c7c7"} />
                  </span>
                  <span className="text">{title}</span>
                </div>

                <div className="description">{description}</div>
              </div>
            </TaskWrapper>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default Task;

Task.propTypes = {
  date: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

const TaskWrapper = styled.div`
  &:before {
    background-color: ${props => props.bgColor};
  }
  &:hover {
  }
`;
