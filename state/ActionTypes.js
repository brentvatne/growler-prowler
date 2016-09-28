export default defineActionConstants([
  'SET_CURRENT_USER',
  'SIGN_IN',
  'SIGN_OUT',
  'SET_BREWERIES',
  'COMPUTE_DISTANCES',
  'SET_NEARBY_BREWERIES',
  'SET_VISITED_BREWERIES',
  'ADD_VISITED_BREWERY',
  'REMOVE_VISITED_BREWERY',
  'TOGGLE_VISITED_BREWERY',
]);

function defineActionConstants(names) {
  return names.reduce((result, name) => {
    result[name] = name;
    return result;
  }, {});
}
