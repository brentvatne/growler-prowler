import Exponent, {
  Asset,
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
import ImageGallery from '@exponent/react-native-image-gallery';
import {
  NavigationProvider,
  StackNavigation,
  createRouter,
} from '@exponent/ex-navigation';

import AuthenticationScreen from './components/AuthenticationScreen';
import BreweryDetailsScreen from './components/BreweryDetailsScreen';
import BreweryListScreen from './components/BreweryListScreen';

const Router = createRouter(() => ({
  list: () => BreweryListScreen,
  details: () => BreweryDetailsScreen,
  authentication: () => AuthenticationScreen,
}));

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

    return (
      <View style={styles.container}>
        <NavigationProvider router={Router}>
          <StackNavigation
            defaultRouteConfig={{
              navigationBar: {
                backgroundColor: '#fff',
              }
            }}
            initialRoute={Router.getRoute('authentication')}
          />
        </NavigationProvider>

        <ImageGallery />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

Exponent.registerRootComponent(App);
