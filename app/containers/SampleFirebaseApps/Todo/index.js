import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import brand from 'enl-api/dummy/brand';
import { Helmet } from 'react-helmet';
import {
  TaskFilters,
  TaskForm,
  TaskList,
  PapperBlock
} from 'enl-components';
import useStyles from 'enl-components/TodoList/todo-jss';
import { injectIntl } from 'react-intl';
import messages from 'enl-components/TodoList/messages';
import { filterTasksAction, fetchTasksAction } from './reducers/todoSlice';
import {
  useFetchTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from './services/todoApi';

function Todo(props) {
  const { intl } = props;
  const { classes } = useStyles();
  const title = brand.name + ' - Todo App';
  const description = brand.desc;

  // Redux State
  const taskList = useSelector(state => state.todoFb.list);
  const filterType = useSelector(state => state.todoFb.filter);
  const filteredTasks = () => {
    switch (filterType) {
      case 'active':
        return taskList.filter(task => !task.completed);
      case 'completed':
        return taskList.filter(task => task.completed);
      default:
        return taskList;
    }
  };

  // Redux Query
  const { data, isLoading } = useFetchTodosQuery();
  const [createTodo] = useCreateTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  // Dispatcher
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasksAction(data));
  }, [data]);

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <PapperBlock
        title={intl.formatMessage(messages.title)}
        icon="playlist_add_check"
        noMargin
        whiteBg
        colorMode="light"
        desc={intl.formatMessage(messages.subtitle)}
        className={classes.root}
      >
        <TaskForm handleSubmit={(payload) => createTodo(payload)} />
        <div className="g-col">
          <TaskFilters filter={(payload) => dispatch(filterTasksAction(payload))} type={filterType} />
          <TaskList
            loading={isLoading}
            removeTask={(payload) => deleteTodo(payload)}
            tasks={filteredTasks()}
            updateTask={(task, change) => updateTodo({ task, change })}
          />
        </div>
      </PapperBlock>
    </div>
  );
}

Todo.propTypes = {
  intl: PropTypes.object.isRequired
};

export default injectIntl(Todo);
