import { applyMiddleware, combineReducers, createStore } from 'redux';
import { effectsMiddleware } from 'redux-effex';

import CurrentUserReducer from './CurrentUserReducer';
import BreweriesReducer from './BreweriesReducer';
import NearbyBreweriesReducer from './NearbyBreweriesReducer';
import Effects from '../effects';

export default createStore(
  combineReducers({
    currentUser: CurrentUserReducer,
    breweries: BreweriesReducer,
    nearbyBreweries: NearbyBreweriesReducer,
  }),
  applyMiddleware(effectsMiddleware(Effects)),
);
