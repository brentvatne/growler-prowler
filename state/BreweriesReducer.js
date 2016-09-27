import ActionTypes from './ActionTypes';
import _ from 'lodash';

class BreweriesReducer {
  static reduce(state = [], action) {
    if (BreweriesReducer[action.type]) {
      return BreweriesReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SET_BREWERIES](state, action) {
    return _.sortBy(action.breweries, brewery => brewery.name);
  }
}

export default BreweriesReducer.reduce;
