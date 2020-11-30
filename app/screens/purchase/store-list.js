import React from 'react';
import {connect} from 'react-redux';
import StackScreen from '../../base-components/stack-screen';
import {StyleSheet, SafeAreaView, StatusBar, View} from 'react-native';
import PageIndicator from '../../components/page-indicator';

import SelectList from '../../components/select-list';

import Actions from '../../actions/scan-solution/purchase';
import {ActionButton} from 'react-native-material-ui';

class StoreList extends StackScreen {
  titleKey = 'Purchase.StoreList.Title';
  homeButton = true;

  state = {
    loading: true,
    refreshing: false,
    data: [],
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
    Actions.purchaseOrderGroupByStore().then((data) => {
      if (data.succeeded) {
        const storeList = data.result.map((item) => ({
          ...item.store,
          purchaseOrderCount: item.purchaseOrderCount,
        }));

        this.setState({
          data: storeList,
          loading: false,
          refreshing: false,
        });
      }
    });
  };

  refresh = () => {
    this.setState({refreshing: true, loading: true}, this.loadRefreshData);
  };

  goToOrderList = (store) => {
    this.props.navigation.navigate('OrderList', {storeId: store.id});
  };

  goToCreateNewOrder = () => {
    this.props.navigation.navigate('CreateOrder');
  };

  goToOrderFilter = () => {
    this.props.navigation.navigate('OrderFilter');
  };

  render() {
    const {data, loading} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        {loading ? (
          <PageIndicator />
        ) : (
          <View style={{flex: 1}}>
            <SelectList
              arrow
              data={data}
              onPressItem={this.goToOrderList}
              noDataMessageKey="StoreList.NoDataMessage"
              title={(store) =>
                `${store.name} (${store.purchaseOrderCount || 0})`
              }
            />
            <ActionButton
              icon="plus"
              size={40}
              rippleColor="#000"
              onPress={this.goToCreateNewOrder}
              style={{
                container: {backgroundColor: '#5c5', bottom: 50},
                icon: {color: '#000e'},
              }}
            />

            <ActionButton
              icon="filter-variant"
              size={40}
              rippleColor="#000"
              onPress={this.goToOrderFilter}
              style={{
                container: {backgroundColor: '#c85', right: 50},
                icon: {color: '#000e'},
              }}
            />
            <ActionButton
              icon="refresh"
              size={40}
              rippleColor="#000"
              onPress={this.refresh}
              style={{
                container: {backgroundColor: '#ccc'},
                icon: {color: '#000e'},
              }}
            />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export default connect(({locale: {strings}}) => ({strings}))(StoreList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
});
