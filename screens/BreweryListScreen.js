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
    maxScrollY: minScrollViewHeight,
    scrollViewHeight: Layout.window.height - minScrollViewHeight,
    menuValue: new Animated.Value(0),
    scrollY: new Animated.Value(0),
    selectedOption: MenuOptions[0],
  }

  _initialScrollYForTouch: 0;
  _lastToValue = 0;
  _scrollY = 0;
  _hasScroll = false;
  _hasMomentum = false;
  _scrollEndTimer: any;

  componentDidMount() {
    this.props.dispatch(Actions.computeDistances());

    this.state.scrollY.addListener(({value}) => {
      this._scrollY = Math.min(Math.max(0, value), this.state.maxScrollY);
    });
  }

  _onMomentumScrollBegin = () => {
    this._hasMomentum = true;
  }

  _onMomentumScrollEnd = () => {
    clearTimeout(this._scrollEndTimer);
    this._hasMomentum = false;
    this._onScrollEnd();
  };

  _onScrollBeginDrag = () => {
    this._initialScrollYForTouch = this._scrollY;
  }

  _onScrollEndDrag = () => {
    // `onMomentumScrollEnd` is not always called so wait a little bit to check
    // if there is momentum scrolling and if there is adjust navbar in
    // `onMomentumScrollEnd` instead.
    clearTimeout(this._scrollEndTimer);
    this._scrollEndTimer = setTimeout(() => {
      if (!this._hasMomentum) {
        this._onScrollEnd();
      }
    }, 100);
  };

  _onScrollEnd = () => {
    let deltaY = this._scrollY - this._initialScrollYForTouch;

    if (deltaY > maxOffset || deltaY < -maxOffset) {
      return;
    }

    if (this._scrollY <= 0 || this._scrollY >= this.state.maxScrollY) {
      return;
    }

    if (deltaY > 0) {
      this._list.scrollTo({
        y: this._scrollY + maxOffset - deltaY,
        x: 0,
        animated: true,
      });
    } else {
      this._list.scrollTo({
        y: this._scrollY + (-maxOffset - deltaY),
        x: 0,
        animated: true,
      });
    }
  };

  _updateContentHeight = (w, h) => {
    const maxScrollY = Math.max(h - this.state.scrollViewHeight + maxOffset, 101);
    this.setState({contentHeight: h, maxScrollY});
  }

  render() {
    let { selectedOption } = this.state;
    let defaultListProps = {
      key: 'list',
      setRef: view => { this._list = view; },
      contentContainerStyle: {marginTop: NavigationBar.DEFAULT_HEIGHT},
      onContentSizeChange: this._updateContentHeight,
      onLayout: ({nativeEvent}) => { this.setState({scrollViewHeight: nativeEvent.layout.height}) },
      onMomentumScrollBegin: this._onMomentScrollBegin,
      onMomentumScrollEnd: this._onMomentScrollEnd,
      onScrollBeginDrag: this._onScrollBeginDrag,
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

        <Modal style={styles.menuModal} visible={this.state.menuIsVisible} collapsible={false}>
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

  _navigationBarAnimatedStyles = {};

  _getNavigationBarAnimatedStyles = (maxScrollY) => {
    if (this._navigationBarAnimatedStyles.maxScrollY !== maxScrollY ||
        this.state.selectedOption !== this._navigationBarAnimatedStyles.selectedOption) {
      this._navigationBarAnimatedStyles = {};
    } else if (Object.keys(this._navigationBarAnimatedStyles).length) {
      return this._navigationBarAnimatedStyles;
    }

    let {
      scrollY,
    } = this.state;

    let invertedClampedScrollY = scrollY.interpolate({
      inputRange: [0, maxScrollY],
      outputRange: [0, -maxScrollY],
      extrapolate: 'clamp',
    });

    let translateY = Animated.diffClamp(
      invertedClampedScrollY,
      -maxOffset,
      0,
    );

    let opacity = translateY.interpolate({
      inputRange: [-maxOffset, -maxOffset / 2, 0],
      outputRange: [0, 0, 1],
    });

    let scale = translateY.interpolate({
      inputRange: [-maxOffset, 0],
      outputRange: [Platform.OS === 'ios' ? 0 : 1, 1],
    });

    let contentTranslateY = translateY.interpolate({
      inputRange: [-maxOffset, 0],
      outputRange: [Platform.OS === 'ios' ? maxOffset / 1.5 : 0, 0],
    });

    this._navigationBarAnimatedStyles = {
      maxScrollY,
      translateY,
      opacity,
      scale,
      contentTranslateY,
      selectedOption: this.state.selectedOption,
    };

    return this._navigationBarAnimatedStyles;
  }

  _renderNavigationBar() {
    let {
      contentHeight,
      maxScrollY,
      menuValue,
      navBarShowAnim,
      scrollViewHeight,
    } = this.state;

    let arrowRotation = menuValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['90deg', '-90deg'],
    });

    let {
      translateY,
      opacity,
      scale,
      contentTranslateY,
    } = this._getNavigationBarAnimatedStyles(maxScrollY);

    return (
      <Animated.View
        key="navbar"
        style={[
          styles.navigationBarContainer,
          {overflow: 'hidden', paddingTop: Constants.statusBarHeight, transform: [{translateY}]}
        ]}>
        <Animated.View
          style={[
            styles.navigationBarTitleContainer,
            {opacity, transform: [{scale}, {translateY: contentTranslateY}]}
          ]}>
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

        <Animated.View
          style={[
            styles.navigationBarRightButton,
            {opacity, transform: [{scale}, {translateY: contentTranslateY}]}
          ]}>
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
    if (this._hasMomentum) {
      return;
    }

    let { translateY } = this._getNavigationBarAnimatedStyles(this.state.maxScrollY);
    let currentTranslateY = translateY.__getValue();
    if (currentTranslateY < 0) {
      this._list.scrollTo({
        y: this._scrollY - (maxOffset + currentTranslateY),
        x: 0,
        animated: true,
      });
    }

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
    backgroundColor: '#fff',
    height: NavigationBar.DEFAULT_HEIGHT,
    borderBottomWidth: 1,
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
