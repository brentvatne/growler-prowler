import {
  createRouter,
} from '@exponent/ex-navigation';

import AuthenticationScreen from '../components/AuthenticationScreen';
import BreweryDetailsScreen from '../components/BreweryDetailsScreen';
import BreweryListScreen from '../components/BreweryListScreen';

export default createRouter(() => ({
  list: () => BreweryListScreen,
  details: () => BreweryDetailsScreen,
  authentication: () => AuthenticationScreen,
}));
