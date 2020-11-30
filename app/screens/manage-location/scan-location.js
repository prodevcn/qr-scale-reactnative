import React from 'react';
import {connect} from 'react-redux';
import {SafeAreaView, StatusBar} from 'react-native';
import StackScreen from '../../base-components/stack-screen';
import Barcode from '../../components/barcode';

class ScanLocation extends StackScreen {
  titleKey = 'ManageLocation.ScanLocation.Title';
  homeButton = true;
  barcodeScanned = (locationCode, location) => {
    this.props.navigation.navigate('LocationProducts', {
      location: {locationId: location.id, locationCode},
    });
  };

  render() {
    const {strings} = this.props;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#333'}}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <Barcode
          isFocused={this.state.isFocused}
          scanTo="location"
          onScan={this.barcodeScanned}
          message={
            strings.MobileUI['Barcode.Messages.currentLocation'] ||
            'Locale Error'
          }
        />
      </SafeAreaView>
    );
  }
}

export default connect(({locale: {strings}}) => ({strings}))(ScanLocation);
