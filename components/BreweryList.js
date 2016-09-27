import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from '@exponent/ex-navigation';

import BreweryListItem from './BreweryListItem';

@withNavigation
@connect((data, props) => BreweryList.getDataProps(data, props))
export default class BreweryList extends React.Component {
  static getDataProps(data, props) {
    let breweries;

    if (props.nearby) {
      breweries = data.nearbyBreweries;
    } else {
      breweries = data.breweries;
    }

    return {
      breweries,
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.breweries !== this.props.breweries;
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {
          this.props.breweries.map(brewery => (
            <BreweryListItem
              onPress={() => this._handlePressBrewery(brewery)}
              brewery={brewery}
              key={brewery.name}
            />
          ))
        }

        <StatusBar barStyle="default" />
      </ScrollView>
    );
  }

  _handlePressBrewery = (brewery) => {
    this.props.navigator.push('details', {brewery});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
});
