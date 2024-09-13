import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useStyles from './todo-jss';

function TaskItem(props) {
  const { classes, cx } = useStyles();
  const smDown = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const smUp = useMediaQuery(theme => theme.breakpoints.up('sm'));

  const {
    task,
    removeTask,
    updateTask,
  } = props;
  const [editing, setEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const save = (event) => {
    if (editing) {
      const title = event.target.value.trim();
      if (title.length && title !== task.title) {
        updateTask(task, { title });
      }
      setEditing(false);
    }
  };

  const stopEditing = () => {
    setEditing(false);
  };

  const handleClose = () => setAnchorEl(null);
  const handleClick = event => setAnchorEl(event.currentTarget);
  const edit = () => {
    setAnchorEl(null);
    setEditing(true);
  };

  const handleKeyUp = (event) => {
    if (event.keyCode === 13) {
      save(event);
    } else if (event.keyCode === 27) {
      setEditing(false);
    }
  };

  const remove = () => {
    removeTask(task);
    setAnchorEl(null);
  };

  const toggleStatus = () => {
    updateTask(task, { completed: !task.completed });
  };

  const renderTitleInput = (newTask) => (
    <input
        autoFocus // eslint-disable-line
      autoComplete="off"
      defaultValue={newTask.title}
      maxLength="64"
      onKeyUp={handleKeyUp}
      type="text"
    />
  );

  const open = Boolean(anchorEl);
  const renderTitle = taskParam => (
    <div className={cx(classes.taskTitle, task.completed && classes.completed)}>
      {taskParam.title}
    </div>
  );
  const containerClasses = cx('task-item', {
    'task-item--completed': task.completed,
    'task-item--editing': editing
  });

  return (
    <Fragment>
      <ListItem
        role={undefined}
        dense
        className={
          cx(
            containerClasses,
            classes.listItem,
          )
        }
      >
        <IconButton
          className={
            cx(
              classes.button,
              task.completed && classes.completed,
              editing && classes.hide
            )
          }
          size="small"
          onClick={toggleStatus}
        >
          <CheckIcon />
        </IconButton>

        <Typography noWrap component="div" className={classes.text}>
          {editing ? renderTitleInput(task) : renderTitle(task)}
        </Typography>

        <ListItemSecondaryAction>
          {!smDown && (
            <>
              <IconButton
                className={
                  cx(
                    classes.button,
                    editing && classes.hide
                  )
                }
                size="small"
                onClick={edit}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                className={
                  cx(
                    classes.button,
                    editing && classes.hide
                  )
                }
                size="small"
                onClick={remove}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
          {!smUp && (
            <>
              <IconButton
                aria-label="More"
                aria-owns={open ? 'long-menu' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                className={editing ? classes.hide : ''}
                size="large">
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={edit}>
                  Edit
                </MenuItem>
                <MenuItem onClick={remove}>
                  Remove
                </MenuItem>
              </Menu>
            </>
          )}
          <IconButton
            className={
              cx(
                classes.button,
                !editing && classes.hide
              )
            }
            size="small"
            onClick={stopEditing}
          >
            <CancelIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </Fragment>
  );
}

TaskItem.propTypes = {
  removeTask: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  updateTask: PropTypes.func.isRequired
};

export default TaskItem;
