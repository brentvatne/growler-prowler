import Expo, { Font } from 'expo';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProvider, StackNavigation, withNavigation } from '@expo/ex-navigation';
import { Provider as ReduxProvider, connect } from 'react-redux';
import { List } from 'immutable';

import Actions from './state/Actions';
import ImageGalleryPortal from './components/ImageGalleryPortal';
import LocalStorage from './state/LocalStorage';
import Router from './navigation/Router';
import Store from './state/Store';
import { Brewery, User } from './state/Records';
import AllBreweries from './data';

export default class AppContainer extends React.Component {
  render() {
    return (
      <ReduxProvider store={Store}>
        <NavigationProvider router={Router}>
          <App {...this.props} />
        </NavigationProvider>
      </ReduxProvider>
    );
  }
}

@withNavigation
@connect(data => App.getDataProps)
class App extends React.Component {
  static getDataProps(data) {
    return {
      currentUser: data.currentUser,
    }
  }

  state = {
    assetsReady: false,
    dataReady: false,
  };

  async componentDidMount() {
    await this._loadAssetsAsync();
    await this._loadCacheAsync();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.assetsReady || !this.state.dataReady) {
      return;
    }

    const rootNavigator = this.props.navigation.getNavigator('root');
    const previouslySignedIn = isSignedIn(prevProps.currentUser) &&
      prevState.dataReady === this.state.dataReady;
    const currentlySignedIn = isSignedIn(this.props.currentUser);

    if (!previouslySignedIn && currentlySignedIn) {
      rootNavigator.replace('tabNavigation');
    } else if (previouslySignedIn && !currentlySignedIn) {
      rootNavigator.replace('authentication');
    }
  }

  _loadAssetsAsync = async () => {
    await Font.loadAsync({
      ...MaterialIcons.font,
      'OpenSans-Light': require('./assets/fonts/OpenSans-Light.ttf'),
      'OpenSans': require('./assets/fonts/OpenSans-Regular.ttf'),
      'OpenSans-Bold': require('./assets/fonts/OpenSans-Semibold.ttf'),
    });

    this.setState({
      assetsReady: true,
    });
  }

  _loadCacheAsync = async () => {
    let user = new User(await LocalStorage.getUserAsync());
    let breweries = new List(AllBreweries.map(data => new Brewery(data)));
    let visitedBreweries = new List(await LocalStorage.getVisitedBreweriesAsync());
    this.props.dispatch(Actions.setCurrentUser(user));
    this.props.dispatch(Actions.setBreweries(breweries));
    this.props.dispatch(Actions.setVisitedBreweries(visitedBreweries));

    this.setState({
      dataReady: true,
    });
  }

  render() {
    if (!this.state.assetsReady || !this.state.dataReady) {
      return <Expo.Components.AppLoading />;
    }

    return (
      <View style={styles.container}>
        <StackNavigation
          id="root"
          defaultRouteConfig={{navigationBar: { backgroundColor: '#fff'}}}
          initialRoute={Router.getRoute('authentication')}
        />

        <ImageGalleryPortal />
      </View>
    );
  }
}

function isSignedIn(userState) {
  return !!userState.authToken || userState.isGuest;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
