import React from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Facebook } from 'exponent';
import TouchableNativeFeedback from '@exponent/react-native-touchable-native-feedback-safe';

import Layout from '../constants/Layout';
import { RegularText } from './StyledText';

export default class AuthenticationScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    },
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableNativeFeedback onPress={this._signInWithFacebook}>
          <View style={styles.facebookButton}>
            <RegularText style={styles.facebookButtonText}>
              Sign in with Facebook
            </RegularText>
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback onPress={this._continueAsGuest}>
          <View style={styles.guestButton}>
            <RegularText style={styles.guestButtonText}>
              Continue as a guest
            </RegularText>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }

  _signInWithFacebook = async () => {
    const result = await Facebook.logInWithReadPermissionsAsync('1615553262072011', {
      permissions: ['public_profile'],
      behavior: Platform.OS === 'ios' ? 'web' : 'system',
    });

    if (result.type === 'success') {
      let response = await fetch(`https://graph.facebook.com/me?access_token=${result.token}`);
      let info = await response.json();
      console.log({info});

      this.props.navigator.replace('list');
      requestAnimationFrame(() => {
        Alert.alert('Logged in!', `Hi ${info.name}!`);
      });
    }
  }

  _continueAsGuest = () => {
    this.props.navigator.replace('list');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facebookButton: {
    backgroundColor: '#3b5998',
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderRadius: 5,
    width: 250,
  },
  guestButton: {
    marginTop: 15,
    backgroundColor: '#eee',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    width: 250,
  },
  facebookButtonText: {
    fontSize: 15,
    color: '#fff',
  },
  guestButtonText: {
    fontSize: 15,
    color: 'rgba(0,0,0,0.9)',
  },
});
