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
    return state.set('nearby', action.breweryIds);
  }

  static [ActionTypes.SET_VISITED_BREWERIES](state, action) {
    return state.set('visited', action.breweryIds);
  }

  static [ActionTypes.ADD_VISITED_BREWERY](state, action) {
    let visited = state.visited.push(action.breweryId);
    return state.set('visited', visited);
  }

  static [ActionTypes.REMOVE_VISITED_BREWERY](state, action) {
    let index = state.visited.indexOf(action.breweryId);

    if (index === -1) {
      return state;
    }

    return state.set('visited', state.visited.delete(index));
  }
}

export default BreweriesReducer.reduce;
