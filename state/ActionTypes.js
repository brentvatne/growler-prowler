export default defineActionConstants([
  'SET_CURRENT_USER',
  'SIGN_IN',
  'SIGN_OUT',
  'SET_BREWERIES',
  'SET_NEARBY_BREWERIES',
  'COMPUTE_DISTANCES',
]);

function defineActionConstants(names) {
  return names.reduce((result, name) => {
    result[name] = name;
    return result;
  }, {});
}
