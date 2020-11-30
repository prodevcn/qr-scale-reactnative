import React from 'react';
import {connect} from 'react-redux';
import StackScreen from '../../base-components/stack-screen';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import PageIndicator from '../../components/page-indicator';
import Actions from '../../actions/scan-solution/purchase';
import ProductList from '../../components/product-list';
import Barcode from '../../components/barcode';
import {ActionButton} from 'react-native-material-ui';
import DialogWrapper from '../../components/dialog-wrapper';
import IndicatorButton from '../../components/indicator-button';

class OrderProcess extends StackScreen {
  titleKey = 'Purchase.OrderProcess.Title';

  state = {
    loading: true,
    refreshing: false,
    purchaseOrderId: this.props.navigation.getParam('purchaseOrderId'),
    orderLines: [],
    products: [],
    redirectModalStatus: false,
    finishModalStatus: false,
  };

  constructor(props, context) {
    super(props, context);
    this.renderRedirectModal.bind(this);
    this.goToOrderList.bind(this);
  }

  willScreenFocus = () => {
    if (!this.state.loading) {
      this.setState({loading: true}, this.loadRefreshData);
    }
  };

  componentDidMount() {
    this.loadRefreshData();
    this.props.navigation.setParams({
      title: this.titleKey
        ? (this.props.strings.MobileUI[this.titleKey] || 'Locale Error') +
          ': ' +
          this.props.navigation.getParam('purchaseOrderId')
        : 'No Title',
    });
  }

  loadRefreshData = () => {
    Actions.purchaseOrderLineList(this.state.purchaseOrderId).then((data) => {
      if (data.succeeded) {
        this.setState({
          orderLines: data.result,
          //TODO: Need to be more understandable
          products: data.result.map((line) => ({
            ...line.product,
            lineId: line.id,
            ordered: line.ordered,
            stored: line.stored,
          })),
          loading: false,
          refreshing: false,
        });
      }
    });
  };

  refresh = () => {
    this.setState({refreshing: true}, this.loadRefreshData);
  };

  goToDetail = ({lineId}) => {
    const {orderLines, purchaseOrderId} = this.state;
    const orderLine = orderLines.find((line) => line.id === lineId);
    this.props.navigation.navigate('OrderLineProcess', {
      orderLine,
      purchaseOrderId,
    });
  };

  goToAddLine = () => {
    const {purchaseOrderId} = this.state;
    this.props.navigation.navigate('AddLineScanProduct', {purchaseOrderId});
  };

  barcodeScanned = (code, product) => {
    const {lineId} = this.state.products.find((p) => p.id === product.id);
    this.goToDetail({lineId});
  };

  combineProducts(products) {
    if (!(products && products instanceof Array)) {
      return products;
    }
    return products.reduce((items, item) => {
      const combinedProduct = items.find((product) => product.id === item.id);
      if (combinedProduct) {
        combinedProduct.stored += item.stored;
        combinedProduct.ordered += item.ordered;
        combinedProduct.bgColor =
          combinedProduct.ordered < combinedProduct.stored
            ? 'red'
            : combinedProduct.ordered === combinedProduct.stored
            ? 'green'
            : null;
      } else {
        item.bgColor =
          item.ordered < item.stored
            ? 'red'
            : item.ordered === item.stored
            ? 'green'
            : null;
        items.push(item);
      }
      return items;
    }, []);
  }

  completeOrder() {
    this.setState({loading: true}, () => {
      Actions.purchaseOrderComplete(this.state.purchaseOrderId).then(() => {
        this.setState({
          redirectModalStatus: true,
          loading: false,
          finishModalStatus: false,
        });
      });
    });
  }

  renderFinishModal() {
    const {strings} = this.props;
    return (
      <DialogWrapper
        onPressBackdrop={() => {
          this.setState({
            finishModalStatus: false,
          });
        }}
        onPressModalContent={() => {}}>
        <DialogWrapper.Title>
          {strings.MobileUI['Purchase.OrderProcess.Success.Title'] ||
            'Locale Error'}
        </DialogWrapper.Title>
        <DialogWrapper.Content>
          {strings.MobileUI['Purchase.OrderProcess.Success.Body'] ||
            'Locale Error'}
        </DialogWrapper.Content>
        <DialogWrapper.Actions>
          <IndicatorButton
            white
            raised
            text={
              strings.MobileUI['Purchase.OrderProcess.Finished.Ok'] ||
              'Locale Error'
            }
            onPress={this.completeOrder.bind(this)}
            containerStyle={{marginRight: 10}}
          />
          <IndicatorButton
            white
            raised
            text={
              strings.MobileUI['Purchase.OrderProcess.Finished.Cancel'] ||
              'Locale Error'
            }
            onPress={() => {
              this.setState({
                finishModalStatus: false,
              });
            }}
          />
        </DialogWrapper.Actions>
      </DialogWrapper>
    );
  }

  goToOrderList() {
    this.props.navigation.goBack();
  }

  renderRedirectModal() {
    const {strings} = this.props;
    return (
      <DialogWrapper
        onPressBackdrop={() => {
          this.setState({
            redirectModalStatus: false,
          });
        }}
        type={'success'}
        onPressModalContent={() => {}}>
        <DialogWrapper.Title>
          {strings.MobileUI['Purchase.OrderProcess.Success.Title'] ||
            'Locale Error'}
        </DialogWrapper.Title>
        <DialogWrapper.Content>
          {strings.MobileUI['Purchase.OrderProcess.Success.Body'] ||
            'Locale Error'}
        </DialogWrapper.Content>
        <DialogWrapper.Actions>
          <IndicatorButton
            white
            raised
            text={
              strings.MobileUI['Purchase.OrderProcess.Success.OrderList'] ||
              'Locale Error'
            }
            onPress={this.goToOrderList.bind(this)}
          />
        </DialogWrapper.Actions>
      </DialogWrapper>
    );
  }

  render() {
    const {strings} = this.props;
    const {products, loading, refreshing} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        {loading ? (
          <PageIndicator />
        ) : (
          <View style={styles.wrapper}>
            <View style={styles.left}>
              <Barcode
                isFocused={this.state.isFocused}
                scanTo="product"
                onScan={this.barcodeScanned}
                expectsResult={products.map((p) => p.id)}
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
              <ProductList
                arrow
                compact
                idKey="lineId"
                products={this.combineProducts(products)}
                refreshing={refreshing}
                onRefresh={this.refresh}
                onPressItem={this.goToDetail}
                additionalColumn={(product) =>
                  `${product.stored}/${product.ordered}`
                }
                noDataMessageKey="OrderLineList.NoDataMessage"
              />
            </View>

            <ActionButton
              icon="plus"
              size={40}
              rippleColor="#000"
              onPress={this.goToAddLine}
              style={{
                container: {
                  backgroundColor: '#5c5',
                  bottom: 50,
                },
                icon: {color: '#000e'},
              }}
            />
            <ActionButton
              icon="check"
              size={40}
              rippleColor="#000"
              onPress={() => {
                this.setState({
                  finishModalStatus: true,
                });
              }}
              style={{
                container: {
                  backgroundColor: '#5c5',
                  right: 0,
                },
                icon: {color: '#000e'},
              }}
            />
            {this.state.redirectModalStatus ? this.renderRedirectModal() : null}
            {this.state.finishModalStatus ? this.renderFinishModal() : null}
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export default connect(({locale: {strings}}) => ({strings}))(OrderProcess);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  left: {
    flex: 0,
    flexBasis: '30%',
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
  right: {
    flex: 1,
    padding: 0,
    justifyContent: 'center',
  },
});
