import ActionTypes from './ActionTypes';

class CurrentUserReducer {
  static reduce(state = {}, action) {
    if (CurrentUserReducer[action.type]) {
      return CurrentUserReducer[action.type](state, action);
    } else {
      return state;
    }
  }

  static [ActionTypes.SET_CURRENT_USER](state, action) {
    return {...action.user};
  }

  static [ActionTypes.RESET](state, action) {
    return {};
  }
}

export default CurrentUserReducer.reduce;
