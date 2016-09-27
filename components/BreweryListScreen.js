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
import {
  MaterialIcons,
} from '@exponent/vector-icons';
import { connect } from 'react-redux';
import TouchableNativeFeedback from '@exponent/react-native-touchable-native-feedback-safe';

import Actions from '../state/Actions';
import BreweryList from './BreweryList';

@connect()
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

        <View style={styles.navigationBarLeftButton}>
          <TouchableNativeFeedback onPress={this._handlePressSignOut}>
            <MaterialIcons name="exit-to-app" size={25} style={{transform: [{rotate: '180deg'}]}} />
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }

  _handlePressSignOut = () => {
    this.props.dispatch(Actions.signOut());
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
    // Remove this paddingLeft conditional when we get rid of the button
    paddingLeft: Platform.OS === 'ios' ? 20 : 20 + 40,
  },
  navigationBarTitle: {
    fontSize: 17,
    letterSpacing: -0.5,
  },
  navigationBarLeftButton: {
    position: 'absolute',
    top: 0,
    left: 15,
    bottom: 0,
    top: Constants.statusBarHeight,
    justifyContent: 'center',
  },
});
