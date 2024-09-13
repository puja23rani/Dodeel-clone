import { createSlice } from '@reduxjs/toolkit';
import notif from 'enl-api/ui/notifMessage';

const initialState = {
  inbox: [],
  selectedMail: 0,
  selectedMailId: '',
  keywordValue: '',
  currentPage: 'inbox',
  openFrm: false,
  notifMsg: '',
};

const emailSlice = createSlice({
  name: 'emailFb',
  initialState,
  reducers: {
    fetchData: (state, action) => {
      const items = action.payload;
      state.inbox = items;
    },
    open: (state, action) => {
      const mail = action.payload;
      const index = state.inbox.findIndex((obj) => obj.id === mail.id);
      if (index !== -1) {
        state.selectedMail = index;
      }
    },
    filter: (state, action) => {
      state.currentPage = action.payload;
    },
    compose: (state) => {
      state.openFrm = true;
    },
    send: (state) => {
      state.selectedMail = '';
      state.openFrm = false;
    },
    discard: (state) => {
      state.openFrm = false;
      state.selectedMailId = '';
      state.notifMsg = notif.discard;
    },
    search: (state, action) => {
      const keyword = action.payload;
      state.keywordValue = keyword;
    },
  }
});

export const {
  fetchData, open, filter,
  compose, send, discard,
  search, deleteMail, closeNotif
} = emailSlice.actions;

export default emailSlice.reducer;
