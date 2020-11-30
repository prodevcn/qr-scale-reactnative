import React from 'react';
import {connect} from 'react-redux';
import {SafeAreaView, StatusBar} from 'react-native';
import StackScreen from '../../base-components/stack-screen';
import Barcode from '../../components/barcode';

class ScanProduct extends StackScreen {
  titleKey = 'PickStock.ScanProduct.Title';
  homeButton = true;

  barcodeScanned = (barcode, product) => {
    setTimeout(() => {
      this.props.navigation.navigate('ProductLocations', {product});
    }, 0);
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#333'}}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <Barcode
          isFocused={this.state.isFocused}
          scanTo="product"
          onScan={this.barcodeScanned}
        />
      </SafeAreaView>
    );
  }
}

export default connect(({locale: {strings}}) => ({strings}))(ScanProduct);
