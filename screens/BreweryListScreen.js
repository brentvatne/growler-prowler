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
  Constants,
} from 'exponent';
import {
  MaterialIcons,
} from '@exponent/vector-icons';
import { connect } from 'react-redux';
import TouchableNativeFeedback from '@exponent/react-native-touchable-native-feedback-safe';
import Modal from 'react-native-root-modal';

import Actions from '../state/Actions';
import BreweryList from '../components/BreweryList';
import Layout from '../constants/Layout';
import {
  BoldText,
  RegularText,
} from '../components/StyledText';

const MenuOptions = [
  'All',
  'Nearby',
  'Visited',
  'Unvisited'
];

const maxOffset = NavigationBar.DEFAULT_HEIGHT - Constants.statusBarHeight;
const minScrollViewHeight = 100;

@connect()
export default class BreweryListScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    }
  }

  state = {
    menuIsVisible: false,
    contentHeight: Layout.window.height,
    scrollViewHeight: Layout.window.height - minScrollViewHeight,
    menuValue: new Animated.Value(0),
    scrollY: new Animated.Value(0),
    navBarShowAnim: new Animated.Value(0),
    selectedOption: MenuOptions[0],
  }

  _lastToValue = 0;
  _scrollY = 0;
  _prevScrollY = 0;
  _hasMomentum = false;
  _scrollEndTimer: any;

  componentDidMount() {
    this.props.dispatch(Actions.computeDistances());

    this.state.scrollY.addListener(({value}) => {
      this._prevScrollY = this._scrollY;
      this._scrollY = value;
    });
  }

  _onScrollEndDrag = () => {
    let { navBarShowAnim } = this.state;
    let deltaY = this._scrollY - this._prevScrollY;

    let toValue;
    if (deltaY > 0 && this._scrollY >= maxOffset) {
      if (this._prevToValue < 0) {
        toValue = this._prevToValue - maxOffset;
      } else {
        toValue = -maxOffset;
      }
    } else {
      if (this._prevToValue > 0) {
        toValue = this._prevToValue + maxOffset;
      } else {
        toValue = maxOffset;
      }
    }

    this._prevToValue = toValue;

    Animated.timing(navBarShowAnim, {
      toValue,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  render() {
    let { selectedOption } = this.state;
    let defaultListProps = {
      key: 'list',
      contentContainerStyle: {marginTop: NavigationBar.DEFAULT_HEIGHT},
      onContentSizeChange: (w, h) => { this.setState({contentHeight: h}) },
      onLayout: ({nativeEvent}) => { this.setState({scrollViewHeight: nativeEvent.layout.height}) },
      onScrollEndDrag: this._onScrollEndDrag,
      onScroll: Animated.event(
        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
        { useNativeDriver: false }
      )
    };

    return (
      <View style={styles.container}>
        {selectedOption === 'All' && <BreweryList {...defaultListProps} />}
        {selectedOption === 'Nearby' && <BreweryList {...defaultListProps} nearby />}
        {selectedOption === 'Visited' && <BreweryList {...defaultListProps} visited />}
        {selectedOption === 'Unvisited' && <BreweryList {...defaultListProps} notVisited />}

        {this._renderNavigationBar()}

        <Modal style={styles.menuModal} visible={this.state.menuIsVisible}>
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
    let {
      contentHeight,
      menuValue,
      navBarShowAnim,
      scrollViewHeight,
      scrollY,
    } = this.state;

    let arrowRotation = menuValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['90deg', '-90deg'],
    });

    const maxScrollY = Math.max(
      contentHeight - scrollViewHeight + maxOffset,
      minScrollViewHeight + 1,
    );

    let clampedScrollY = scrollY.interpolate({
      inputRange: [-1, 0, maxScrollY, maxScrollY + 1],
      outputRange: [0, 0, maxScrollY, maxScrollY]
    });

    let invertedClampedScrollY = clampedScrollY.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [-1, 0, -1],
    });

    let invertedDiffClampedScrollY = Animated.diffClamp(
      invertedClampedScrollY,
      -maxOffset,
      0,
    );

    let combinedClampedScrollY = Animated.add(
      invertedDiffClampedScrollY,
      navBarShowAnim
    );

    let translateY = Animated.diffClamp(
      combinedClampedScrollY,
      -maxOffset,
      0,
    );

    let opacity = translateY.interpolate({
      inputRange: [-maxOffset, -maxOffset / 2, 0],
      outputRange: [0, 0, 1],
    });

    let scale = translateY.interpolate({
      inputRange: [-maxOffset, 0],
      outputRange: [0, 1],
    });

    let contentTranslateY = translateY.interpolate({
      inputRange: [-maxOffset, 0],
      outputRange: [maxOffset / 1.5, 0],
    });

    return (
      <Animated.View style={[styles.navigationBarContainer, {overflow: 'hidden', paddingTop: Constants.statusBarHeight, transform: [{translateY}]}]}>
        <Animated.View style={[styles.navigationBarTitleContainer, {opacity, transform: [{scale}, {translateY: contentTranslateY}]}]}>
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
        </Animated.View>

        <Animated.View style={[styles.navigationBarRightButton, {opacity, transform: [{scale}, {translateY: contentTranslateY}]}]}>
          <TouchableNativeFeedback onPress={this._handlePressUpdateLocation}>
            <MaterialIcons name="my-location" size={20} />
          </TouchableNativeFeedback>
        </Animated.View>
      </Animated.View>
    );
  }

  _handleSelectOption = (option) => {
    this.setState({selectedOption: option});
    this._handleToggleMenu();
  }

  _handleToggleMenu = () => {
    let { menuIsVisible } = this.state;
    let onCompleteAnimation = () => {}

    // When transitioning from visible->hidden, we wait until the animation
    // completes before updating the state, otherwise it will be hidden
    // before the animation can be run
    if (this.state.menuIsVisible) {
      onCompleteAnimation = ({finished}) => {
        this.setState({menuIsVisible: false});
      }
    } else {
      this.setState({menuIsVisible: true});
    }

    Animated.spring(this.state.menuValue, {
      toValue: menuIsVisible ? 0 : 1,
      overshootClamping: true,
    }).start(onCompleteAnimation);
  }

  _handlePressUpdateLocation = () => {
    this.props.dispatch(Actions.computeDistances());
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    top: NavigationBar.DEFAULT_HEIGHT,
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
