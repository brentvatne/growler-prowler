import ActionTypes from './ActionTypes';
import { BreweriesState, Brewery } from './Records';

class BreweriesReducer {
  static reduce(state = new BreweriesState(), action) {
    if (BreweriesReducer[action.type]) {
      return BreweriesReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SET_BREWERIES](state, action) {
    let breweries = action.breweries.sortBy(brewery => brewery.name);
    return state.set('all', breweries);
  }

  static [ActionTypes.SET_NEARBY_BREWERIES](state, action) {
    return state.set('nearby', action.breweries);
  }
}

export default BreweriesReducer.reduce;
