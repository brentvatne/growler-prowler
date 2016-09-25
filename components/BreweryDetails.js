import React from 'react';
import {
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  MaterialIcons,
} from '@exponent/vector-icons';
import Exponent from 'exponent';
import TouchableNativeFeedback from '@exponent/react-native-touchable-native-feedback-safe';
import {
  NavigationBar
} from '@exponent/ex-navigation';

import {
  BoldText,
  RegularText,
} from './StyledText';
import {
  MapCard,
  DescriptionCard,
  SummaryCard,
  InstagramPhotosCard,
} from './DetailCards';
import formatTime from '../util/formatTime';
import Layout from '../constants/Layout';

export default class BreweryDetails extends React.Component {

  state = {
    scrollY: new Animated.Value(0),
  }

  render() {
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

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.heroBackground, {backgroundColor: brewery.color, transform: [{translateY: heroBackgroundTranslateY}]}]} />

        <View style={styles.hero}>
          <Animated.Image
            source={{uri: brewery.logo}}
            style={{width: 210, height: 190, marginTop: 20, opacity: logoOpacity, transform: [{scale: logoScale}, {translateY: logoTranslateY}]}}
            resizeMode="contain"
          />
        </View>

        <Animated.ScrollView
          scrollEventThrottle={16}
          style={[StyleSheet.absoluteFill]}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}>
          <View style={styles.heroSpacer} />

          <View style={styles.contentContainerStyle}>
            <MapCard brewery={brewery} />
            <SummaryCard text={brewery.summary} />
            <DescriptionCard text={brewery.description} />
            <InstagramPhotosCard profile={brewery.instagram} />
          </View>
        </Animated.ScrollView>

        {this._renderNavigationBar()}

        <StatusBar barStyle={brewery.color === '#fff' ? 'default' : 'light-content'} />
      </View>
    );
  }

  _renderNavigationBar() {
    let {
      color,
      accentColor,
    } = this.props.brewery;

    return (
      <Animated.View style={[styles.navigationBar, {backgroundColor: color}]}>
        <View style={[styles.navigationBarAction, {marginLeft: -5}]}>
          <NavigationBar.BackButton
            tintColor={accentColor}
            onPress={() => this.props.navigator.pop() }
          />
        </View>

        <View style={styles.navigationBarTitle}>
          {this._renderNavigationBarTitle()}
        </View>

        <View style={styles.navigationBarAction}>
          <TouchableNativeFeedback>
            <MaterialIcons
              name="directions"
              size={25}
              color={accentColor}
            />
          </TouchableNativeFeedback>
        </View>
      </Animated.View>
    );
  }

  _renderNavigationBarTitle() {
    let {
      name,
      accentColor,
      openingTimeToday,
      closingTimeToday,
      isOpen,
      isOpeningLater,
    } = this.props.brewery;

    let { scrollY } = this.state;

    let titleOpacity = scrollY.interpolate({
      inputRange: [-1, 0, 150, 300, 301],
      outputRange: [0, 0, 0.1, 1, 1],
    });

    let titleTranslateY = scrollY.interpolate({
      inputRange: [-1, 0, 300, 301],
      outputRange: [0, 0, 5, 5],
    });

    let subtitleScale = scrollY.interpolate({
      inputRange: [-1, 0, 300, 301],
      outputRange: [1, 1, 0.75, 0.75],
    });

    let subtitleTranslateY = scrollY.interpolate({
      inputRange: [-1, 0, 300, 301],
      outputRange: [-10, -10, 2, 2],
    });

    if (isOpen) {
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
        <Animated.View style={{opacity: titleOpacity, transform: [{translateY: titleTranslateY}]}}>
          <BoldText style={[styles.navigationBarTitleText, {color: accentColor}]}>
            {name}
          </BoldText>
        </Animated.View>
        <Animated.View style={{backgroundColor: 'transparent', transform: [{scale: subtitleScale}, {translateY: subtitleTranslateY}]}}>
          <BoldText style={[styles.navigationBarTitleText, {color: accentColor}]}>
            {text}
          </BoldText>
        </Animated.View>
      </View>
    );
  }
}


const HeroHeight = 300;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  heroSpacer: {
    width: Layout.window.width,
    height: HeroHeight,
    backgroundColor: 'transparent',
  },
  contentContainerStyle: {
    paddingBottom: 30,
    backgroundColor: '#FAFAFA',
    minHeight: Layout.window.height - HeroHeight,
  },
  navigationBarTitleText: {
    color: '#fff',
    textAlign: 'center',
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
  navigationBar: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 75,
    alignItems: 'center',
    paddingTop: Exponent.Constants.statusBarHeight,
    paddingHorizontal: 5,
  },
});
