import React from 'react';
import {connect} from 'react-redux';
import {SafeAreaView, StatusBar} from 'react-native';
import StackScreen from '../../base-components/stack-screen';
import Barcode from '../../components/barcode';

class AddLineScanProduct extends StackScreen {
  titleKey = 'Purchase.AddLineScanProduct.Title';

  componentDidMount() {
    this.props.navigation.setParams({
      title: this.titleKey
        ? (this.props.strings.MobileUI[this.titleKey] || 'Locale Error') +
          ': ' +
          this.props.navigation.getParam('purchaseOrderId')
        : 'No Title',
    });
  }

  barcodeScanned = (barcode, product) => {
    const {navigation} = this.props;
    const purchaseOrderId = navigation.getParam('purchaseOrderId');

    navigation.navigate('AddLineProductPreview', {purchaseOrderId, product});
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

export default connect(({locale: {strings}}) => ({strings}))(
  AddLineScanProduct,
);
