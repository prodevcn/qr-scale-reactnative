import React from 'react';
import {connect} from 'react-redux';
import update from 'immutability-helper';
import DrawerLayout from 'react-native-drawer-layout';
import StackScreen from '../../base-components/stack-screen';

import {StatusBar, SafeAreaView, View, StyleSheet} from 'react-native';
import IndicatorButton from '../../components/indicator-button';
import ModifyNumber from '../../components/modify-number';
import ProductView from '../../components/product-view';
import LocationView from '../../components/location-view';
import Barcode from '../../components/barcode';

import Actions from '../../actions/scan-solution/pick-stock';
import {AppDialog$} from '../../components/app-dialog';

class PickStockDetail extends StackScreen {
  titleKey = 'PickStock.PickStockDetail.Title';

  constructor(props) {
    super(props);

    this.state = {
      product: props.navigation.getParam('product'),
      goBackStatus: props.navigation.getParam('goBack'),
      location: props.navigation.getParam('location'),
      targetLocation: null,
      drawerContext: null,
      quantity: '0',
      isSaving: false,
      modifyNumber: 'correct',
    };
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  moveStock = () => {
    const {strings} = this.props;
    const {product, location, targetLocation, quantity} = this.state;

    this.setState({isSaving: true});
    Actions.productStockChange({
      productId: product.id,
      currentLocationId: location.locationId,
      targetLocationId: targetLocation.locationId,
      quantity: parseInt(quantity, 10),
    }).then((data) => {
      if (data.succeeded) {
        this.setState(
          update(this.state, {
            location: {
              quantity: {$set: (data.result ? data.result.quantity : 0) || 0},
            },
            targetLocation: {$set: null},
          }),
          () => {
            this.drawer.closeDrawer();
            if (this.state.goBackStatus) {
              this.goBack();
            }
          },
        );
      } else {
        AppDialog$.next({
          type: 'error',
          title:
            strings.MobileUI[
              'PickStock.PickStockDetail.Alerts.LocationMoveFailed.Title'
            ] || 'Locale Error',
          content:
            strings.MobileUI[
              'PickStock.PickStockDetail.Alerts.LocationMoveFailed.Body'
            ] || 'Locale Error',
          expiredTime: 10 * 1000,
          status: true,
        });
      }
      this.setState({isSaving: false});
    });
  };

  correctStock = () => {
    const {strings} = this.props;
    const {quantity} = this.state;
    const {locationId} = this.state.location;
    const {id: productId} = this.state.product;

    this.setState({isSaving: true});
    Actions.productStockCorrect({
      productId,
      locationId,
      quantity: parseInt(quantity, 10),
    }).then((data) => {
      if (data.succeeded) {
        this.setState(
          update(this.state, {
            location: {quantity: {$set: data.result.quantity}},
          }),
          this.drawer.closeDrawer,
        );
      } else {
        AppDialog$.next({
          type: 'error',
          title:
            strings.MobileUI[
              'PickStock.PickStockDetail.Alerts.StockUpdateFailed.Title'
            ] || 'Locale Error',
          content:
            strings.MobileUI[
              'PickStock.PickStockDetail.Alerts.StockUpdateFailed.Body'
            ] || 'Locale Error',
          expiredTime: 10 * 1000,
          status: true,
        });
      }
      this.setState({isSaving: false});
    });
  };

  onCorrectPress = () => {
    const quantity = `${this.state.location.quantity || 0}`;
    this.setState({quantity, modifyNumber: 'correct'}, () =>
      this.openDrawerWith('modifyNumber'),
    );
  };

  onMovePress = () => {
    this.setState({modifyNumber: 'move'}, () =>
      this.openDrawerWith('scanNewLocation'),
    );
  };

  openDrawerWith = (drawerContext) => {
    this.setState({drawerContext}, this.drawer.openDrawer);
  };

  onDrawerClose = () => {
    this.setState({
      quantity: '0',
      drawerContext: null,
      targetLocation: null,
    });
  };

  targetLocationScanned = (locationCode, {id}) => {
    const {strings} = this.props;
    const currentLocation = this.state.location;

    if (currentLocation.locationCode !== locationCode) {
      this.drawer.closeDrawer();
      setTimeout(
        () =>
          this.setState(
            {
              targetLocation: {locationId: id, locationCode},
            },
            () => this.openDrawerWith('modifyNumber'),
          ),
        600,
      );
    } else {
      AppDialog$.next({
        type: 'error',
        title:
          strings.MobileUI[
            'PickStock.PickStockDetail.Alerts.LocationsMustDifferent.Title'
          ] || 'Locale Error',
        content:
          strings.MobileUI[
            'PickStock.PickStockDetail.Alerts.LocationsMustDifferent.Body'
          ] || 'Locale Error',
        expiredTime: 10 * 1000,
        status: true,
      });
    }
  };

  render() {
    const {strings} = this.props;
    const {product, location, targetLocation, drawerContext} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <DrawerLayout
          locked={true}
          drawerWidth={250}
          drawerPosition={DrawerLayout.positions.Right}
          onDrawerClose={this.onDrawerClose}
          renderNavigationView={() =>
            drawerContext === 'modifyNumber' ? (
              <ModifyNumber
                min={this.state.modifyNumber === 'correct' ? 0 : 1}
                max={
                  this.state.modifyNumber === 'move' ? location.quantity : null
                }
                value={this.state.quantity}
                valueChanged={(quantity) => this.setState({quantity})}
                checkButton={true}
                disabled={this.state.isSaving}
                onCheck={targetLocation ? this.moveStock : this.correctStock}
              />
            ) : drawerContext === 'scanNewLocation' ? (
              <Barcode
                isFocused={this.state.isFocused}
                scanTo="location"
                message={
                  strings.MobileUI['Barcode.Messages.targetLocation'] ||
                  'Locale Error'
                }
                onScan={this.targetLocationScanned}
              />
            ) : null
          }
          ref={(drawer) => (this.drawer = drawer)}>
          <View style={styles.container}>
            <View style={styles.wrapper}>
              <ProductView product={product} showImage />
              <LocationView
                currentLocation={location}
                targetLocation={targetLocation}
              />
            </View>
            <View style={styles.actionsWrapper}>
              <IndicatorButton
                green
                raised
                text={
                  strings.MobileUI[
                    'PickStock.PickStockDetail.Buttons.Correct'
                  ] || 'Locale Error'
                }
                containerStyle={styles.buttonContainer}
                textStyle={{fontSize: 21}}
                onPress={this.onCorrectPress}
              />
              <IndicatorButton
                red
                raised
                primary
                text={
                  strings.MobileUI['PickStock.PickStockDetail.Buttons.Move'] ||
                  'Locale Error'
                }
                containerStyle={styles.buttonContainer}
                textStyle={{fontSize: 21}}
                onPress={this.onMovePress}
              />
            </View>
          </View>
        </DrawerLayout>
      </SafeAreaView>
    );
  }
}

export default connect(({locale: {strings}}) => ({strings}))(PickStockDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    flexDirection: 'row',
  },
  wrapper: {
    flex: 0.7,
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  actionsWrapper: {
    flex: 0.3,
    padding: 20,
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
    height: 70,
  },
});
