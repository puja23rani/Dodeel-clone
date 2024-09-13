/**
 * Create the store with dynamic reducers
 */

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import {
  persistStore, persistReducer,
  FLUSH, REHYDRATE, PAUSE,
  PERSIST, PURGE, REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { todoApi } from 'containers/SampleFirebaseApps/Todo/services/todoApi';
import { emailApi } from 'containers/SampleFirebaseApps/Email/services/emailApi';
import { contactApi } from 'containers/SampleFirebaseApps/Contact/services/contactApi';
import rootReducer from './reducers';

const persistConfig = {
  key: 'enlite',
  storage,
  whitelist: []
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        FLUSH, REHYDRATE, PAUSE,
        PERSIST, PURGE, REGISTER
      ],
      ignoredPaths: ['auth.user', 'crudTable.crudTableDemo', 'email', 'calendar'],
      ignoredActionPaths: ['payload']
    },
  }).concat(todoApi.middleware, emailApi.middleware, contactApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export default store;
