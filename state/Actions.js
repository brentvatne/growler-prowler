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

  static setNearbyBreweries(breweries) {
    return {
      type: ActionTypes.SET_NEARBY_BREWERIES,
      breweries,
    }
  }
}
