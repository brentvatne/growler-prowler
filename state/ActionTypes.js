export default defineActionConstants([
 'SET_CURRENT_USER',
 'SIGN_IN',
 'SIGN_OUT',
]);

function defineActionConstants(names) {
  return names.reduce((result, name) => {
    result[name] = name;
    return result;
  }, {});
}
