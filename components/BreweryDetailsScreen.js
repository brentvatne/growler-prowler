import React from 'react';
import {
  connect,
} from 'react-redux';

import BreweryDetails from './BreweryDetails';

export default class BreweryDetailsScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    }
  }

  render() {
    return <BreweryDetails brewery={this.props.route.params.brewery} />
  }
}
