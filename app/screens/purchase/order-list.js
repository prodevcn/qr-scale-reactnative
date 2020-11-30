import React from 'react';
import {connect} from 'react-redux';
import StackScreen from '../../base-components/stack-screen';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import PageIndicator from '../../components/page-indicator';

import SelectList from '../../components/select-list';

import Actions from '../../actions/scan-solution/purchase';

class OrderList extends StackScreen {
  titleKey = 'Purchase.OrderList.Title';

  state = {
    loading: true,
    refreshing: false,
    list: {subSet: []},
  };

  willScreenFocus = () => {
    if (!this.state.loading) {
      this.setState({loading: true}, this.loadRefreshData);
    }
  };

  componentDidMount() {
    this.loadRefreshData();
  }

  loadRefreshData = () => {
    const {getParam} = this.props.navigation;
    const {warehouseId} = this.props;

    Actions.purchaseOrderList({
      status: getParam('status'),
      storeId: getParam('storeId'),
      searchText: getParam('searchText'),
      orderDateStart: getParam('orderDateStart'),
      orderDateEnd: getParam('orderDateEnd'),
      deliveryDateStart: getParam('deliveryDateStart'),
      deliveryDateEnd: getParam('deliveryDateEnd'),
      warehouseId: warehouseId,
    }).then((data) => {
      if (data.succeeded) {
        data.subSet.forEach((item) => {
          item.bgColor = item.status === 'Confirmed' ? 'green' : 'blue';
        });
        this.setState({list: data, loading: false, refreshing: false});
      }
    });
  };

  refresh = () => {
    this.setState({refreshing: true}, this.loadRefreshData);
  };

  goToDetail = (order) => {
    if (order.status === 'Confirmed') {
      this.setState({loading: true}, () => {
        Actions.purchaseOrderStartProcessing
          .bind(this)(order.purchaseOrderId)
          .then(() => {
            this.setState({loading: false}, () => {
              this.props.navigation.navigate('OrderProcess', {
                purchaseOrderId: order.purchaseOrderId,
                orderId: order.orderId,
              });
            });
          });
      });
    } else {
      this.props.navigation.navigate('OrderProcess', {
        purchaseOrderId: order.purchaseOrderId,
        orderId: order.orderId,
      });
    }
  };

  render() {
    const {list, loading, refreshing} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        {loading ? (
          <PageIndicator />
        ) : (
          <SelectList
            idKey="orderId"
            data={list.subSet}
            refreshing={refreshing}
            onRefresh={this.refresh}
            onPressItem={this.goToDetail}
            noDataMessageKey="PurchaseOrderList.NoDataMessage"
            arrow
            title={(order) => {
              return (
                <View style={[styles.line]}>
                  <Text style={[styles.lineText, {flexBasis: '30%'}]}>
                    {order.orderId}
                  </Text>
                  <Text style={styles.lineText}>
                    Products: {order.amount || 0}
                  </Text>
                  <Text style={styles.lineText}>
                    Count: {order.orderLineCount || 0}
                  </Text>
                </View>
              );
            }}
          />
        )}
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
  const {strings} = store.locale;
  const warehouseId = getWarehouseId(store.common.home);
  return {strings, warehouseId};
};

export default connect(mapStateToProps)(OrderList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  line: {
    flexDirection: 'row',
  },
  lineText: {
    flex: 1,
    padding: 5,
    color: '#fffa',
    fontSize: 16,
  },
  lineTextMini: {
    flex: 0,
    width: 70,
  },
  lineTextCenter: {
    textAlign: 'center',
  },
  blue: {
    backgroundColor: '#334',
  },
  green: {
    backgroundColor: '#343',
  },
  iconView: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  leftIconView: {
    marginRight: -16,
  },
  rightIconView: {
    marginLeft: -16,
  },
});
