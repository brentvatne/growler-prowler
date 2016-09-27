import {
  Platform,
} from 'react-native';
import {
  Location,
  Permissions,
} from 'exponent';
import geolib from 'geolib';
import _ from 'lodash';

import Actions from '../state/Actions';

export default async function computeDistancesAsync({dispatch, getState}) {
  let { breweries } = getState();
  if (breweries[0].distance) {
    return;
  }

  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') { return; }

  let { coords } = await Location.getCurrentPositionAsync({
    enableHighAccuracy: Platform.OS === 'ios',
  });

  let breweriesWithDistances = breweries.map(brewery => {
    let distanceM = geolib.getDistance(
      {latitude: coords.latitude, longitude: coords.longitude},
      {latitude: brewery.latitude, longitude: brewery.longitude},
    )

    let distanceKm = (distanceM / 1000.0).toFixed(2);
    let formattedDistance = `${distanceKm}km`;

    let direction = geolib.getCompassDirection(
      {latitude: coords.latitude, longitude: coords.longitude},
      {latitude: brewery.latitude, longitude: brewery.longitude},
    );

    return {
      ...brewery,
      distance: formattedDistance,
      direction: direction,
    };
  });

  dispatch(Actions.setBreweries(breweriesWithDistances));
  let sortedBreweriesWithDistances = _.sortBy(breweriesWithDistances, brewery => brewery.distance);
  dispatch(Actions.setNearbyBreweries(sortedBreweriesWithDistances));
}
