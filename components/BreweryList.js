import React from 'react';
import {
  Location,
  Permissions,
} from 'exponent';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import geolib from 'geolib';

import BreweryListItem from './BreweryListItem';
import breweries from '../data';

export default class BreweryList extends React.Component {
  state = {
    breweries,
  }

  componentWillMount() {
    this._computeDistancesAsync();
  }

  _computeDistancesAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') { return; }

    let { coords } = await Location.getCurrentPositionAsync({
      enableHighAccuracy: Platform.OS === 'ios',
    });

    let breweriesWithDistances = this.state.breweries.map(brewery => {
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

    this.setState({
      breweries: breweriesWithDistances,
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {
          this.state.breweries.map(brewery => (
            <BreweryListItem
              onPress={() => this._handlePressBrewery(brewery)}
              brewery={brewery}
              key={brewery.name}
            />
          ))
        }

        <StatusBar barStyle="default" />
      </ScrollView>
    );
  }

  _handlePressBrewery = (brewery) => {
    this.props.navigator.push('details', {brewery});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
});
