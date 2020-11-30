import React from 'react';
import {connect} from 'react-redux';
import StackScreen from '../../base-components/stack-screen';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  AlertIOS,
  Platform,
} from 'react-native';
import prompt from 'react-native-prompt-android';

import PageIndicator from '../../components/page-indicator';
import SelectList from '../../components/select-list';
import Actions from '../../actions/scan-solution/purchase';
import {AppDialog$} from '../../components/app-dialog';
import {errorsToContent} from '../../utilities';

class CreateOrder extends StackScreen {
  titleKey = 'Purchase.CreateOrder.Title';

  state = {
    loading: true,
    refreshing: false,
    stores: [],
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
        const stores = data.result.map((item) => ({
          ...item.store,
          purchaseOrderCount: item.purchaseOrderCount,
        }));

        this.setState({
          stores,
          loading: false,
          refreshing: false,
        });
      }
    });
  };

  refresh = () => {
    this.setState({refreshing: true}, this.loadRefreshData);
  };

  createOrder = (orderId, store) => {
    const {strings} = this.props;
    this.setState({loading: true}, () => {
      Actions.purchaseOrderCreate(orderId, store.id).then((data) => {
        if (data.succeeded) {
          this.setState(
            {
              loading: false,
            },
            () => {
              this.props.navigation.navigate('OrderProcess', {
                purchaseOrderId: data.result.id,
              });
            },
          );
        } else {
          this.setState({
            loading: false,
          });
          const errorContent = errorsToContent(data.errors, strings);
          AppDialog$.next({
            type: 'error',
            title: '',
            content: errorContent,
            expiredTime: 10 * 1000,
            status: true,
          });
        }
      });
    });
  };

  openOrderIdRequestModal = (store) => {
    const {strings} = this.props;
    if (Platform.OS === 'ios') {
      AlertIOS.prompt(
        strings.MobileUI['Purchase.CreateOrder.OrderIdRequest.Title'] ||
          'Locale Error',
        strings.MobileUI['Purchase.CreateOrder.OrderIdRequest.Body'] ||
          'Locale Error',
        [
          {
            text:
              strings.MobileUI[
                'Purchase.CreateOrder.OrderIdRequest.Buttons.Cancel'
              ] || 'Locale Error',
            style: 'cancel',
          },
          {
            text:
              strings.MobileUI[
                'Purchase.CreateOrder.OrderIdRequest.Buttons.Create'
              ] || 'Locale Error',
            onPress: (orderId) => this.createOrder(orderId, store),
          },
        ],
      );
    } else {
      prompt(
        strings.MobileUI['Purchase.CreateOrder.OrderIdRequest.Title'] ||
          'Locale Error',
        strings.MobileUI['Purchase.CreateOrder.OrderIdRequest.Body'] ||
          'Locale Error',
        [
          {
            text:
              strings.MobileUI[
                'Purchase.CreateOrder.OrderIdRequest.Buttons.Cancel'
              ] || 'Locale Error',
            style: 'cancel',
          },
          {
            text:
              strings.MobileUI[
                'Purchase.CreateOrder.OrderIdRequest.Buttons.Create'
              ] || 'Locale Error',
            onPress: (orderId) => this.createOrder(orderId, store),
          },
        ],
      );
    }
  };

  render() {
    const {stores, loading, refreshing} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        {loading ? (
          <PageIndicator />
        ) : (
          <View style={{flex: 1}}>
            <SelectList
              arrow
              data={stores}
              refreshing={refreshing}
              onRefresh={this.refresh}
              onPressItem={this.openOrderIdRequestModal}
              noDataMessageKey="StoreList.NoDataMessage"
              title={(store) =>
                `${store.name} (${store.purchaseOrderCount || 0})`
              }
            />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export default connect(({locale: {strings}}) => ({strings}))(CreateOrder);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
});
