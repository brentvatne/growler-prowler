import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import {
  Font,
} from 'expo';

export class RegularText extends React.Component {
  render() {
    return (
      <Text {...this.props} style={[this.props.style, styles.regular]} />
    );
  }
}

export class LightText extends React.Component {
  render() {
    return (
      <Text {...this.props} style={[this.props.style, styles.light]} />
    );
  }
}

export class BoldText extends React.Component {
  render() {
    return (
      <Text {...this.props} style={[this.props.style, styles.bold]} />
    );
  }
}

const styles = StyleSheet.create({
  regular: {
    fontFamily: 'OpenSans',
  },
  light: {
    fontFamily: 'OpenSans-Light',
  },
  bold: {
    fontFamily: 'OpenSans-Bold',
  },
});
