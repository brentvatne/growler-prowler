import { applyMiddleware, combineReducers, createStore } from 'redux';
import { effectsMiddleware } from 'redux-effex';

import CurrentUserReducer from './CurrentUserReducer';
import BreweriesReducer from './BreweriesReducer';
import Effects from '../effects';

export default createStore(
  combineReducers({
    currentUser: CurrentUserReducer,
    breweries: BreweriesReducer,
  }),
  applyMiddleware(effectsMiddleware(Effects)),
);
