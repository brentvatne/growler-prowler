import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import TouchableNativeFeedback from '@exponent/react-native-touchable-native-feedback-safe';
import { MaterialIcons } from '@exponent/vector-icons';

import Layout from '../constants/Layout';
import { RegularText, BoldText } from './StyledText';
import formatTime from '../util/formatTime';

export default class BreweryListItem extends React.Component {
  render() {
    let {
      address,
      closingTimeToday,
      isOpen,
      logo,
      name,
      distance,
      direction,
      openingTimeToday,
    } = this.props.brewery;

    return (
      <TouchableNativeFeedback onPress={() => {}} style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            resizeMode="contain"
            source={{uri: logo}}
            style={styles.logo}
          />
        </View>

        <View style={styles.infoContainer}>
          <RegularText style={styles.name}>
            {name}
          </RegularText>

          <RegularText style={styles.hours}>
            {formatTime(openingTimeToday)} - {formatTime(closingTimeToday)} ({isOpen ? 'Open' : 'Closed'})
          </RegularText>

          <RegularText style={styles.address}>
            {distance ? `${distance} ${direction.exact} - ` : ''} {address}
          </RegularText>
        </View>

        <View style={styles.buttonContainer}>
          <MaterialIcons name="chevron-right" size={30} color="#b8c3c9" />
        </View>
      </TouchableNativeFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: Layout.window.width,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  name: {
    fontSize: 16,
  },
  hours: {
    fontSize: 12,
  },
  address: {
    fontSize: 12,
  },
  logoContainer: {
    padding: 15,
  },
  logo: {
    width: 60,
    height: 60,
  },
  buttonContainer: {
    paddingRight: 5,
  },
});
