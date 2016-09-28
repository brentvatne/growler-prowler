import Actions from '../state/Actions';
import LocalStorage from '../state/LocalStorage';
import { User } from '../state/Records';

export default async function signOutAsync({action, dispatch}) {
  await LocalStorage.clearAllAsync();
  dispatch(Actions.setCurrentUser(new User()));
}
