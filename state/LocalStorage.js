import { AsyncStorage } from 'react-native';

const Keys = {
  User: 'GrowlerUser',
};

async function getUserAsync() {
  let results = await AsyncStorage.getItem(Keys.User);

  try {
    let user = JSON.parse(results);
    return user;
  } catch(e) {
    return null;
  }
}

function saveUserAsync(user: Object) {
  return AsyncStorage.setItem(Keys.User, JSON.stringify(user));
}

function removeUserAsync() {
  return AsyncStorage.removeItem(Keys.User);
}

function clearAllAsync() {
  return AsyncStorage.clear();
}

export default {
  saveUserAsync,
  getUserAsync,
  removeUserAsync,
  clearAllAsync,
};
