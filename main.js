import Exponent, {
  Font,
  Location,
  Permissions,
} from 'exponent';
import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@exponent/vector-icons';
import geolib from 'geolib';

import BreweryListItem from './components/BreweryListItem';
import breweries from './data';

class App extends React.Component {
  state = {
    appIsReady: false,
    breweries,
  };

  componentWillMount() {
    this._loadAssetsAsync();
    this._computeDistancesAsync();
  }

  _loadAssetsAsync = async () => {
    await Font.loadAsync({
      ...MaterialIcons.font,
      'OpenSans-Light': require('./assets/fonts/OpenSans-Light.ttf'),
      'OpenSans': require('./assets/fonts/OpenSans-Regular.ttf'),
      'OpenSans-Bold': require('./assets/fonts/OpenSans-Semibold.ttf'),
    });

    this.setState({
      appIsReady: true,
    });
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
    if (!this.state.appIsReady) {
      return <Exponent.Components.AppLoading />;
    }

    return (
      <ScrollView style={styles.container}>
        {
          this.state.breweries.map(brewery => (
            <BreweryListItem
              brewery={brewery}
              key={brewery.name}
            />
          ))
        }

        <StatusBar barStyle="default" />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
});

Exponent.registerRootComponent(App);
