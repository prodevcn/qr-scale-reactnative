import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustomTabBar from './tab-view-custom-tab-bar';

function TabView({onAddPress, longPress, ...otherProps}) {
  return (
    <ScrollableTabView
      renderTabBar={(barProps) => (
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            <CustomTabBar
              {...barProps}
              style={styles.tabBar}
              tabStyle={styles.tab}
              textStyle={{fontWeight: 'normal', fontSize: 18}}
              itemOnLongPress={longPress}
            />
          </View>
          <Icon
            name="plus"
            size={20}
            color="#fff5"
            style={[styles.icon, styles.iconRight]}
            onPress={onAddPress}
          />
        </View>
      )}
      tabBarUnderlineStyle={styles.underlineStyle}
      tabBarBackgroundColor="#222"
      tabBarActiveTextColor="#fff"
      tabBarInactiveTextColor="#fff9"
      {...otherProps}
    />
  );
}

TabView.propTypes = {
  onAddPress: PropTypes.func.isRequired,
  longPress: PropTypes.func.isRequired,
};

export default TabView;

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#fff9',
  },
  tabBar: {
    flex: 1,
    borderWidth: 0,
    height: 50,
  },
  tab: {
    height: 50,
    paddingLeft: 20,
    paddingRight: 20,
  },
  underlineStyle: {
    backgroundColor: '#fff',
    height: 1,
  },
  icon: {
    flex: 0,
    lineHeight: 45,
    paddingHorizontal: 15,
    paddingTop: 2,
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
});
