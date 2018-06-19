import React from 'react';
import {
  ActivityIndicator,
  Image,
  InteractionManager,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import FadeIn from 'react-native-fade-in-image';
import ReadMore from '@expo/react-native-read-more-text';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import { MapView } from 'expo';
import { openImageGallery } from '@expo/react-native-image-gallery';
import { MaterialIcons } from '@expo/vector-icons';

import Actions from '../state/Actions';
import { RegularText, BoldText } from './StyledText';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';

export class DescriptionCard extends React.Component {
  render() {
    let { text } = this.props;

    return (
      <View>
        <View style={styles.cardLabel}>
          <BoldText style={styles.cardLabelText}>Description</BoldText>
        </View>

        <View style={styles.card}>
          <View style={styles.cardBody}>
            <ReadMore
              numberOfLines={6}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}>
              <RegularText style={styles.cardText}>{text}</RegularText>
            </ReadMore>
          </View>
        </View>
      </View>
    );
  }

  _renderTruncatedFooter = handlePress => {
    return (
      <RegularText
        style={{ color: Colors.tintColor, marginTop: 5 }}
        onPress={handlePress}>
        Read more
      </RegularText>
    );
  };

  _renderRevealedFooter = handlePress => {
    return (
      <RegularText
        style={{ color: Colors.tintColor, marginTop: 5 }}
        onPress={handlePress}>
        Show less
      </RegularText>
    );
  };
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
          <RegularText style={styles.cardText}>{text}</RegularText>
        </View>
      </View>
    );
  }
}

export class InstagramPhotosCard extends React.Component {
  state = {
    images: null,
  };

  async componentDidMount() {
    this._isMounted = true;
    let { profile } = this.props;

    if (profile) {
      let response = await fetch(
        `https://www.instagram.com/${profile}/?__a=1`,
        {
          headers: {
            cookie: `mid=WtUR_QAEAAGk4IdXwVdyhx86qXMD; shbid=15618; rur=ATN; mid=WtUR_QAEAAGk4IdXwVdyhx86qXMD; mcd=3; csrftoken=vJGh3M3ksyFMUJOt7thF2dlpNV1ZCvwc; ds_user_id=8042417612; sessionid=IGSC57ebeb5264850321dccd4812afe32129482e5ea9126fa8260003669ddfaad00a%3Am3jtAJXI3zrVLCLl5clHO5MwH6ssGbiD%3A%7B%22_auth_user_id%22%3A8042417612%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22_auth_user_hash%22%3A%22%22%2C%22_platform%22%3A4%2C%22_token_ver%22%3A2%2C%22_token%22%3A%228042417612%3AOcbgzFBPHOTsOkFyFETE0wx3oWXmFQ9L%3Acc007a13b2ac729b74365171ef6b69fff4dfa80247a1d96d765f43950d983248%22%2C%22last_refreshed%22%3A1529366705.2587640285%7D; urlgen="{\"time\": 1529299650}:1fV48z:8PlseiTQXSvCQ0arLxQpAgs2VEw`,
          },
        }
      );
      let data = await response.json();
      let user = data.graphql.user;
      let nodes = user.edge_owner_to_timeline_media.edges;
      if (this._isMounted) {
        let images = nodes.map(({ node }) => ({
          imageUrl: node.display_url,
          width: node.dimensions.width,
          height: node.dimensions.height,
          description:
            node.edge_media_to_caption.edges &&
            node.edge_media_to_caption.edges[0].node.text,
        }));
        this.setState({ images: images.slice(0, 6) });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
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
      return (
        <View style={[styles.card, styles.imageLoadingContainer]}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((image, i) => (
            <InstagramPhoto key={i} item={image} list={images} />
          ))}
        </ScrollView>
      </View>
    );
  }
}

class InstagramPhoto extends React.Component {
  render() {
    let { item } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this._handlePress}>
        <View>
          <FadeIn>
            <Image
              ref={view => {
                this._view = view;
              }}
              source={{ uri: item.imageUrl }}
              resizeMode="cover"
              style={styles.instagramImage}
            />
          </FadeIn>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _handlePress = () => {
    let { item, list } = this.props;

    this._view.measure((rx, ry, w, h, x, y) => {
      openImageGallery({
        animationMeasurements: { w, h, x, y },
        list,
        item,
      });
    });
  };
}

export class MapCard extends React.Component {
  state = {
    shouldRenderMap: false,
    shouldRenderOverlay: true,
  };

  componentDidMount() {
    this._isMounted = true;

    InteractionManager.runAfterInteractions(() => {
      this._isMounted && this.setState({ shouldRenderMap: true });
      setTimeout(() => {
        this._isMounted && this.setState({ shouldRenderOverlay: false });
      }, 700);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let { address, city, postalCode, name } = this.props.brewery;

    return (
      <View style={[styles.card, styles.mapContainer]}>
        {this._maybeRenderMap()}
        {this._maybeRenderOverlay()}
        <TouchableNativeFeedback onPress={this.props.onPress}>
          <View style={styles.cardAction}>
            <View style={styles.cardActionLabel}>
              <RegularText style={styles.cardActionText}>
                {address}, {postalCode}
              </RegularText>

              <RegularText style={styles.cardActionSubtitleText}>
                {city}
              </RegularText>
            </View>

            <MaterialIcons name="chevron-right" size={30} color="#b8c3c9" />
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }

  _maybeRenderOverlay() {
    if (!this.state.shouldRenderOverlay) {
      return;
    }

    if (this.state.shouldRenderMap) {
      return (
        <View
          style={[
            styles.map,
            {
              backgroundColor: '#f9f5ed',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            },
          ]}
        />
      );
    } else {
      return <View style={[styles.map, { backgroundColor: '#f9f5ed' }]} />;
    }
  }

  _maybeRenderMap() {
    if (!this.state.shouldRenderMap) {
      return;
    }

    let { name, latitude, longitude } = this.props.brewery;

    return (
      <MapView
        cacheEnabled={Platform.OS === 'android'}
        style={styles.map}
        loadingBackgroundColor="#f9f5ed"
        loadingEnabled={false}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}>
        <MapView.Marker coordinate={{ latitude, longitude }} title={name} />
      </MapView>
    );
  }
}

@connect((data, props) => VisitedCard.getDataProps(data, props))
export class VisitedCard extends React.Component {
  static getDataProps(data, props) {
    let { breweryId } = props;
    let isVisited = data.breweries.visited.includes(breweryId);

    return {
      isVisited,
    };
  }

  _onToggleVisited = () => {
    if (this.props.isVisited) {
      this.props.dispatch(Actions.removeVisitedBrewery(this.props.breweryId));
    } else {
      this.props.dispatch(Actions.addVisitedBrewery(this.props.breweryId));
    }
  };

  render() {
    let { isVisited } = this.props;

    return (
      <View style={{ marginTop: 15 }}>
        <View style={styles.card}>
          <TouchableNativeFeedback
            onPress={this._onToggleVisited}
            fallback={TouchableHighlight}
            underlayColor="#eee">
            <View style={[styles.cardBody, styles.visitedCardBody]}>
              <View style={{ flex: 1 }}>
                <RegularText
                  style={[
                    styles.visitedCardText,
                    { opacity: isVisited ? 1 : 0.7 },
                  ]}>
                  {isVisited
                    ? "You've been here"
                    : 'You still need to check this one out'}
                </RegularText>
              </View>

              <MaterialIcons
                name={isVisited ? 'check-box' : 'check-box-outline-blank'}
                size={25}
                style={{ opacity: isVisited ? 1 : 0.5 }}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    );
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
    marginTop: 20,
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
  imageLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 125,
    marginVertical: 10,
  },
  instagramImage: {
    width: 125,
    height: 125,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  summaryContainer: {
    marginTop: 15,
  },
  visitedCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 9,
  },
  visitedCardText: {
    color: '#888',
    marginLeft: 5,
    marginBottom: 1,
  },
});
