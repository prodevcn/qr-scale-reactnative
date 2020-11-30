import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import LoginView from '../components/login-view';

export default class Login extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  loggedId = () => {
    // console.log('I will go over the Init');
    this.props.navigation.navigate('Init');
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#333" barStyle="light-content" />
        <LoginView
          navigation={this.props.navigation}
          onLoggedIn={this.loggedId}
        />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
