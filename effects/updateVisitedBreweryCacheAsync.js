import LocalStorage from '../state/LocalStorage';

export default function updateVisitedCacheAsync({getState}) {
  let { breweries } = getState();
  let { visited } = breweries;

  LocalStorage.saveVisitedBreweriesAsync(visited.toJS());
}
