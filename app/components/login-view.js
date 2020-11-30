import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {View, StyleSheet, SafeAreaView} from 'react-native';
// import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PageIndicator from '../components/page-indicator';
import {TextField} from 'react-native-material-textfield';

import Actions from '../actions/auth';
import IndicatorButton from './indicator-button';
import {AppDialog$} from './app-dialog';
import {PRODUCTION_URL, STAGING_URL} from '../constants/apis';
import DoubleTap from './touchable-opacity-custom';
import {getEnvironmentUrl} from '../utilities';

//When compiling to production environment, you have to set devMode = false !!
const devMode = true;
const username = 'donny@demo.com';
const password = '!Test123';
// const username = 'jim@ffsnxg.com';
// const password = '#$hB0kz$G6';

class LoginView extends React.PureComponent {
  state = {
    username: devMode ? username : '',
    password: devMode ? password : '',
    loggingIn: false,
    focus: false,
  };

  constructor(props) {
    super(props);
    // console.log('sdfsdfsdf', props);
    this.changeServer = this.changeServer.bind(this);
  }

  login = () => {
    this.setState({loggingIn: true});
    Actions.login({
      username: this.state.username,
      password: this.state.password,
    })
      .then((data) => {
        // console.log('++++++======+++++++', data);
        if (data && data.access_token) {
          console.log('++++++======+++++++', data.access_token);
          AsyncStorage.setItem('accessToken', data.access_token).then(() => {
            console.log('ba+++++++++++++++');
            this.props.onLoggedIn();
          });
        } else {
          this.openErrorAlert();
        }
      })
      .catch(() => {
        this.openErrorAlert();
        this.setState({loggingIn: false});
      })
      .then(() => this.setState({loggingIn: false}));
  };

  openErrorAlert = () => {
    const {strings} = this.props;
    AppDialog$.next({
      type: 'error',
      title: strings
        ? strings.MobileUI['LoginView.Alert.Title'] || 'LoginView.Alert.Title'
        : 'Error',
      content: strings
        ? strings.MobileUI['LoginView.Alert.Body'] || 'LoginView.Alert.Body'
        : 'Wrong login code!',
      expiredTime: 10 * 1000,
      status: true,
    });
  };

  async changeServer() {
    const environmentUrl = await getEnvironmentUrl();
    await AsyncStorage.setItem(
      'environmentUrl',
      environmentUrl === STAGING_URL ? PRODUCTION_URL : STAGING_URL,
    );
    console.log('running changeServer() ..... ');
    await AsyncStorage.removeItem('accessToken');
    AppDialog$.next({
      type: 'info',
      title: 'change server',
      content: `connect to ${
        environmentUrl === STAGING_URL ? 'production' : 'staging'
      }`,
      expiredTime: 10 * 1000,
      status: true,
    });
    this.props.navigation.navigate('Login');
  }

  render() {
    const {strings} = this.props;
    const {loggingIn, username, password} = this.state;
    const loginDisable = !(username.length && password.length);
    // console.log(this.state.strings);

    return (
      <SafeAreaView style={styles.container}>
        <DoubleTap
          doubleTap={this.changeServer}
          delay={300}
          style={styles.changeServer}
        />
        <View
          style={[styles.card, this.state.focus ? styles.cardAbsolute : null]}>
          <TextField
            label={
              strings
                ? strings.MobileUI['LoginView.Fields.UserName'] ||
                  'Locale Error'
                : 'User Name'
            }
            value={username}
            textColor="#fff"
            tintColor="#fffa"
            baseColor="#fff9"
            autoCapitalize="none"
            autoFocus
            onFocus={() => {
              this.setState({
                focus: true,
              });
            }}
            onBlur={() => {
              this.setState({
                focus: false,
              });
            }}
            onChangeText={(username) => this.setState({username})}
          />
          <TextField
            label={
              strings
                ? strings.MobileUI['LoginView.Fields.Password'] ||
                  'Locale Error'
                : 'Password'
            }
            value={password}
            textColor="#fff"
            tintColor="#fffa"
            baseColor="#fff9"
            autoCapitalize="none"
            secureTextEntry={true}
            clearTextOnFocus={true}
            onFocus={() => {
              this.setState({
                focus: true,
              });
            }}
            onBlur={() => {
              this.setState({
                focus: false,
              });
            }}
            onChangeText={(password) => this.setState({password})}
          />
          <IndicatorButton
            white
            raised
            primary
            text={
              strings
                ? strings.MobileUI['LoginView.Buttons.Login'] || 'Locale Error'
                : 'Login'
            }
            disabled={loginDisable}
            style={{marginVertical: 16, opacity: loginDisable ? 0.5 : 1}}
            onPress={this.login}
          />
        </View>
        {loggingIn ? <PageIndicator overlay backgroundColor="#0005" /> : null}
      </SafeAreaView>
    );
  }
}

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
  navigation: PropTypes.any,
};

export default connect(({locale: {strings}}) => ({strings}))(LoginView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    // color: '#fff',
    // width: 100
  },
  inputText: {
    // color: '#fff'
  },
  inputContainerStyle: {
    // backgroundColor: '#f00'
  },
  textContainer: {
    // paddingHorizontal: 16,
    // paddingBottom: 16
  },
  card: {
    width: '35%',
    // borderRadius: 50
  },
  cardAbsolute: {
    position: 'absolute',
    top: 0,
  },
  changeServer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: 50,
  },
});
