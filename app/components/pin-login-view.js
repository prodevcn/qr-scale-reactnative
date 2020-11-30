import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  // Alert,
  // AsyncStorage,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';

import PageIndicator from '../components/page-indicator';
import VirtualKeyPad from '../components/virtual-key-pad';

import Actions from '../actions/auth';
import {fetchHome} from '../actions/common';
import {AppDialog$} from './app-dialog';

class PinLoginView extends React.PureComponent {
  state = {
    pinCode: '',
    loggingIn: false,
  };

  async login() {
    const ip = await DeviceInfo.getIPAddress();
    const version = DeviceInfo.getSystemVersion();
    const {pinCode} = this.state;
    let session = {
      accessToken: '',
      localIpAddress: ip,
      operatingSystem: Platform.OS + ' ' + version,
      browserInfo: Platform.OS + ' ' + version,
    };
    this.setState({loggingIn: true}, () => {
      Actions.loginWithPinCode(pinCode, session)
        .then((data) => {
          if (data.succeeded) {
            AsyncStorage.setItem('accessToken', data.result).then(() => {
              this.props.fetchHome().then(() => {
                AsyncStorage.setItem('userId', this.props.home.user.id).then(
                  this.props.onLoggedIn,
                );
              });
            });
          } else {
            this.openErrorAlert();
            this.setState({pinCode: '', loggingIn: false});
          }
        })
        .catch(() => {
          this.setState({pinCode: '', loggingIn: false});
        });
    });
  }

  openErrorAlert = () => {
    const {strings} = this.props;
    // console.log(strings);
    AppDialog$.next({
      type: 'error',
      title: strings
        ? strings.MobileUI['PinLoginView.Alert.Title'] || 'Locale Error'
        : 'Error',
      content: strings
        ? strings.MobileUI['PinLoginView.Alert.Body'] || 'Locale Error'
        : 'Wrong login code!',
      expiredTime: 10 * 1000,
      status: true,
    });
  };

  onKeyPadPress = (char) => {
    let pinCode = this.state.pinCode;

    if (char === 'backspace') {
      pinCode = pinCode.slice(0, -1);
    } else if (pinCode.length < 4) {
      pinCode += char;
    }

    this.setState({pinCode}, () => {
      if (pinCode.length === 4) {
        this.login();
      }
    });
  };

  render() {
    const {loggingIn, pinCode} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <TextInput
            value={pinCode}
            editable={false}
            secureTextEntry={true}
            style={styles.input}
          />
          <VirtualKeyPad
            disabled={loggingIn}
            disableKeys={pinCode.length >= 4}
            disableBackspace={!pinCode.length}
            onKeyPress={this.onKeyPadPress}
          />
        </View>

        {loggingIn ? <PageIndicator overlay /> : null}
      </SafeAreaView>
    );
  }
}

PinLoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => {
  const {home} = store.common;
  const {strings} = store.locale;

  return {home, strings};
};

export default connect(mapStateToProps, {
  fetchHome,
})(PinLoginView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    color: '#fff',
    width: 100,
    textAlign: 'center',
    marginBottom: 10,
  },
  textContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    borderRadius: 50,
  },
});
