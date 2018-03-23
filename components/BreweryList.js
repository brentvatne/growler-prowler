import React from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
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
    this._isMounted = true;
    this.props.setRef && this.props.setRef(this);
    setTimeout(() => {
      this._isMounted && this.setState({ renderContents: true });
    }, 100);
  }

  componentWillUnmount() {
    this._isMounted = false;
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
        {this.state.renderContents ? (
          <FlatList
            ref={view => {
              this._scrollView = view;
            }}
            contentContainerStyle={this.props.contentContainerStyle}
            renderItem={this._renderItem}
            style={styles.container}
            data={this.props.breweries.toJS()}
            keyExtractor={item => item.name}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              height: 75,
            }}>
            <ActivityIndicator />
          </View>
        )}

        <StatusBar barStyle="default" />
      </View>
    );
  }

  _renderItem = ({ item }) => {
    return (
      <BreweryListItem
        onPress={() => this._handlePressBrewery(item)}
        brewery={item}
      />
    );
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
