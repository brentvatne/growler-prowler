import Actions from '../state/Actions';
import LocalStorage from '../state/LocalStorage';

export default async function signOutAsync({action, dispatch}) {
  await LocalStorage.clearAllAsync();
  dispatch(Actions.setCurrentUser(null));
}
