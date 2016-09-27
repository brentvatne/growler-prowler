import Exponent, { Font } from 'exponent';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@exponent/vector-icons';
import { NavigationProvider, StackNavigation, withNavigation } from '@exponent/ex-navigation';
import { Provider as ReduxProvider, connect } from 'react-redux';
import ImageGalleryPortal from '@exponent/react-native-image-gallery';

import Actions from './state/Actions';
import LocalStorage from './state/LocalStorage';
import Router from './navigation/Router';
import Store from './state/Store';

class AppContainer extends React.Component {
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
      rootNavigator.replace('list');
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
    let user = await LocalStorage.getUserAsync();
    this.props.dispatch(Actions.setCurrentUser(user));

    this.setState({
      dataReady: true,
    });
  }

  render() {
    if (!this.state.assetsReady || !this.state.dataReady) {
      return <Exponent.Components.AppLoading />;
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

Exponent.registerRootComponent(AppContainer);
