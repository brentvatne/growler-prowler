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
import { Constants } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import Modal from 'react-native-root-modal';
import { Header } from 'react-navigation';

import Actions from '../state/Actions';
import BreweryList from '../components/BreweryList';
import Layout from '../constants/Layout';
import { BoldText, RegularText } from '../components/StyledText';

const MenuOptions = ['All', 'Nearby', 'Visited', 'Unvisited'];

@connect()
export default class BreweryListScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    },
  };

  state = {
    menuIsVisible: false,
    menuValue: new Animated.Value(0),
    selectedOption: MenuOptions[0],
  };

  componentDidMount() {
    this.props.dispatch(Actions.computeDistances());
  }

  render() {
    let { selectedOption } = this.state;
    let defaultListProps = {
      key: 'list',
      setRef: view => {
        this._list = view;
      },
      contentContainerStyle: { paddingTop: Layout.HEADER_HEIGHT },
    };

    return (
      <View style={styles.container}>
        {selectedOption === 'All' && <BreweryList {...defaultListProps} />}
        {selectedOption === 'Nearby' && (
          <BreweryList {...defaultListProps} nearby />
        )}
        {selectedOption === 'Visited' && (
          <BreweryList {...defaultListProps} visited />
        )}
        {selectedOption === 'Unvisited' && (
          <BreweryList {...defaultListProps} notVisited />
        )}

        {this._renderNavigationBar()}

        <Modal
          style={styles.menuModal}
          visible={this.state.menuIsVisible}
          collapsible={false}>
          {this._renderMenuOverlay()}
          {this._renderMenu()}
        </Modal>
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
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: '#000', opacity },
          ]}
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
      <Animated.View style={[styles.menu, { transform: [{ translateY }] }]}>
        {MenuOptions.map(this._renderMenuOption)}
      </Animated.View>
    );
  }

  _renderMenuOption = title => {
    return (
      <TouchableNativeFeedback
        fallback={TouchableHighlight}
        underlayColor="#eee"
        key={title}
        onPress={() => this._handleSelectOption(title)}>
        <View style={styles.menuOption}>
          <RegularText>{title}</RegularText>
        </View>
      </TouchableNativeFeedback>
    );
  };

  _navigationBarAnimatedStyles = {};

  _renderNavigationBar() {
    let { contentHeight, menuValue } = this.state;

    let arrowRotation = menuValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['90deg', '-90deg'],
    });
    return (
      <View key="navbar" style={styles.navigationBarContainer}>
        <View style={styles.navigationBarTitleContainer}>
          <TouchableWithoutFeedback
            hitSlop={{ left: 40, top: 30, right: 40, bottom: 10 }}
            onPress={this._handleToggleMenu}>
            <View style={{ flexDirection: 'row' }}>
              <BoldText style={styles.navigationBarTitle}>
                {this.state.selectedOption} Breweries
              </BoldText>

              <Animated.View
                style={{
                  marginLeft: 2,
                  marginTop: 2,
                  transform: [{ rotate: arrowRotation }],
                }}>
                <MaterialIcons name="chevron-right" size={22} />
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.navigationBarRightButton}>
          <TouchableNativeFeedback onPress={this._handlePressUpdateLocation}>
            <MaterialIcons name="my-location" size={20} />
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }

  _handleSelectOption = option => {
    this.setState({ selectedOption: option });
    this._handleToggleMenu();
  };

  _handleToggleMenu = () => {
    let { menuIsVisible } = this.state;
    let onCompleteAnimation = () => {};

    // When transitioning from visible->hidden, we wait until the animation
    // completes before updating the state, otherwise it will be hidden
    // before the animation can be run
    if (this.state.menuIsVisible) {
      onCompleteAnimation = ({ finished }) => {
        this.setState({ menuIsVisible: false });
      };
    } else {
      this.setState({ menuIsVisible: true });
    }

    Animated.spring(this.state.menuValue, {
      toValue: menuIsVisible ? 0 : 1,
      overshootClamping: true,
    }).start(onCompleteAnimation);
  };

  _handlePressUpdateLocation = () => {
    this.props.dispatch(Actions.computeDistances());
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationBarContainer: {
    backgroundColor: '#fff',
    height: Layout.HEADER_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    position: 'absolute',
    overflow: 'hidden',
    paddingTop: Constants.statusBarHeight,
    top: 0,
    left: 0,
    right: 0,
  },
  navigationBarTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: Platform.OS === 'ios' ? 'center' : 'flex-start',
  },
  navigationBarTitle: {
    fontSize: 17,
    letterSpacing: -0.5,
  },
  navigationBarRightButton: {
    position: 'absolute',
    top: 0,
    right: 15,
    bottom: 0,
    top: Constants.statusBarHeight,
    justifyContent: 'center',
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  menuModal: {
    ...StyleSheet.absoluteFillObject,
    top: Layout.HEADER_HEIGHT,
    backgroundColor: 'transparent',
    overflow: 'hidden',
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
