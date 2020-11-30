import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Image, Keyboard, StyleSheet, Text, View} from 'react-native';

import GetByBarcodeActions from '../actions/scan-solution/get-by-barcode';
import PageIndicator from './page-indicator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IndicatorButton from './indicator-button';
import BarcodeTextAnimate from './barcode-text-animate';
import {AppDialog$} from './app-dialog';
import BarcodeScanner from './barcode-scanner';
import ExternalBarcodeReader from './barcode-input-ios';

class Barcode extends React.PureComponent {
  state = {
    validating: false,
    barcodeScannerConnected: true,
    cameraStatus: null,
    animateTextStatus: false,
    error: null,
    oldScanTo: '',
  };
  barcode = null;

  mounted = true;

  constructor(props) {
    super(props);
    this.onReadBarcode = this.onReadBarcode.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.isFocused) {
      this.barcode = '';
    }
  }
  // static getDerivedStateFromProps(props, state) {
  //   if (!props.isFocused) {
  //     this.barcode = '';
  //   }
  // }
  setStateIfMounted = (obj, callback) => {
    if (this.mounted) {
      this.setState(obj, callback);
    }
  };

  componentDidMount() {
    this.kbListener = Keyboard.addListener('keyboardWillShow', this._kbShown);
  }

  _kbShown = () => {
    this.setStateIfMounted({barcodeScannerConnected: false}, () => {
      Keyboard.dismiss();
    });
  };

  UNSAFE_componentWillUnmount() {
    this.kbListener.remove();
    this.mounted = false;
  }

  inputTextChanged = (barcode) => {
    this.barcode = barcode;
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
    this.inputTextChanged(barcode);
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

  onReadBarcode(event) {
    this.inputTextChanged(event.text);
  }

  render() {
    const {strings, right, isFocused, smallImage} = this.props;
    const {barcodeScannerConnected} = this.state;
    const imageSize = smallImage ? 50 : 250;
    const imagePositionX = smallImage ? -20 : -100;
    const imagePositionY = smallImage ? -4 : -20;
    return (
      <View style={[styles.wrapView]}>
        {barcodeScannerConnected && !this.state.validating ? (
          <ExternalBarcodeReader
            isFocused={isFocused}
            style={{opacity: 0.1}}
            onReadBarcode={this.onReadBarcode}
          />
        ) : null}
        {!barcodeScannerConnected && !this.state.validating ? (
          <View style={[styles.blur]} />
        ) : null}
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
          {!barcodeScannerConnected ? (
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
          ) : (
            <Image
              source={require('../../assets/images/barcode-scan.png')}
              style={[
                {
                  width: imageSize,
                  height: imageSize,
                  opacity: 0.7,
                },
              ]}
            />
          )}
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
