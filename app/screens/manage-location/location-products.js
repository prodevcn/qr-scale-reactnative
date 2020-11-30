import React from 'react';
import {connect} from 'react-redux';
import StackScreen from '../../base-components/stack-screen';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';

import ProductList from '../../components/product-list';
import PageIndicator from '../../components/page-indicator';
import IndicatorButton from '../../components/indicator-button';
import DialogWrapper from '../../components/dialog-wrapper';

import Actions from '../../actions/scan-solution/pick-stock';
import Barcode from '../../components/barcode';

class LocationProducts extends StackScreen {
  titleKey = 'ManageLocation.LocationProducts.Title';

  state = {
    loading: true,
    refreshing: false,
    data: [],
    pageNumber: 1,
    pageSize: 20,
    hasNextPage: false,
    barcode: null,
    redirectModalStatus: false,
    product: null,
  };

  willScreenFocus = () => {
    if (!this.state.loading) {
      this.setState({loading: true, pageNumber: 1}, this.loadRefreshData);
    }
  };

  componentDidMount() {
    this.loadRefreshData();
  }

  loadRefreshData = () => {
    const {navigation} = this.props;
    const {locationCode} = navigation.getParam('location');
    const {pageNumber, pageSize} = this.state;

    Actions.getProductsByLocationFilter(
      locationCode,
      pageNumber,
      pageSize,
    ).then((data) => {
      if (data.succeeded) {
        const list = data.subSet.map((p) => ({
          ...p.productDto,
          stockQuantity: p.stock ? p.stock.quantity : 0,
        }));
        this.setState({
          data: pageNumber === 1 ? list : [...this.state.data, ...list],
          loading: false,
          refreshing: false,
          hasNextPage: data.hasNextPage,
        });
      }
    });
  };

  loadNextPage() {
    this.setState(
      {
        pageNumber: this.state.pageNumber + 1,
        loading: true,
      },
      this.loadRefreshData,
    );
  }

  refresh = () => {
    this.setState({refreshing: true, pageNumber: 1}, this.loadRefreshData);
  };

  goToDetail = (product) => {
    const {navigation} = this.props;

    navigation.navigate('PickStockDetail', {
      product,
      location: {
        ...navigation.getParam('location'),
        quantity: product.stockQuantity,
      },
    });
  };

  goToAddProductToLocation = () => {
    const {navigation} = this.props;

    navigation.navigate('AddProductToLocation', {
      location: {
        ...navigation.getParam('location'),
        quantity: '0',
      },
      barcode: this.state.barcode,
      product: this.state.product,
    });
  };

  barcodeScanned = (code) => {
    this.setState({loading: true}, () => {
      Actions.getProductByCodeAndLocationId(
        this.props.navigation.getParam('location').locationId,
        code,
      )
        .then((data) => {
          let product = null;
          let redirectModalStatus = !data.result;
          if (data.result) {
            product = {
              ...data.result.productDto,
              stockQuantity: data.result.stock ? data.result.stock.quantity : 0,
            };
            redirectModalStatus = !data.result.stock;
          }
          this.setState(
            {
              loading: false,
              barcode: code,
              redirectModalStatus,
              product,
            },
            () => {
              if (!redirectModalStatus) {
                this.goToDetail(product);
              }
            },
          );
        })
        .catch(() => {
          this.setState({
            loading: false,
          });
        });
    });
  };

  renderRedirectModal() {
    const {strings} = this.props;
    return (
      <DialogWrapper onPressModalContent={() => {}}>
        <DialogWrapper.Title>
          {strings.MobileUI['ManageLocation.LocationProducts.Modal.Title'] ||
            'title'}
        </DialogWrapper.Title>
        <DialogWrapper.Content>
          {strings.MobileUI['ManageLocation.LocationProducts.Modal.Body'] ||
            'body'}
        </DialogWrapper.Content>
        <DialogWrapper.Actions>
          <IndicatorButton
            white
            raised
            text={
              strings.MobileUI['ManageLocation.LocationProducts.Modal.No'] ||
              'no'
            }
            onPress={() => {
              this.setState({redirectModalStatus: false});
            }}
            style={{marginRight: 10}}
          />
          <IndicatorButton
            white
            raised
            text={
              strings.MobileUI['ManageLocation.LocationProducts.Modal.Yes'] ||
              'yes'
            }
            onPress={() => {
              this.setState({redirectModalStatus: false}, () => {
                this.goToAddProductToLocation();
              });
            }}
          />
        </DialogWrapper.Actions>
      </DialogWrapper>
    );
  }

  render() {
    const {data, loading, refreshing} = this.state;
    const {strings} = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <View style={styles.wrapper}>
          <View style={styles.left}>
            <Barcode
              isFocused={this.state.isFocused}
              scanTo="product"
              onScan={this.barcodeScanned}
            />
          </View>

          <View style={styles.middle}>
            <View style={styles.middleTextWrap}>
              <Text style={styles.middleText}>
                {strings.MobileUI[
                  'ManageLocation.ProductLocations.Fields.Or'
                ] || 'Locale Error'}
              </Text>
            </View>
            <View style={styles.middleLine} />
          </View>

          <View style={styles.right}>
            {loading ? <PageIndicator /> : null}
            <ProductList
              arrow
              products={data}
              refreshing={refreshing}
              onRefresh={this.refresh}
              onPressItem={this.goToDetail}
              onEndReached={
                this.state.hasNextPage ? this.loadNextPage.bind(this) : null
              }
              onEndReachedThreshold={
                this.state.hasNextPage
                  ? parseInt((2 / this.state.data.length).toFixed(2))
                  : null
              }
              additionalColumn="stockQuantity"
              noDataMessageKey="LocationsProductList.NoDataMessage"
            />
          </View>
        </View>
        {this.state.redirectModalStatus ? this.renderRedirectModal() : null}
      </SafeAreaView>
    );
  }
}

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

export default connect(({locale: {strings}}) => ({strings}))(LocationProducts);
