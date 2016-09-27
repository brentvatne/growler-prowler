import ActionTypes from './ActionTypes';

class NearbyBreweriesReducer {
  static reduce(state = [], action) {
    if (NearbyBreweriesReducer[action.type]) {
      return NearbyBreweriesReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SET_NEARBY_BREWERIES](state, action) {
    return action.breweries;
  }
}

export default NearbyBreweriesReducer.reduce;
