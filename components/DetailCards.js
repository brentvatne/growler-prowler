import React from 'react';
import {
  Image,
  InteractionManager,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  MaterialIcons,
} from '@exponent/vector-icons';
import ReadMore from '@exponent/react-native-read-more';
import {
  Components,
} from 'exponent';
const { MapView } = Components;

import {
  RegularText,
  BoldText,
} from './StyledText';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';

export class DescriptionCard extends React.Component {
  render() {
    let { text } = this.props;

    return (
      <View>
        <View style={styles.cardLabel}>
          <BoldText style={styles.cardLabelText}>
            Description
          </BoldText>
        </View>

        <View style={styles.card}>
          <View style={styles.cardBody}>
            <ReadMore
              numberOfLines={3}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}>
              <RegularText style={styles.cardText}>
                {text}
              </RegularText>
            </ReadMore>
          </View>
        </View>
      </View>
    );
  }

  _renderTruncatedFooter = (handlePress) => {
    return (
      <RegularText style={{color: Colors.tintColor, marginTop: 5}} onPress={handlePress}>
        Read more
      </RegularText>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <RegularText style={{color: Colors.tintColor, marginTop: 5}} onPress={handlePress}>
        Show less
      </RegularText>
    );
  }
}

export class SummaryCard extends React.Component {
  render() {
    let { text } = this.props;

    if (!text) {
      return <View />;
    }

    return (
      <View style={[styles.card, styles.summaryContainer]}>
        <View style={styles.cardBody}>
          <RegularText style={styles.cardText}>
            {text}
          </RegularText>
        </View>
      </View>
    );
  }
}

export class InstagramPhotosCard extends React.Component {
  state = {
    images: [],
  }

  async componentWillMount() {
    let { profile } = this.props;

    if (profile) {
      let response = await fetch(`https://www.instagram.com/${profile}/media/`);
      let data = await response.json();
      let images = data.items.map(item => item.images.standard_resolution);
      this.setState({images});
    }
  }

  render() {
    return (
      <View>
        <View style={styles.cardLabel} collapsible={false}>
          <BoldText style={styles.cardLabelText}>
            Photos from Instagram
          </BoldText>
        </View>
        {this._renderInstagramPhotos()}
      </View>
    );
  }

  _renderInstagramPhotos() {
    let { images } = this.state;

    if (!images) {
      return;
    }

    return (
      <View style={styles.card}>
        <View style={[styles.cardBody, styles.imageContainer]}>
          {
            images.slice(0, 6).map(image => (
              <Image
                key={image.url}
                source={{uri: image.url}}
                style={{width: 100, height: 100, marginVertical: 5, borderRadius: 3}}
              />
          ))}
        </View>
      </View>
    );
  }
}

export class MapCard extends React.Component {
  state = {
    shouldRenderMap: false,
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({shouldRenderMap: true});
    });
  }

  render() {
    let {
      address,
      city,
      postalCode,
      name,
    } = this.props.brewery;

    return (
      <View style={[styles.card, styles.mapContainer]}>
        {this._maybeRenderMap()}
        <TouchableOpacity style={styles.cardAction}>
          <View style={styles.cardActionLabel}>
            <RegularText style={styles.cardActionText}>
              {address}, {postalCode}
            </RegularText>

            <RegularText style={styles.cardActionSubtitleText}>
              {city}
            </RegularText>
          </View>

          <MaterialIcons name="chevron-right" size={30} color="#b8c3c9" />
        </TouchableOpacity>
      </View>
    );
  }

  _maybeRenderMap = () => {
    if (this.state.shouldRenderMap) {
      let {
        name,
        latitude,
        longitude,
      } = this.props.brewery;

      return (
        <MapView
          cacheEnabled={Platform.OS === 'android'}
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }}>
          <MapView.Marker
            coordinate={{latitude, longitude}}
            title={name}
          />
        </MapView>
      );
    } else {
      return (
        <View style={[styles.map, {backgroundColor: '#f9f5ed'}]} />
      );
    }
  }
}

const styles = StyleSheet.create({
  map: {
    height: 150,
    width: Layout.window.width,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8E8E8',
    backgroundColor: '#fff',
  },
  cardBody: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  cardLabel: {
    marginTop: 25,
    paddingLeft: 8,
    paddingBottom: 5,
  },
  cardLabelText: {
    fontSize: 15,
    color: '#313131',
  },
  cardAction: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardActionLabel: {
    flex: 1,
    paddingHorizontal: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#424242',
  },
  cardActionText: {
    fontSize: 13,
    color: '#424242',
  },
  cardActionSubtitleText: {
    fontSize: 12,
    marginTop: -1,
    color: '#9E9E9E',
  },
  mapContainer: {
    marginTop: 15,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  summaryContainer: {
    marginTop: 15,
  },
});
