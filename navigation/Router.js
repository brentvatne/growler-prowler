import {
  createRouter,
} from '@exponent/ex-navigation';

import AuthenticationScreen from '../screens/AuthenticationScreen';
import BreweryDetailsScreen from '../screens/BreweryDetailsScreen';
import BreweryListScreen from '../screens/BreweryListScreen';
import BreweryMapScreen from '../screens/BreweryMapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TabNavigationLayout from './TabNavigationLayout';

export default createRouter(() => ({
  authentication: () => AuthenticationScreen,
  details: () => BreweryDetailsScreen,
  list: () => BreweryListScreen,
  map: () => BreweryMapScreen,
  settings: () => SettingsScreen,
  tabNavigation: () => TabNavigationLayout,
}), {
  ignoreSerializableWarnings: true,
});
