import Actions from '../state/Actions';
import LocalStorage from '../state/LocalStorage';

export default async function signInAsync({action, dispatch}) {
  let { user } = action;

  await LocalStorage.saveUserAsync(user.toJS());
  dispatch(Actions.setCurrentUser(user));
}
