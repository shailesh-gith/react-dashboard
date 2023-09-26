import { combineReducers, configureStore } from '@reduxjs/toolkit';


import user from './user';
import apiInstance from './apis/createAPiInstance';

const rootReducer = combineReducers({
  user,
  [apiInstance.reducerPath]: apiInstance.reducer,
});
const reducer = (state, action) => {
  if (action.type === 'logout') {
    state = {};
  }
  return rootReducer(state, action);
};
export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiInstance.middleware
    ),
});