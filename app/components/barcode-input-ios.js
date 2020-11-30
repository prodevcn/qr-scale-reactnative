import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {requireNativeComponent, View} from 'react-native';

const COMPONENT_NAME = 'ExternalBarcodeReader';
const RNExternalBarcodeReader = requireNativeComponent(COMPONENT_NAME);

export default class ExternalBarcodeReader extends Component {
  static propTypes = {
    onReadBarcode: PropTypes.func,
    isFocused: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  willScreenFocus = () => {
    this.setState({show: true});
  };

  _onReadBarcode = (event) => {
    if (this.props.onReadBarcode) {
      this.props.onReadBarcode(event.nativeEvent);
    }
  };

  render() {
    const {style, isFocused} = this.props;
    return isFocused ? (
      <RNExternalBarcodeReader
        style={style}
        onReadBarcode={this._onReadBarcode}
        ref={(ref) => (this.ref = ref)}
      />
    ) : (
      <View />
    );
  }
}
