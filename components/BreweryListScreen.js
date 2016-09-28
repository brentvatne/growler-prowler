import React from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  NavigationBar
} from '@exponent/ex-navigation';
import {
  BoldText,
  RegularText,
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
import Layout from '../constants/Layout';

const MenuOptions = [
  'All',
  'Nearby',
  'Visited',
  'Unvisited'
];

@connect()
export default class BreweryListScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    }
  }

  state = {
    selectedOption: MenuOptions[0],
    menuIsVisible: false,
    menuValue: new Animated.Value(0),
  }

  componentDidMount() {
    this.props.dispatch(Actions.computeDistances());
  }

  render() {
    let { selectedOption } = this.state;

    return (
      <View style={styles.container}>
        {selectedOption === 'All' && <BreweryList key="list" />}
        {selectedOption === 'Nearby' && <BreweryList key="list" nearby />}
        {selectedOption === 'Visited' && <BreweryList key="list" visited />}
        {selectedOption === 'Unvisited' && <BreweryList key="list" notVisited />}

        {this._renderMenuOverlay()}
        {this._renderMenu()}
        {this._renderNavigationBar()}
      </View>
    );
  }

  _renderMenuOverlay() {
    let opacity = this.state.menuValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.4],
    });

    return (
      <TouchableWithoutFeedback onPress={this._handleToggleMenu}>
        <Animated.View
          pointerEvents={this.state.menuIsVisible ? 'auto' : 'none'}
          style={[StyleSheet.absoluteFill, {backgroundColor: '#000', opacity}]}
        />
      </TouchableWithoutFeedback>
    );
  }

  _renderMenu() {
    let translateY = this.state.menuValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-300, 0],
    });

    return (
      <Animated.View style={[styles.menu, {transform: [{translateY}]}]}>
        {MenuOptions.map(this._renderMenuOption)}
      </Animated.View>
    );
  }

  _renderMenuOption = (title) => {
    return (
      <TouchableNativeFeedback
        fallback={TouchableHighlight}
        underlayColor="#ccc"
        key={title}
        onPress={() => this._handleSelectOption(title)}>
        <View style={styles.menuOption}>
          <RegularText>{title}</RegularText>
        </View>
      </TouchableNativeFeedback>
    );
  }

  _renderNavigationBar() {
    let arrowRotation = this.state.menuValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['90deg', '-90deg'],
    });

    return (
      <View style={styles.navigationBarContainer}>
        <View style={styles.navigationBarTitleContainer}>
          <TouchableWithoutFeedback
            hitSlop={{left: 40, top: 30, right: 40, bottom: 10}}
            onPress={this._handleToggleMenu}>
            <View style={{flexDirection: 'row'}}>
              <BoldText style={styles.navigationBarTitle}>
                {this.state.selectedOption} Breweries
              </BoldText>

              <Animated.View style={{marginLeft: 2, marginTop: 2, transform: [{rotate: arrowRotation}]}}>
                <MaterialIcons name="chevron-right" size={22} />
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.navigationBarLeftButton}>
          <TouchableNativeFeedback onPress={this._handlePressSignOut}>
            <MaterialIcons name="exit-to-app" size={23} style={{transform: [{rotate: '180deg'}]}} />
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }

  _handleSelectOption = (option) => {
    this.setState({selectedOption: option});
    this._handleToggleMenu();
  }

  _handleToggleMenu = () => {
    let { menuIsVisible } = this.state;

    this.setState({menuIsVisible: !menuIsVisible});
    Animated.spring(this.state.menuValue, {
      toValue: menuIsVisible ? 0 : 1,
      overshootClamping: true,
    }).start();
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
    backgroundColor: '#fff',
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
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: Platform.OS === 'ios' ? 'center' : 'flex-start',
    // Remove this paddingLeft conditional when we get rid of the button
    paddingLeft: Platform.OS === 'ios' ? 20 : 20 + 30,
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
  menu: {
    position: 'absolute',
    top: NavigationBar.DEFAULT_HEIGHT,
    left: 0,
    right: 0,
  },
  menuOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    width: Layout.window.width,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
});
