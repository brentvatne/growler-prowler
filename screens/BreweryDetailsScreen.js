import React from 'react';
import {
  connect,
} from 'react-redux';

import Actions from '../state/Actions';
import BreweryDetails from '../components/BreweryDetails';

@connect((data, props) => BreweryDetailsScreen.getDataProps(data, props))
export default class BreweryDetailsScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    }
  }

  static getDataProps(data, props) {
    let breweryId = props.navigation.state.params.breweryId;
    let brewery = data.breweries.all.find(brewery => brewery.id === breweryId);

    return {
      brewery,
    };
  }

  render() {
    return (
      <BreweryDetails
        brewery={this.props.brewery}
        isVisited={this.props.isVisited}
        onToggleVisited={this._onToggleVisited}
      />
    );
  }
}
