import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import BreweryListItem from './BreweryListItem';

function breweriesFromIds(all, ids) {
  return ids.map(id => all.find(brewery => brewery.id === id));
}

@withNavigation
@connect((data, props) => BreweryList.getDataProps(data, props))
export default class BreweryList extends React.Component {
  static getDataProps(data, props) {
    let { breweries } = data;
    let { all, nearby, visited } = breweries;

    if (props.nearby) {
      breweries = breweriesFromIds(all, nearby);
    } else if (props.visited) {
      breweries = breweriesFromIds(all, visited);
    } else if (props.notVisited) {
      let allBreweryIds = all.map(brewery => brewery.id);
      let notVisited = allBreweryIds.filter(id => !visited.includes(id));
      breweries = breweriesFromIds(all, notVisited);
    } else {
      breweries = all;
    }

    return {
      breweries,
    };
  }

  state = {
    renderContents: false,
  };

  componentDidMount() {
    this.props.setRef && this.props.setRef(this);
    requestAnimationFrame(() => {
      this.setState({ renderContents: true });
    });
  }

  componentDidUpdate() {
    this.props.setRef && this.props.setRef(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.breweries !== this.props.breweries ||
      nextState.renderContents !== this.state.renderContents
    );
  }

  scrollTo(opts) {
    this._scrollView._component.scrollTo(opts);
  }

  render() {
    return (
      <View onLayout={this.props.onLayout} style={styles.container}>
        <Animated.ScrollView
          ref={view => {
            this._scrollView = view;
          }}
          contentContainerStyle={this.props.contentContainerStyle}
          style={styles.container}
          onScroll={this.props.onScroll}
          onResponderRelease={this.props.onMomentumScrollEnd}
          onResponderTerminate={this.props.onMomentumScrollEnd}
          onMomentumScrollBegin={this.props.onMomentumScrollBegin}
          onMomentumScrollEnd={this.props.onMomentumScrollEnd}
          onScrollBeginDrag={this.props.onScrollBeginDrag}
          onScrollEndDrag={this.props.onScrollEndDrag}
          onContentSizeChange={this.props.onContentSizeChange}
          scrollEventThrottle={16}>
          {this._renderContents()}

          <StatusBar barStyle="default" />
        </Animated.ScrollView>
      </View>
    );
  }

  _renderContents() {
    // This is useful to show *something* while blocking the JS thread to render all list items
    // Better to just make this ListView at some point
    if (!this.state.renderContents) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: 75,
          }}>
          <ActivityIndicator />
        </View>
      );
    }

    return this.props.breweries.map(brewery => (
      <BreweryListItem
        onPress={() => this._handlePressBrewery(brewery)}
        brewery={brewery}
        key={brewery.name}
      />
    ));
  }

  _handlePressBrewery = brewery => {
    this.props.navigation.navigate('details', { breweryId: brewery.id });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
});
