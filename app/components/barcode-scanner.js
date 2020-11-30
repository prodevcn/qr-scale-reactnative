import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Platform} from 'react-native';
import {RNCamera} from 'react-native-camera';
import PropTypes from 'prop-types';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

class BarcodeScanner extends Component {
  componentDidMount() {
    let hasCameraPermission;
    check(
      Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      }),
    )
      .then((result) => {
        hasCameraPermission = result;
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            this.setState({hasCameraPermission});
            break;
          case RESULTS.DENIED:
            request(
              Platform.select({
                android: PERMISSIONS.ANDROID.CAMERA,
                ios: PERMISSIONS.IOS.CAMERA,
              }),
            );
            break;
          case RESULTS.GRANTED:
            console.log('Camera available !');
            this.setState({hasCameraPermission});
            break;
          case RESULTS.BLOCKED:
            this.setState({hasCameraPermission});
            break;
        }
      })
      .catch((err) => {
        console.error(err);
      });
    // Returns once the user has chosen to 'allow' or to 'not allow' access
    // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
    // this.setState({hasCameraPermission});
  }

  static async getTypes() {
    let types = await BarcodeScanner.getTypes();
    return types.reduce((obj, item) => {
      obj[item] = item;
      return obj;
    }, {});
  }

  constructor(props) {
    super(props);
    this.camera = null;
    this.barcodeCodes = [];

    this.state = {
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
        barcodeFinderVisible: true,
      },
      hasCameraPermission: null,
    };
  }

  onBarCodeRead(scanResult) {
    console.warn(scanResult.type);
    console.warn(scanResult.data);
    this.props.onScanBarcode(scanResult.data);
    if (scanResult.data != null) {
      if (!this.barcodeCodes.includes(scanResult.data)) {
        this.barcodeCodes.push(scanResult.data);
        console.warn('onBarCodeRead call');
      }
    }
  }

  async takePicture() {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
  }

  static pendingView() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'lightgreen',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Waiting</Text>
      </View>
    );
  }

  render() {
    const {hasCameraPermission} = this.state;
    console.log('zeus is hades`s brother', hasCameraPermission);
    const {strings} = this.props;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission !== RESULTS.GRANTED) {
      return (
        <View>
          <Text>
            {strings.MobileUI['Camera.Messages.Error.NoAccess'] ||
              'Locale Error'}
          </Text>
        </View>
      );
    }
    return (
      <View style={[StyleSheet.absoluteFill, styles.container]}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          barcodeFinderVisible={this.state.camera.barcodeFinderVisible}
          barcodeFinderWidth={280}
          barcodeFinderHeight={220}
          barcodeFinderBorderColor="white"
          barcodeFinderBorderWidth={2}
          defaultTouchToFocus
          captureAudio={false}
          flashMode={this.state.camera.flashMode}
          mirrorImage={false}
          onBarCodeRead={this.onBarCodeRead.bind(this)}
          onFocusChanged={() => {}}
          onZoomChanged={() => {}}
          permissionDialogTitle={
            strings.MobileUI['Camera.Messages.Error.NoAccess'] || 'Locale Error'
          }
          permissionDialogMessage={
            strings.MobileUI['Camera.Messages.Error.NoAccess'] || 'Locale Error'
          }
          style={[StyleSheet.absoluteFill, styles.preview]}
          type={this.state.camera.type}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}>
          <View
            style={{
              backgroundColor: '#3335',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '90%',
              maxWidth: 330,
            }}>
            {this.props.text}
          </View>
        </View>
        <View style={[styles.overlay, styles.bottomOverlay]}>
          <Button
            onPress={() => {
              console.log('scan clicked');
            }}
            style={styles.enterBarcodeManualButton}
            title="Enter Barcode"
          />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: '#333',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  scanScreenMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

BarcodeScanner.propTypes = {
  style: PropTypes.object,
  onScanBarcode: PropTypes.func.isRequired,
  text: PropTypes.node,
  strings: PropTypes.object,
};

export default BarcodeScanner;
