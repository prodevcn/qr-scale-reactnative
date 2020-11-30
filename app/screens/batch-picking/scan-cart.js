import React from 'react';
import {connect} from 'react-redux';
import {SafeAreaView, ScrollView, StatusBar, Text, View} from 'react-native';
import StackScreen from '../../base-components/stack-screen';
import Barcode from '../../components/barcode';
import Actions from '../../actions/scan-solution/batch-picking';
import PageIndicator from '../../components/page-indicator';
import {withNavigationFocus} from 'react-navigation';
import {AppDialog$} from '../../components/app-dialog';
import {errorsToContent} from '../../utilities';
import DialogWrapper from '../../components/dialog-wrapper';
import IndicatorButton from '../../components/indicator-button';

class ScanCart extends StackScreen {
  titleKey = 'BatchPicking.ScanCart.Title';
  homeButton = false;
  state = {
    loading: false,
    removeSOsModalStatus: false,
    cart: null,
  };

  constructor(props, context) {
    super(props, context);
    // console.log(this.props.route);
  }

  willScreenFocus = () => {
    this.pickList = this.props.navigation.getParam('pickList');
    // this.pickList = this.props.route.params.pickList;
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  barcodeScanned = (barcode, cart) => {
    const {strings} = this.props;
    if (this.pickList && cart.size < this.pickList.pickListCount) {
      AppDialog$.next({
        type: 'error',
        title:
          strings.MobileUI['BatchPicking.ScanCart.Alerts.CartSize.Title'] ||
          'Locale Error',
        content:
          strings.MobileUI['BatchPicking.ScanCart.Alerts.CartSize.Body'] ||
          'Locale Error',
        expiredTime: 10 * 1000,
        status: true,
      });
      return;
    }
    if (cart.isBeingUsed) {
      if (cart.cartUsingEntityType === 'Picking') {
        const data = {cart};
        this.props.navigation.navigate('BatchPickingStep', data);
      } else {
        AppDialog$.next({
          type: 'error',
          title:
            strings.MobileUI[
              'BatchPicking.ScanCart.Alerts.IsBeingUsed.Title'
            ] || 'Locale Error',
          content:
            strings.MobileUI['BatchPicking.ScanCart.Alerts.IsBeingUsed.Body'] ||
            'Locale Error',
          expiredTime: 10 * 1000,
          status: true,
        });
      }
      return;
    }
    this.setState({loading: true, cart}, () => {
      this.startBatchPicking();
    });
  };
  startBatchPicking() {
    const {strings} = this.props;
    const params = {cartId: this.state.cart.id};
    if (this.pickList) {
      params.batchPickingId = this.pickList.id;
    }

    Actions.startBatchPicking(params).then((res) => {
      this.setState({loading: false}, () => {
        if (res.succeeded) {
          const data = {cart: this.state.cart};
          if (this.pickList) {
            data.batchItem = this.pickList;
          }
          this.props.navigation.navigate('BatchPickingStep', data);
        } else {
          if (res.result) {
            this.setState({
              removeSOsModalStatus: true,
              SOs: res.result,
            });
          } else if (res.errors && res.errors.length) {
            const errorContent = errorsToContent(res.errors, strings);
            AppDialog$.next({
              type: 'error',
              title: '',
              content: errorContent,
              expiredTime: 10 * 1000,
              status: true,
            });
          }
        }
      });
    });
  }

  removeSos() {
    Actions.removePickListFromBatchPicking(
      this.pickList.id,
      this.state.SOs,
    ).then((res) => {
      if (res.succeeded) {
        this.startBatchPicking();
      } else if (res.errors && res.errors.length) {
        this.setState({loading: false}, () => {
          const errorContent = errorsToContent(res.errors, strings);
          AppDialog$.next({
            type: 'error',
            title: '',
            content: errorContent,
            expiredTime: 10 * 1000,
            status: true,
          });
        });
      } else {
        this.setState({loading: false});
      }
    });
  }

  renderRemoveSOsModal() {
    const {strings} = this.props;
    return (
      <DialogWrapper
        style={{width: '65%'}}
        rawContent={true}
        withoutTouchable={true}>
        <DialogWrapper.Title>
          {strings.MobileUI['BatchPicking.ScanCart.Alerts.XCartSize.Title'] ||
            'Locale Error'}
        </DialogWrapper.Title>
        <DialogWrapper.Content>
          <ScrollView style={{maxHeight: 50, width: '100%'}}>
            <Text style={{color: '#fff', fontSize: 16}}>
              {this.state.SOs.reduce((text, item, index) => {
                return (
                  text +
                  (strings.MobileUI[item] || item) +
                  (index < this.state.SOs.length - 1 ? ', ' : '')
                );
              }, '')}
            </Text>
          </ScrollView>
        </DialogWrapper.Content>
        <DialogWrapper.Actions>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
            }}>
            <IndicatorButton
              white
              raised
              text={
                strings.MobileUI[
                  'BatchPicking.ScanCart.Alerts.XCartSize.Continue'
                ] || 'Locale Error'
              }
              onPress={() => {
                this.setState(
                  {loading: true, removeSOsModalStatus: false},
                  () => {
                    this.removeSos();
                  },
                );
              }}
              containerStyle={{minHeight: 50}}
              style={{marginBottom: 20}}
              textStyle={{textAlign: 'center'}}
            />
            <IndicatorButton
              white
              raised
              text={
                strings.MobileUI[
                  'BatchPicking.ScanCart.Alerts.XCartSize.Cancel'
                ] || 'Locale Error'
              }
              onPress={() => {
                this.setState({removeSOsModalStatus: false}, () => {
                  this.goBack();
                });
              }}
            />
          </View>
        </DialogWrapper.Actions>
      </DialogWrapper>
    );
  }

  render() {
    const {loading} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#333'}}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        {loading ? (
          <PageIndicator />
        ) : (
          <Barcode
            isFocused={this.state.isFocused}
            scanTo="cart"
            onScan={this.barcodeScanned}
          />
        )}
        {this.state.removeSOsModalStatus ? this.renderRemoveSOsModal() : null}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({locale: {strings}}) => {
  return {strings};
};

export default connect(mapStateToProps)(withNavigationFocus(ScanCart));
