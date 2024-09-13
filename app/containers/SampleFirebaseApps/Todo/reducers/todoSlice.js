import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filter: '',
  list: []
};

const todoSlice = createSlice({
  name: 'todoFb',
  initialState,
  reducers: {
    fetchTasksAction: (state, action) => {
      const items = action.payload;
      state.list = items;
    },
    filterTasksAction: (state, action) => {
      const filterType = action.payload;
      state.filter = filterType;
    }
  }
});

export const { fetchTasksAction, filterTasksAction } = todoSlice.actions;

export default todoSlice.reducer;
