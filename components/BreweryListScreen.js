import React from 'react';
import BreweryList from './BreweryList';

export default class BreweryListScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Breweries',
    }
  }

  render() {
    return <BreweryList navigator={this.props.navigator} />
  }
}
