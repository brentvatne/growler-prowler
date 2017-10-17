import { Dimensions, Platform } from 'react-native';
import { Constants } from 'expo';
import { Header } from 'react-navigation';

export default {
  window: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  HEADER_HEIGHT:
    Platform.OS === 'android'
      ? Header.HEIGHT + Constants.statusBarHeight
      : Header.HEIGHT,
};
