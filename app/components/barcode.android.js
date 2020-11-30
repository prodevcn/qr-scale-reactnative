import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Image, StyleSheet, Text, View} from 'react-native';

import GetByBarcodeActions from '../actions/scan-solution/get-by-barcode';
import PageIndicator from './page-indicator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IndicatorButton from './indicator-button';
import BarcodeTextAnimate from './barcode-text-animate';
import {AppDialog$} from './app-dialog';
import BarcodeScanner from './barcode-scanner';
import KeyEvent from 'react-native-keyevent';

class Barcode extends React.PureComponent {
  state = {
    validating: false,
    cameraStatus: false,
    animateTextStatus: false,
    error: null,
    oldScanTo: '',
  };
  barcode = '';
  barcodePlaceholder = '';

  mounted = true;

  setStateIfMounted = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  componentDidMount() {
    this.addEvents();
  }

  UNSAFE_componentWillUnmount() {
    this.mounted = false;
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.isFocused) {
      this.addEvents();
    } else {
      this.barcode = '';
    }
  }
  // static getDerivedStateFromProps(props, state) {
  //   if (props.isFocused) {
  //     this.addEvents();
  //   } else {
  //     this.barcode = '';
  //   }
  // }

  addEvents() {
    // if you want to react to keyDown
    // KeyEvent.onKeyDownListener((keyEvent) => {
    //   console.log('keydown', keyEvent);
    // });

    // if you want to react to keyUp
    KeyEvent.onKeyUpListener((keyEvent) => {
      if (keyEvent.keyCode === 66) {
        this.barcode = this.barcodePlaceholder;
        this.barcodePlaceholder = '';
        this.inputTextChanged();
      } else {
        if (keyEvent.keyCode !== 59) {
          this.barcodePlaceholder += keyEvent.pressedKey;
        }
      }
    });

    // if you want to react to keyMultiple
    KeyEvent.onKeyMultipleListener((keyEvent) => {
      alert('key multiple', keyEvent);
    });
  }

  inputTextChanged = () => {
    this.setStateIfMounted(
      {animateTextStatus: false, oldScanTo: this.props.scanTo},
      () => {
        this.submitScan();
      },
    );
  };

  submitScan = () => {
    this.validateScan()
      .then((result) => {
        this.props.onScan(this.barcode, result);
      })
      .catch((error) => {
        return error || true;
      })
      .then((error) => {
        const state = {validating: false, error: error || null};
        if (error || this.props.animateTextSuccess === true) {
          state.animateTextStatus = true;
        }
        this.setStateIfMounted(state, () => {
          if (error) {
            this.renderErrorModal();
          }
        });
      });
  };

  validateScan = () =>
    new Promise((resolve, reject) =>
      this.setStateIfMounted({validating: true}, () => {
        const {expected, expects} = this.props;
        if (expected) {
          if (expected === this.barcode) {
            resolve();
          } else {
            reject('NOT_EXPECTED');
          }
        } else if (expects) {
          if (expects.includes(this.barcode)) {
            resolve();
          } else {
            reject('NOT_IN_EXPECTS');
          }
        } else {
          this.findOnServer()
            .then((result) => {
              const {expectsResult, expectsResultKey: key = 'id'} = this.props;

              if (expectsResult) {
                if (result && expectsResult.includes(result[key])) {
                  resolve(result);
                } else {
                  reject('NOT_IN_EXPECTS');
                }
              } else {
                resolve(result);
              }
            })
            .catch((error) => reject(error));
        }
      }),
    );

  renderErrorModal() {
    const {strings} = this.props;
    AppDialog$.next({
      type: 'error',
      title:
        strings.MobileUI['Barcode.Alert.WrongBarcode.Title'] || 'Locale Error',
      content:
        strings.MobileUI[
          `Barcode.Alert.${this.state.error}.Body.${this.props.scanTo}`
        ] ||
        strings.MobileUI[`Barcode.Alert.${this.state.error}.Body`] ||
        strings.MobileUI[
          `Barcode.Alert.WrongBarcode.Body.${this.props.scanTo}`
        ] ||
        strings.MobileUI['Barcode.Alert.WrongBarcode.Body'] ||
        'Locale Error',
      expiredTime: 10 * 1000,
      status: true,
    });
  }

  findOnServer = () =>
    new Promise((resolve, reject) => {
      const {scanTo} = this.props;

      GetByBarcodeActions[scanTo](this.barcode)
        .then((data) => {
          if (data.succeeded && data.result) {
            resolve(data.result);
          } else {
            reject('NOT_FOUND');
          }
        })
        .catch((err) => reject(err));
    });

  onScanBarcodeWithCamera = (barcode) => {
    this.setState({cameraStatus: false});
    this.barcode = barcode;
    this.inputTextChanged();
  };

  renderText() {
    const {strings, scanTo, expectedLabel, message} = this.props;
    return (
      <View style={[styles.messageView]}>
        {this.state.oldScanTo === this.props.scanTo ? (
          <View style={[styles.barcodeTextWrapper]}>
            <Text style={[styles.barcodeText]}>{this.barcode}</Text>
          </View>
        ) : null}
        <BarcodeTextAnimate
          style={styles.messageText}
          animate={this.state.animateTextStatus}>
          <Text style={[{backgroundColor: 'transparent'}, styles[scanTo]]}>
            {message ||
              strings.MobileUI[`Barcode.Messages.${scanTo}`] ||
              'Locale Error'}
            {expectedLabel ? ':' : null}
          </Text>
        </BarcodeTextAnimate>
        {expectedLabel ? (
          <Text style={[styles.messageText, {color: '#fffa'}]}>
            "{expectedLabel}"
          </Text>
        ) : null}
      </View>
    );
  }

  render() {
    const {strings, right, smallImage} = this.props;
    const imageSize = smallImage ? 50 : 250;
    const imagePositionX = smallImage ? -20 : -100;
    const imagePositionY = smallImage ? -4 : -20;
    return (
      <View style={[styles.wrapView]}>
        {this.state.validating ? <PageIndicator /> : this.renderText()}
        <View
          style={[
            {
              position: 'absolute',
              bottom: imagePositionY,
              zIndex: -1,
            },
            right ? {right: imagePositionX} : {left: imagePositionX},
          ]}>
          <Image
            source={require('../../assets/images/barcode-scan-green.png')}
            style={[
              {
                width: imageSize,
                height: imageSize,
                opacity: 0.7,
              },
            ]}
          />
        </View>
        <IndicatorButton
          icon={
            <Icon name="camera" size={smallImage ? 35 : 50} color="#fffa" />
          }
          text=""
          onPress={() => {
            this.setState({cameraStatus: !this.state.cameraStatus});
          }}
          style={[styles.absoluteButton, {zIndex: 1}]}
          containerStyle={styles.absoluteButtonContainer}
        />
        {this.state.cameraStatus ? (
          <BarcodeScanner
            strings={strings}
            text={this.renderText()}
            onScanBarcode={this.onScanBarcodeWithCamera.bind(this)}
          />
        ) : null}
      </View>
    );
  }
}

Barcode.propTypes = {
  onScan: PropTypes.func.isRequired,
  message: PropTypes.string,
  animateTextSuccess: PropTypes.bool,
  scanTo: PropTypes.oneOf(['product', 'location', 'cart', 'tray']).isRequired,
  expected: PropTypes.string,
  expectedLabel: PropTypes.string,
  expects: PropTypes.array,
  expectsResultKey: PropTypes.string,
  expectsResult: PropTypes.array,
  right: PropTypes.bool,
  isFocused: PropTypes.bool,
  smallImage: PropTypes.bool,
};

const mapStateToProps = (store) => {
  const {strings} = store.locale;

  return {strings};
};

export default connect(mapStateToProps)(Barcode);

const styles = StyleSheet.create({
  wrapView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  location: {
    color: '#ffb100',
  },
  cart: {
    color: '#f5ff00',
  },
  tray: {
    color: '#00ff0b',
  },
  product: {
    color: '#00d1ff',
  },
  messageView: {
    width: 300,
    justifyContent: 'center',
    maxWidth: '90%',
  },
  blur: {
    backgroundColor: '#a009',
    position: 'absolute',
    left: 10,
    top: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  icon: {
    position: 'absolute',
  },
  barcodeTextWrapper: {
    justifyContent: 'center',
  },
  barcodeText: {
    fontSize: 20,
    width: '100%',
    color: '#fff6',
    textAlign: 'center',
  },
  messageText: {
    fontSize: 20,
    width: '100%',
    color: '#fff6',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textInput: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    color: '#0000',
  },
  absoluteButton: {
    position: 'absolute',
    left: 0,
    bottom: 15,
  },
  absoluteButtonContainer: {
    height: 50,
    paddingHorizontal: 20,
  },
});
