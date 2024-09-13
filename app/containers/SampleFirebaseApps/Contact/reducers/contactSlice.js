import { createSlice } from '@reduxjs/toolkit';
import notif from 'enl-api/ui/notifMessage';

const defaultVal = {
  avatar: '',
  name: '',
  title: '',
  phone: '',
  secondaryPhone: '',
  personalEmail: '',
  companyEmail: '',
  address: '',
  website: '',
  favorited: false
};

const initialState = {
  contactList: [],
  formValues: defaultVal,
  selectedIndex: 0,
  keyword: '',
  selectedId: '',
  avatarInit: '',
  openFrm: false,
  showMobileDetail: false,
  notifMsg: '',
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    fetchData: (state, action) => {
      const items = action.payload;
      state.contactList = items;
    },
    submit: (state) => {
      state.selectedIndex = 0;
      state.avatarInit = '';
      state.openFrm = false;
    },
    update: (state) => {
      state.avatarInit = '';
      state.openFrm = false;
    },
    add: (state) => {
      state.openFrm = true;
      state.avatarInit = '';
      state.formValues = defaultVal;
    },
    edit: (state, action) => {
      const item = action.payload;

      state.openFrm = true;
      state.selectedId = item.id;
      state.formValues = item;

      state.avatarInit = item.avatar;
    },
    closeForm: (state) => {
      state.openFrm = false;
      state.avatarInit = '';
      state.notifMsg = notif.discard;
    },
    search: (state, action) => {
      const val = action.payload;
      state.keyword = val;
    },
    showDetail: (state, action) => {
      const item = action.payload;
      const index = state.contactList.findIndex((obj) => obj.id === item.id);

      state.selectedIndex = index;
      state.showMobileDetail = true;
    },
    hideDetail: (state) => {
      state.showMobileDetail = false;
    },
  },
});

export const {
  fetchData, submit, update,
  add, closeForm, edit,
  search, showDetail, hideDetail,
} = contactSlice.actions;

export default contactSlice.reducer;
