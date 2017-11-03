import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import ImageGallery from '@expo/react-native-image-gallery';
import { MaterialIcons } from '@expo/vector-icons';
import { RegularText } from './StyledText';

export default class ImageGalleryPortal extends React.Component {
  render() {
    return (
      <ImageGallery
        renderHeaderRight={(onPress) => (
          <TouchableNativeFeedback onPress={onPress} hitSlop={{top: 20, right: 20, left: 20 }}>
            <MaterialIcons name="close" size={20} color="rgba(0,0,0,0.9)" />
          </TouchableNativeFeedback>
        )}
        renderDescription={(description) => (
          <View style={styles.descriptionContainer}>
            <ScrollView
              bounces={false}
              alwaysBounceVertical={false}
              style={styles.descriptionScrollView}
              contentContainerStyle={styles.descriptionContentContainer}>
              <RegularText style={{color: 'rgba(0,0,0,0.9)'}}>
                {description}
              </RegularText>
            </ScrollView>
          </View>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  descriptionContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  descriptionScrollView: {
    flex: 1,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b2b2b2',
  },
  descriptionContentContainer: {
    backgroundColor: '#fff',
    padding: 15,
  },
});
