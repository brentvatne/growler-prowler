import React from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from '@exponent/ex-navigation';

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
    }
  }

  componentDidMount() {
    this.props.setRef && this.props.setRef(this);
  }

  componentDidUpdate() {
    this.props.setRef && this.props.setRef(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.breweries !== this.props.breweries;
  }

  scrollTo(opts) {
    this._scrollView._component.scrollTo(opts);
  }

  render() {
    return (
      <View onLayout={this.props.onLayout} style={styles.container}>
        <Animated.ScrollView
          ref={view => { this._scrollView = view; }}
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
          {
            this.props.breweries.map(brewery => (
              <BreweryListItem
                onPress={() => this._handlePressBrewery(brewery) }
                brewery={brewery}
                key={brewery.name}
              />
            ))
          }

          <StatusBar barStyle="default" />
        </Animated.ScrollView>
      </View>
    );
  }

  _handlePressBrewery = (brewery) => {
    this.props.navigator.push('details', {breweryId: brewery.id});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
});
