import { applyMiddleware, combineReducers, createStore } from 'redux';
import { effectsMiddleware } from 'redux-effex';

import CurrentUserReducer from './CurrentUserReducer';
import Effects from '../effects';

export default createStore(
  combineReducers({
    currentUser: CurrentUserReducer,
  }),
  applyMiddleware(effectsMiddleware(Effects)),
);
