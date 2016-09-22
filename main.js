import Exponent, {
  Font,
} from 'exponent';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { MaterialIcons } from '@exponent/vector-icons';

import BreweryList from './components/BreweryList';

class App extends React.Component {
  state = {
    appIsReady: false,
  };

  componentWillMount() {
    this._loadAssetsAsync();
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

  render() {
    if (!this.state.appIsReady) {
      return <Exponent.Components.AppLoading />;
    }

    return <BreweryList />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

Exponent.registerRootComponent(App);
