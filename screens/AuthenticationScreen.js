import React from 'react';
import { Alert, Image, Platform, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { Facebook } from 'expo';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import FadeIn from 'react-native-fade-in-image';

import Actions from '../state/Actions';
import Layout from '../constants/Layout';
import { RegularText } from '../components/StyledText';
import { User } from '../state/Records';

@connect()
export default class AuthenticationScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{
            width: 100,
            height: 200,
            marginBottom: 30,
          }}
          resizeMode="contain"
          source={require('../assets/images/logo.png')}
        />
        <TouchableNativeFeedback
          onPress={this._signInWithFacebook}
          style={styles.facebookButton}>
          <RegularText style={styles.facebookButtonText}>
            Sign in with Facebook
          </RegularText>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback
          onPress={this._continueAsGuest}
          style={styles.guestButton}>
          <RegularText style={styles.guestButtonText}>
            Continue as a guest
          </RegularText>
        </TouchableNativeFeedback>
      </View>
    );
  }

  _signInWithFacebook = async () => {
    const result = await Facebook.logInWithReadPermissionsAsync(
      '1615553262072011',
      {
        permissions: ['public_profile'],
        behavior: Platform.OS === 'ios' ? 'web' : 'system',
      }
    );

    if (result.type === 'success') {
      let response = await fetch(
        `https://graph.facebook.com/me?access_token=${result.token}`
      );
      let info = await response.json();

      this.props.dispatch(
        Actions.signIn(
          new User({
            id: info.id,
            authToken: result.token,
            name: info.name,
            isGuest: false,
          })
        )
      );
    }
  };

  _continueAsGuest = () => {
    this.props.dispatch(Actions.signIn(new User({ isGuest: true })));
  };
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
