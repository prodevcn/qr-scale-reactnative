import React from 'react';
import {connect} from 'react-redux';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import StackScreen from '../../base-components/stack-screen';
import {getAttributeValue} from '../../helpers/product';

import ProductView from '../../components/product-view';
import IndicatorButton from '../../components/indicator-button';

import Actions from '../../actions/scan-solution/purchase';
import ModifyNumber from '../../components/modify-number';
import Barcode from '../../components/barcode';
import DialogWrapper from '../../components/dialog-wrapper';
import PageIndicator from '../../components/page-indicator';
import {withNavigationFocus} from 'react-navigation';

class AddLineProductPreview extends StackScreen {
  titleKey = 'Purchase.AddLineProductPreview.Title';

  state = {
    isSaving: false,
    product: this.props.navigation.getParam('product'),
    purchaseOrderId: this.props.navigation.getParam('purchaseOrderId'),
    ordered: '0',
    redirectModalStatus: false,
    orderLine: null,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      title: this.titleKey
        ? (this.props.strings.MobileUI[this.titleKey] || 'Locale Error') +
          ': ' +
          this.props.navigation.getParam('purchaseOrderId')
        : 'No Title',
    });
  }

  goToLineProcess = () => {
    this.setState({loading: false, redirectModalStatus: false}, () => {
      this.props.navigation.navigate('OrderLineProcess', {
        orderLine: this.state.orderLine,
      });
    });
  };
  goToOrderDetail = () => {
    this.setState({loading: false, redirectModalStatus: false}, () => {
      this.props.navigation.navigate('OrderProcess', {
        purchaseOrderId: this.state.purchaseOrderId,
      });
    });
  };
  goToNewLine = () => {
    this.setState({loading: false, redirectModalStatus: false}, () => {
      this.props.navigation.navigate('AddLineScanProduct', {
        purchaseOrderId: this.state.purchaseOrderId,
      });
    });
  };

  addOrderLine = () => {
    const {product, purchaseOrderId} = this.state;
    const {productFamilyList, dataLocale, defaultChannelId} = this.props;
    const {
      attributeList,
      dateTimeOptions,
      numberOptions,
      warehouseId,
    } = this.props;

    const family = productFamilyList.find((f) => f.id === product.familyId);
    const price = getAttributeValue(
      {...product, family},
      this.props.entityAttribute.wmsEntityAttributeDto.price,
      attributeList,
      dataLocale,
      defaultChannelId,
      dateTimeOptions,
      numberOptions,
    );

    this.setState({isSaving: true});
    Actions.purchaseOrderAddNewLine(purchaseOrderId, {
      productId: product.id,
      ordered: this.state.ordered,
      price,
      warehouseId,
    }).then((data) => {
      if (data.succeeded) {
        this.setState({
          isSaving: false,
          loading: true,
          redirectModalStatus: true,
          orderLine: {...data.result, product},
        });
      }
    });
  };

  renderRedirectModal() {
    const {strings} = this.props;
    return (
      <DialogWrapper
        onPressBackdrop={() => {}}
        type={'success'}
        onPressModalContent={() => {}}>
        <DialogWrapper.Title>
          {strings.MobileUI['Purchase.AddOrderLine.Success.Title'] ||
            'Locale Error'}
        </DialogWrapper.Title>
        <DialogWrapper.Content>
          {strings.MobileUI['Purchase.AddOrderLine.Success.Body'] ||
            'Locale Error'}
        </DialogWrapper.Content>
        <DialogWrapper.Actions>
          <IndicatorButton
            white
            raised
            text={
              strings.MobileUI['Purchase.AddOrderLine.Success.NewLine'] ||
              'Locale Error'
            }
            onPress={this.goToNewLine}
            style={{marginRight: 10}}
          />
          <IndicatorButton
            white
            raised
            text={
              strings.MobileUI['Purchase.AddOrderLine.Success.OrderDetail'] ||
              'Locale Error'
            }
            onPress={this.goToOrderDetail}
          />
          {/*<IndicatorButton*/}
          {/*white*/}
          {/*raised*/}
          {/*text={*/}
          {/*strings.MobileUI[`Purchase.AddOrderLine.Success.LineProcess`] || 'Locale Error'*/}
          {/*}*/}
          {/*onPress={this.goToLineProcess}*/}
          {/*/>*/}
        </DialogWrapper.Actions>
      </DialogWrapper>
    );
  }

  productScanned() {
    this.setState({
      ordered: (parseInt(this.state.ordered) + 1).toString(),
    });
  }

  render() {
    const {strings} = this.props;
    const {product, isSaving} = this.state;

    if (isSaving) {
      return (
        <View style={{flex: 1, backgroundColor: '#333'}}>
          <PageIndicator />
        </View>
      );
    }

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#333'}}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <View style={styles.container}>
          <View style={styles.keys}>
            <ModifyNumber
              min={1}
              value={this.state.ordered}
              valueChanged={(ordered) => this.setState({ordered})}
              message={'Ordered'}
            />
          </View>
          <View style={styles.middle}>
            <View style={styles.middleTextWrap}>
              <Text style={styles.middleText}>
                {strings.MobileUI['PickStock.ProductLocations.Fields.Or'] ||
                  'Locale Error'}
              </Text>
            </View>
            <View style={styles.middleLine} />
          </View>
          <View style={styles.right}>
            <View style={{height: 80}}>
              <Barcode
                isFocused={this.state.isFocused}
                scanTo="product"
                smallImage
                onScan={this.productScanned.bind(this)}
                expected={product.barCodeValue}
                animateTextSuccess={true}
              />
            </View>
            <ProductView product={product} showImage />
          </View>
          <View style={styles.actionsContainer}>
            <IndicatorButton
              raised
              text={
                strings.MobileUI[
                  'Purchase.AddLineProductPreview.Buttons.Proceed'
                ] || 'Locale Error'
              }
              grey={this.state.ordered === '0'}
              white={parseInt(this.state.ordered) > 0}
              onPress={
                parseInt(this.state.ordered) > 0 ? this.addOrderLine : () => {}
              }
              loading={isSaving}
            />
          </View>
        </View>
        {this.state.redirectModalStatus ? this.renderRedirectModal() : null}
      </SafeAreaView>
    );
  }
}

const getWarehouseId = (home) => {
  let {warehouseList} = home;
  let {warehouseId} = home.user;
  return !warehouseId && warehouseList && warehouseList.length
    ? warehouseList[0].id
    : warehouseId;
};

const mapStateToProps = (store) => {
  const {dateTimeOptions, numberOptions} = store.common;
  const {productFamilyList, defaultChannelId} = store.common.home;
  const {entityAttribute, attributeList} = store.common.home;
  const warehouseId = getWarehouseId(store.common.home);
  const {strings, uiLocale, dataLocale} = store.locale;

  return {
    productFamilyList,
    uiLocale,
    dataLocale,
    defaultChannelId,
    entityAttribute,
    attributeList,
    dateTimeOptions,
    numberOptions,
    strings,
    warehouseId,
  };
};

export default connect(mapStateToProps)(
  withNavigationFocus(AddLineProductPreview),
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    position: 'relative',
  },
  keys: {
    flex: 0.7,
  },
  right: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 10,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  middle: {
    flex: 0,
    justifyContent: 'center',
  },
  middleLine: {
    position: 'absolute',
    backgroundColor: '#000',
    height: '100%',
    width: '4%',
    left: '48%',
  },
  middleTextWrap: {
    paddingHorizontal: 5,
    paddingVertical: 20,
    backgroundColor: '#000',
    borderRadius: 20,
    zIndex: 100,
  },
  middleText: {
    color: '#fffc',
  },
});
