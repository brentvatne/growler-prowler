import { AsyncStorage } from 'react-native';

const Keys = {
  User: 'User',
  VisitedBreweries: 'Visited',
};

async function getUserAsync() {
  let results = await AsyncStorage.getItem(Keys.User);

  try {
    return JSON.parse(results);
  } catch(e) {
    return null;
  }
}

function saveUserAsync(user) {
  return AsyncStorage.setItem(Keys.User, JSON.stringify(user));
}

function removeUserAsync() {
  return AsyncStorage.removeItem(Keys.User);
}

function saveVisitedBreweriesAsync(breweryIds) {
  return AsyncStorage.setItem(Keys.VisitedBreweries, JSON.stringify(breweryIds));
}

async function getVisitedBreweriesAsync() {
  let results = await AsyncStorage.getItem(Keys.VisitedBreweries);

  try {
    return JSON.parse(results);
  } catch(e) {
    return null;
  }
}

function clearAllAsync() {
  return AsyncStorage.clear();
}

export default {
  saveUserAsync,
  getUserAsync,
  removeUserAsync,
  saveVisitedBreweriesAsync,
  getVisitedBreweriesAsync,
  clearAllAsync,
};
