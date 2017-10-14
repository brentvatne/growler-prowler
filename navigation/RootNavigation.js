import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import { capitalize } from 'lodash';

import AuthenticationScreen from '../screens/AuthenticationScreen';
import BreweryDetailsScreen from '../screens/BreweryDetailsScreen';
import BreweryListScreen from '../screens/BreweryListScreen';
import BreweryMapScreen from '../screens/BreweryMapScreen';
import Colors from '../constants/Colors';
import SettingsScreen from '../screens/SettingsScreen';

const ListStack = StackNavigator(
  {
    list: {
      screen: BreweryListScreen,
    },
    details: {
      screen: BreweryDetailsScreen,
    },
  },
  {
    headerMode: 'none',
    cardStyle: {
      backgroundColor: '#fff',
    },
  }
);

const SettingsStack = StackNavigator(
  {
    mainSettings: {
      screen: SettingsScreen,
    },
  },
  {
    navigationOptions: {
      title: 'Settings',
      headerStyle: {
        backgroundColor: '#fff',
      },
    },
  }
);

const TabLayout = TabNavigator(
  {
    list: {
      screen: ListStack,
    },
    map: {
      screen: BreweryMapScreen,
    },
    settings: {
      screen: SettingsStack,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: () => {
        const { routeName } = navigation.state;
        let label = capitalize(routeName);
        if (label === 'List') {
          return 'Brewery List';
        } else {
          return label;
        }
      },
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'list':
            iconName = Platform.OS === 'ios' ? 'ios-list' : 'md-list';
            break;
          case 'map':
            iconName = Platform.OS === 'ios' ? 'ios-map-outline' : 'md-map';
            break;
          case 'settings':
            iconName =
              Platform.OS === 'ios' ? 'ios-options-outline' : 'md-options';
        }
        return (
          <Ionicons
            name={iconName}
            size={30}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: Colors.tabIconSelected,
      inactiveTintColor: Colors.tabIconDefault,
    },
    animationEnabled: false,
    swipeEnabled: false,
  }
);

export default StackNavigator(
  {
    tabs: {
      screen: TabLayout,
    },
  },
  {
    headerMode: 'none',
    cardStyle: {
      backgroundColor: '#fff',
    },
  }
);
