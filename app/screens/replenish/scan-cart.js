import React from 'react';
import {connect} from 'react-redux';
import StackScreen from '../../base-components/stack-screen';

import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import Barcode from '../../components/barcode';
import ModifyNumber from '../../components/modify-number';
import {AppDialog$} from '../../components/app-dialog';
import {withNavigationFocus} from 'react-navigation';

class ScanCart extends StackScreen {
  titleKey = 'Replenish.ScanCart.Title';
  homeButton = true;

  state = {
    amount: '0'
  };

  barcodeScanned = (code, cart) => {
    const {strings} = this.props;
    const amount = parseInt(this.state.amount);
    if (
      (amount && !cart.isBeingUsed)
      || (!amount && cart.isBeingUsed && cart.cartUsingEntityType === 'Replenish')
    ) {
      this.props.navigation.navigate('StepProcess', {cart, amount});
    } else {
      if (amount) {
        AppDialog$.next({
          type: 'error',
          title: strings.MobileUI['Replenish.ScanCart.Alerts.IsBeingUsed.Title'] || 'Locale Error',
          content: strings.MobileUI['Replenish.ScanCart.Alerts.IsBeingUsed.Body'] || 'Locale Error',
          expiredTime: 10 * 1000,
          status: true
        });
      } else {
        AppDialog$.next({
          type: 'error',
          title: strings.MobileUI['Replenish.ScanCart.Alerts.NoAmount.Title'] || 'Locale Error',
          content: strings.MobileUI['Replenish.ScanCart.Alerts.NoAmount.Body'] || 'Locale Error',
          expiredTime: 10 * 1000,
          status: true
        });
      }
    }
  };

  render() {
    const {strings} = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content"/>
        <View style={styles.wrapper}>
          <View style={styles.left}>
            <ModifyNumber
              value={this.state.amount}
              valueChanged={amount => this.setState({amount})}
              message={
                strings.MobileUI['Replenish.ScanCart.Fields.HowManyProducts'] ||
                'Locale Error'
              }
            />
          </View>
          <View style={styles.middle}>
            <View style={styles.middleTextWrap}>
              <Text style={styles.middleText}>
                {strings.MobileUI['Replenish.ScanCart.Fields.And'] ||
                'Locale Error'}
              </Text>
            </View>
            <View style={styles.middleLine}/>
          </View>
          <View style={styles.right}>
            <Barcode
              isFocused={this.state.isFocused}
              right
              scanTo="cart"
              onScan={this.barcodeScanned}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(({locale: {strings}}) => ({strings}))(withNavigationFocus(ScanCart));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333'
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row'
  },
  left: {
    flex: 1
  },
  middle: {
    flex: 0,
    justifyContent: 'center'
  },
  middleLine: {
    position: 'absolute',
    backgroundColor: '#000',
    height: '100%',
    width: '4%',
    left: '48%'
  },
  middleTextWrap: {
    paddingHorizontal: 5,
    paddingVertical: 20,
    backgroundColor: '#000',
    borderRadius: 20,
    zIndex: 100
  },
  middleText: {
    color: '#fffc'
  },
  right: {
    flex: 1
  }
});
