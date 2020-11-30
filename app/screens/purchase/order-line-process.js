import React from 'react';
import {connect} from 'react-redux';
import StackScreen from '../../base-components/stack-screen';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';

import ProductView from '../../components/product-view';
import Barcode from '../../components/barcode';
import LocationView from '../../components/location-view';
import ModifyNumber from '../../components/modify-number';

import Actions from '../../actions/scan-solution/purchase';
import PageIndicator from '../../components/page-indicator';
import {AppDialog$} from '../../components/app-dialog';

class OrderLineProcess extends StackScreen {
  titleKey = 'Purchase.OrderLineProcess.Title';

  componentDidMount() {
    this.props.navigation.setParams({
      title: this.titleKey
        ? (this.props.strings.MobileUI[this.titleKey] || 'Locale Error') +
          ': ' +
          this.props.navigation.getParam('purchaseOrderId')
        : 'No Title',
    });
  }

  constructor(props) {
    super();

    this.state = {
      orderLine: props.navigation.getParam('orderLine'),
      selectedLocation: null,
      quantity: '0',
      isSaving: false,
    };
  }

  locationScanned = (code, location) => {
    const {foundLocations} = this.state.orderLine;
    const selectedLocation = foundLocations.find(
      (l) => l.locationCode === code,
    );

    if (selectedLocation) {
      this.setState({selectedLocation});
    } else {
      this.setState({
        selectedLocation: {
          locationId: location.id,
          locationCode: location.code,
          quantity: 0,
        },
      });
    }
  };

  addStock = () => {
    const {orderLine} = this.state;
    const {locationId} = this.state.selectedLocation;
    const quantity = parseInt(this.state.quantity);
    const {strings} = this.props;

    this.setState({isSaving: true});
    Actions.purchaseOrderAddStockInput({orderLine, locationId, quantity}).then(
      (data) => {
        if (data.succeeded) {
          // this.goBack();
          orderLine.stored = parseInt(orderLine.stored) + quantity;
          if (
            this.state.orderLine.foundLocations.find(
              (item) => item.locationId === locationId,
            )
          ) {
            this.state.orderLine.foundLocations.forEach((item) => {
              if (item.locationId === locationId) {
                item.quantity = (parseInt(item.quantity) + quantity).toString();
              }
            });
          } else {
            this.state.selectedLocation.quantity = quantity;
            this.state.orderLine.foundLocations.push(
              this.state.selectedLocation,
            );
          }
          this.setState({
            selectedLocation: null,
            quantity: '0',
            isSaving: false,
            orderLine,
          });
          if (orderLine.stored > orderLine.ordered) {
            AppDialog$.next({
              type: 'warning',
              title:
                strings.MobileUI[
                  'Purchase.OrderLineProcess.Alert.storedMoreThanOrdered.title'
                ] || 'Locale Error',
              content:
                strings.MobileUI[
                  'Purchase.OrderLineProcess.Alert.storedMoreThanOrdered.body'
                ] || 'Locale Error',
              expiredTime: 10 * 1000,
              status: true,
            });
          }
        }
      },
    );
  };

  // goBack = () => {
  //   this.props.navigation.goBack();
  // };

  render() {
    const {orderLine, selectedLocation, isSaving} = this.state;
    const scannedText =
      this.props.strings.MobileUI['Purchase.OrderLineProcess.ScannedText'] ||
      'Locale Error';
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <View style={styles.container}>
          <View style={styles.barcodeWrapper}>
            {!selectedLocation ? (
              <Barcode
                isFocused={this.state.isFocused}
                scanTo="location"
                onScan={this.locationScanned}
              />
            ) : (
              // ) : scanOneByOne ? (
              //   <Barcode
              //     scanTo="product"
              //     onScan={this.loadNextStep()}
              //     expected={currentStep.product.barCodeValue}
              //   />
              <ModifyNumber
                min={1}
                checkButton
                value={this.state.quantity || '0'}
                valueChanged={(quantity) => this.setState({quantity})}
                message={'Quantity'}
                onCheck={this.addStock}
              />
            )}
          </View>
          <View style={styles.wrapper}>
            <ProductView
              product={orderLine.product}
              showImage
              storedAndOrderedText={scannedText}
              storedAndOrdered={
                this.state.orderLine.stored +
                ' / ' +
                this.state.orderLine.ordered
              }
            />
            <LocationView
              selectedLocation={selectedLocation || undefined}
              availableLocations={orderLine.foundLocations}
            />
          </View>
        </View>

        {isSaving ? <PageIndicator overlay /> : null}
      </SafeAreaView>
    );
  }
}

export default connect(({locale: {strings}}) => ({strings}))(OrderLineProcess);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    flexDirection: 'row',
  },
  wrapper: {
    flex: 0.6,
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  barcodeWrapper: {
    flex: 0.4,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  actionsWrapper: {
    alignItems: 'flex-end',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 5,
  },
});
