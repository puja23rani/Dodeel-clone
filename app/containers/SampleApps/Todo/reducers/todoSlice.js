import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filter: '',
  list: []
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    fetchTasksAction: (state, action) => {
      const items = action.payload;
      state.list = items;
    },
    createTaskAction: (state, action) => {
      const title = action.payload;
      const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
      state.list.unshift({ id, title, completed: false });
    },
    removeTaskAction: (state, action) => {
      const item = action.payload;
      const index = state.list.findIndex((obj) => obj.id === item.id);
      if (index !== -1) {
        state.list.splice(index, 1);
      }
    },
    updateTaskAction: (state, action) => {
      const { task, change } = action.payload;
      const index = state.list.findIndex((obj) => obj.id === task.id);
      if (index !== -1) {
        state.list[index] = { ...task, ...change };
      }
    },
    filterTasksAction: (state, action) => {
      const filterType = action.payload;
      state.filter = filterType;
    }
  }
});

export const {
  fetchTasksAction, createTaskAction, removeTaskAction,
  updateTaskAction, filterTasksAction
} = todoSlice.actions;

export default todoSlice.reducer;
