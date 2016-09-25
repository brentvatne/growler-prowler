import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {
  NavigationBar
} from '@exponent/ex-navigation';
import {
  BoldText,
} from './StyledText';
import {
  Constants,
} from 'exponent';

import BreweryList from './BreweryList';

export default class BreweryListScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <BreweryList navigator={this.props.navigator} />
        {this._renderNavigationBar()}
      </View>
    );
  }

  _renderNavigationBar() {
    return (
      <View style={styles.navigationBarContainer}>
        <View style={styles.navigationBarTitleContainer}>
          <BoldText style={styles.navigationBarTitle}>
            All Breweries
          </BoldText>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: NavigationBar.DEFAULT_HEIGHT,
  },
  navigationBarContainer: {
    elevation: 1,
    height: NavigationBar.DEFAULT_HEIGHT,
    borderBottomWidth: NavigationBar.DEFAULT_BORDER_BOTTOM_WIDTH,
    borderBottomColor: NavigationBar.DEFAULT_BORDER_BOTTOM_COLOR,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Constants.statusBarHeight,
  },
  navigationBarTitleContainer: {
    flex: 1,
    alignItems: Platform.OS === 'ios' ? 'center' : 'flex-start',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  navigationBarTitle: {
    fontSize: 17,
    letterSpacing: -0.5,
  },
});
