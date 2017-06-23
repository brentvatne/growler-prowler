import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  StackNavigation,
  TabNavigation,
  TabNavigationItem,
} from '@expo/ex-navigation';
import { MaterialIcons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import Router from './Router';

const defaultRouteConfig = {
  navigationBar: {
    titleStyle: {fontFamily: 'OpenSans-Bold'},
    backgroundColor: '#fff',
  },
};

export default class TabNavigationLayout extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    }
  }

  render() {
    return (
      <TabNavigation
        tabBarColor={Colors.tabBar}
        tabBarHeight={48}
        initialTab="list">

        <TabNavigationItem
          id="list"
          renderIcon={isSelected => this._renderIcon('view-list', isSelected)}>
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('list')}
          />
        </TabNavigationItem>

        <TabNavigationItem
          id="map"
          renderIcon={isSelected => this._renderIcon('map', isSelected)}>
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('map')}
          />
        </TabNavigationItem>

        <TabNavigationItem
          id="settings"
          renderIcon={isSelected => this._renderIcon('settings', isSelected)}>
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute={Router.getRoute('settings')}
          />
        </TabNavigationItem>
      </TabNavigation>
    );
  }

  _renderIcon(iconName, isSelected) {
    let color = isSelected ? Colors.tabIconSelected : Colors.tabIconDefault;

    return (
      <View style={styles.tabItemContainer}>
        <MaterialIcons name={iconName} size={32} color={color} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
