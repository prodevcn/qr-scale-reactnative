import React from 'react';
import {connect} from 'react-redux';
import {SafeAreaView, StatusBar} from 'react-native';
import StackScreen from '../../base-components/stack-screen';
import ModifyNumber from '../../components/modify-number';
import Actions from '../../actions/scan-solution/pick-stock';
import PageIndicator from '../../components/page-indicator';

class AddProductToLocation extends StackScreen {
  titleKey = 'ManageLocation.AddProductToLocation.Title';

  constructor(props) {
    super(props);

    this.state = {
      product: props.navigation.getParam('product'),
      location: props.navigation.getParam('location'),
      barcode: props.navigation.getParam('barcode'),
      quantity: props.navigation.getParam('quantity') || '0',
    };

    this.addProductToLocation = this.addProductToLocation.bind(this);
  }

  addProductToLocation() {
    this.setState({loading: true}, () => {
      const {location, barcode, quantity} = this.state;
      Actions.addProductToLocation(location.locationId, barcode, quantity)
        .then(() => {
          this.setState(
            {
              loading: false,
            },
            () => {
              this.goToDetail();
            },
          );
        })
        .catch(() => {
          this.setState({
            loading: false,
          });
        });
    });
  }

  goToDetail() {
    const {navigation} = this.props;
    const {product, quantity} = this.state;

    navigation.navigate('PickStockDetail', {
      product: {...product, stockQuantity: quantity},
      location: {
        ...navigation.getParam('location'),
        quantity,
      },
    });
  }

  render() {
    const {loading} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#333'}}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        {loading ? (
          <PageIndicator />
        ) : (
          <ModifyNumber
            min={0}
            value={this.state.quantity}
            valueChanged={(quantity) => this.setState({quantity})}
            checkButton={true}
            onCheck={this.addProductToLocation}
          />
        )}
      </SafeAreaView>
    );
  }
}

export default connect(({locale: {strings}}) => ({strings}))(
  AddProductToLocation,
);
