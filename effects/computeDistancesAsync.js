import {
  Platform,
} from 'react-native';
import {
  Location,
  Permissions,
} from 'expo';
import geolib from 'geolib';

import Actions from '../state/Actions';

export default async function computeDistancesAsync({dispatch, getState}) {
  let { breweries } = getState();
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') { return; }

  let { coords } = await Location.getCurrentPositionAsync({
    enableHighAccuracy: Platform.OS === 'ios',
  });

  let breweriesWithDistances = breweries.all.map(brewery => {
    let distanceM = geolib.getDistance(
      {latitude: coords.latitude, longitude: coords.longitude},
      {latitude: brewery.latitude, longitude: brewery.longitude},
    );

    let distanceKm = (distanceM / 1000.0).toFixed(2);
    let formattedDistance = `${distanceKm}km`;

    let direction = geolib.getCompassDirection(
      {latitude: coords.latitude, longitude: coords.longitude},
      {latitude: brewery.latitude, longitude: brewery.longitude},
    );

    return brewery.
      set('distance', formattedDistance).
      set('direction', direction);
  });


  let nearbyBreweries = breweriesWithDistances.
    sortBy(brewery => brewery.distance).
    map(brewery => brewery.id);

  dispatch(Actions.setBreweries(breweriesWithDistances));
  dispatch(Actions.setNearbyBreweries(nearbyBreweries));
}
