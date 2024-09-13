/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { combineReducers } from '@reduxjs/toolkit';
import language from 'containers/LanguageProvider/reducer';
import treeTable from 'containers/Tables/reducers/treeTbSlice';
import crudTable from 'containers/Tables/reducers/crudTbSlice';
import contact from 'containers/SampleApps/Contact/reducers/contactSlice';
import contactFb from 'containers/SampleFirebaseApps/Contact/reducers/contactSlice';
import { contactApi } from 'containers/SampleFirebaseApps/Contact/services/contactApi';
import todo from 'containers/SampleApps/Todo/reducers/todoSlice';
import todoFb from 'containers/SampleFirebaseApps/Todo/reducers/todoSlice';
import { todoApi } from 'containers/SampleFirebaseApps/Todo/services/todoApi';
import email from 'containers/SampleApps/Email/reducers/emailSlice';
import emailFb from 'containers/SampleFirebaseApps/Email/reducers/emailSlice';
import { emailApi } from 'containers/SampleFirebaseApps/Email/services/emailApi';
import socmed from 'containers/Pages/Timeline/reducers/timelineSlice';
import chat from 'containers/Pages/Chat/reducers/chatSlice';
import ecommerce from 'containers/Pages/Ecommerce/reducers/ecommerceSlice';
import uiReducer from './modules/ui';
import authReducer from './modules/auth';

/**
 * Creates the main reducer with the dynamically injected ones
 */

export default combineReducers({
  ui: uiReducer,
  auth: authReducer,
  language,
  treeTable,
  crudTable,
  todo,
  todoFb,
  [todoApi.reducerPath]: todoApi.reducer,
  contact,
  contactFb,
  [contactApi.reducerPath]: contactApi.reducer,
  email,
  emailFb,
  [emailApi.reducerPath]: emailApi.reducer,
  socmed,
  chat,
  ecommerce
});
