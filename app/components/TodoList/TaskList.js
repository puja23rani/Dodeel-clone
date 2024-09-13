import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ListWrap from '@mui/material/List';
import useStyles from './todo-jss';
import TaskItem from './TaskItem';
import PlaceLoader from './PlaceLoader';

function TaskList(props) {
  const { classes } = useStyles();
  const {
    removeTask,
    tasks,
    updateTask,
    loading,
  } = props;

  const taskItems = tasks.map((task, index) => (
    <Fragment key={index.toString()}>
      <TaskItem
        removeTask={removeTask}
        task={task}
        updateTask={updateTask}
      />
    </Fragment>
  ));

  return (
    <div>
      {loading
        ? <PlaceLoader loop={5} />
        : (
          <ListWrap className={classes.taskList}>
            {taskItems}
          </ListWrap>
        )
      }
    </div>
  );
}

TaskList.propTypes = {
  removeTask: PropTypes.func.isRequired,
  tasks: PropTypes.array,
  updateTask: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

TaskList.defaultProps = {
  tasks: [],
  loading: false
};

export default TaskList;
