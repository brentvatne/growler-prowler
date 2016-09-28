import ActionTypes from './ActionTypes';

export default class Actions {
  static setCurrentUser(user) {
    return {
      type: ActionTypes.SET_CURRENT_USER,
      user,
    }
  }

  static signIn(user) {
    return {
      type: ActionTypes.SIGN_IN,
      user,
    }
  }

  static signOut() {
    return {
      type: ActionTypes.SIGN_OUT,
    }
  }

  static setBreweries(breweries) {
    return {
      type: ActionTypes.SET_BREWERIES,
      breweries,
    }
  }

  static setNearbyBreweries(breweryIds) {
    return {
      type: ActionTypes.SET_NEARBY_BREWERIES,
      breweryIds,
    }
  }

  static setVisitedBreweries(breweryIds) {
    return {
      type: ActionTypes.SET_VISITED_BREWERIES,
      breweryIds,
    }
  }

  static toggleVisitedBrewery(breweryId) {
    return {
      type: ActionTypes.TOGGLE_VISITED_BREWERY,
      breweryId,
    }
  }

  static addVisitedBrewery(breweryId) {
    return {
      type: ActionTypes.ADD_VISITED_BREWERY,
      breweryId,
    }
  }

  static removeVisitedBrewery(breweryId) {
    return {
      type: ActionTypes.REMOVE_VISITED_BREWERY,
      breweryId,
    }
  }

  static computeDistances() {
    return {
      type: ActionTypes.COMPUTE_DISTANCES,
    }
  }
}
