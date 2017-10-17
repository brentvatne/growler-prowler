import React from 'react';
import {
  Animated,
  Image,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Constants, LinearGradient } from 'expo';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import { withNavigation, Header, HeaderBackButton } from 'react-navigation';

import { BoldText, RegularText } from './StyledText';
import {
  MapCard,
  DescriptionCard,
  SummaryCard,
  InstagramPhotosCard,
  VisitedCard,
} from './DetailCards';
import formatTime from '../util/formatTime';
import Layout from '../constants/Layout';

@withNavigation
export default class BreweryDetails extends React.Component {
  state = {
    scrollY: new Animated.Value(0),
  };

  render() {
    let { brewery } = this.props;
    let { scrollY } = this.state;

    return (
      <View style={styles.container}>
        <View style={{ flex: 1, marginTop: -50 }}>
          {this._renderHeroHeader()}

          <Animated.ScrollView
            scrollEventThrottle={16}
            style={StyleSheet.absoluteFill}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}>
            <View style={styles.heroSpacer} />

            <View style={styles.contentContainerStyle}>
              <MapCard
                brewery={brewery}
                onPress={this._handlePressDirections}
              />
              <SummaryCard text={brewery.summary} />
              <DescriptionCard text={brewery.description} />
              <InstagramPhotosCard profile={brewery.instagram} />
              <VisitedCard breweryId={this.props.brewery.id} />
            </View>
          </Animated.ScrollView>
        </View>

        {this._renderNavigationBarShadow()}
        {this._renderNavigationBar()}

        <StatusBar barStyle={getBarStyle(brewery.color)} />
      </View>
    );
  }

  _renderHeroHeader() {
    let { brewery } = this.props;
    let { scrollY } = this.state;

    let logoScale = scrollY.interpolate({
      inputRange: [-150, 0, 150],
      outputRange: [1.5, 1, 1],
    });

    let logoTranslateY = scrollY.interpolate({
      inputRange: [-150, 0, 150],
      outputRange: [40, 0, -40],
    });

    let logoOpacity = scrollY.interpolate({
      inputRange: [-150, 0, 200, 400],
      outputRange: [1, 1, 0.2, 0.2],
    });

    let heroBackgroundTranslateY = scrollY.interpolate({
      inputRange: [-1, 0, 200, 201],
      outputRange: [0, 0, -400, -400],
    });

    let gradientTranslateY = scrollY.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [1, 0, -1],
    });
    return (
      <View>
        <Animated.View
          style={[
            styles.heroBackground,
            {
              backgroundColor: brewery.color,
              transform: [{ translateY: heroBackgroundTranslateY }],
            },
          ]}
        />

        <View style={styles.hero}>
          <Animated.Image
            source={{ uri: brewery.logo }}
            style={[
              styles.heroImage,
              {
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                  { translateY: logoTranslateY },
                ],
              },
            ]}
            resizeMode="contain"
          />
          <Animated.View
            style={[
              styles.heroBottomGradientContainer,
              { transform: [{ translateY: gradientTranslateY }] },
            ]}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.07)']}
              style={{ width: Layout.window.width, height: 30 }}
            />
          </Animated.View>
        </View>
      </View>
    );
  }

  _renderNavigationBar() {
    let { color, accentColor } = this.props.brewery;

    let { scrollY } = this.state;

    return (
      <Animated.View style={[styles.navigationBar, { backgroundColor: color }]}>
        <View style={[styles.navigationBarAction, { marginLeft: -5 }]}>
          <HeaderBackButton
            onPress={() => this.props.navigation.goBack()}
            tintColor={accentColor}
            title={null}
          />
        </View>

        <View style={styles.navigationBarTitle}>
          {this._renderNavigationBarTitle()}
        </View>

        <View style={styles.navigationBarAction}>
          <TouchableNativeFeedback onPress={this._handlePressDirections}>
            <MaterialIcons name="directions" size={25} color={accentColor} />
          </TouchableNativeFeedback>
        </View>
      </Animated.View>
    );
  }

  // Unfortunately we can't animate shadowOpacity right now with native
  // animations, because the prop isn't whitelisted. So we can use
  // LinearGradient instead
  _renderNavigationBarShadow() {
    let { scrollY } = this.state;

    let opacity = scrollY.interpolate({
      inputRange: [0, 50, 300, 301],
      outputRange: [0, 0, 1, 1],
    });

    return (
      <Animated.View style={[styles.navigationBarShadowContainer, { opacity }]}>
        <LinearGradient
          colors={['rgba(0,0,0,0.08)', 'transparent']}
          style={styles.navigationBarShadow}
        />
      </Animated.View>
    );
  }

  _renderNavigationBarTitle() {
    let {
      accentColor,
      closingTimeToday,
      isOpen,
      isOpeningLater,
      name,
      openingTimeToday,
    } = this.props.brewery;

    let { scrollY } = this.state;

    let titleOpacity = scrollY.interpolate({
      inputRange: [-1, 0, 150, 300, 301],
      outputRange: [0, 0, 0.1, 1, 1],
    });

    let titleTranslateY = scrollY.interpolate({
      inputRange: [-1, 0, 300, 301],
      outputRange: [0, 0, 3, 3],
    });

    let subtitleScale = scrollY.interpolate({
      inputRange: [-1, 0, 300, 301],
      outputRange: [1, 1, 0.75, 0.75],
    });

    let subtitleTranslateY = scrollY.interpolate({
      inputRange: [-1, 0, 300, 301],
      outputRange: [-10, -10, -1, -1],
    });

    if (!openingTimeToday || !closingTimeToday) {
      text = `Hours not available`;
    } else if (isOpen) {
      text = `Open until ${formatTime(closingTimeToday)}`;
    } else if (isOpeningLater) {
      containerStyle = styles.barIsOpeningLaterContainer;
      text = `Opening at ${formatTime(openingTimeToday)}`;
    } else {
      containerStyle = styles.barIsClosedContainer;
      text = `Closed since ${formatTime(closingTimeToday)}`;
    }

    return (
      <View>
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          }}>
          <BoldText
            style={[styles.navigationBarTitleText, { color: accentColor }]}>
            {name}
          </BoldText>
        </Animated.View>
        <Animated.View
          style={{
            backgroundColor: 'transparent',
            transform: [
              { scale: subtitleScale },
              { translateY: subtitleTranslateY },
            ],
          }}>
          <BoldText
            style={[styles.navigationBarTitleText, { color: accentColor }]}>
            {text}
          </BoldText>
        </Animated.View>
      </View>
    );
  }

  _handlePressDirections = () => {
    let { address, postalCode, city } = this.props.brewery;

    let daddr = encodeURIComponent(`${address} ${postalCode}, ${city}`);

    if (Platform.OS === 'ios') {
      Linking.openURL(`http://maps.apple.com/?daddr=${daddr}`);
    } else {
      Linking.openURL(`http://maps.google.com/?daddr=${daddr}`);
    }
  };
}

function getBarStyle(color) {
  if (color === '#fff' || color === '#f8fcf7' || color === '#fab234') {
    return 'default';
  } else {
    return 'light-content';
  }
}

const HeroHeight = 370;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  contentContainerStyle: {
    paddingBottom: 20,
    backgroundColor: '#FAFAFA',
    minHeight: Layout.window.height - HeroHeight,
  },
  heroSpacer: {
    width: Layout.window.width,
    height: HeroHeight,
    backgroundColor: 'transparent',
  },
  heroImage: {
    width: 210,
    height: 190,
    marginTop: 80,
  },
  heroBackground: {
    height: HeroHeight + 250,
  },
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HeroHeight,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBottomGradientContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  navigationBarTitleText: {
    color: '#fff',
    textAlign: 'center',
  },
  navigationBarAction: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationBarTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationBarShadowContainer: {
    position: 'absolute',
    top: Layout.HEADER_HEIGHT,
    left: 0,
    right: 0,
    height: 15,
    bottom: 0,
  },
  navigationBarShadow: {
    height: 15,
    width: Layout.window.width,
  },
  navigationBar: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Layout.HEADER_HEIGHT,
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 5,
  },
});
