/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {SafeAreaView, StyleSheet} from 'react-native';
import {getTheme, ThemeContext} from 'react-native-material-ui';
import {Routes} from './app/routes';
import store from './app/store';
import LandscapeIosFixer from './app/utilities/landscape-ios-fixer';
import DarkTheme from './app/themes/dark';
import AppDialog from './app/components/app-dialog';
import ScreenLocker from './app/components/screen-locker';
LandscapeIosFixer();
type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Provider store={store}>
        <SafeAreaView style={styles.container}>
          <ScreenLocker rootNavigation={this.rootNavigation}>
            <ThemeContext.Provider value={getTheme(DarkTheme)}>
              <Routes ref={(ref) => (this.rootNavigation = ref)} />
              <AppDialog />
            </ThemeContext.Provider>
          </ScreenLocker>
        </SafeAreaView>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
});
