import React from 'react';
import {connect} from 'react-redux';
import StackScreen from '../../base-components/stack-screen';
import {StatusBar, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {View, Text} from 'react-native';

import PageIndicator from '../../components/page-indicator';
import Barcode from '../../components/barcode';
import IndicatorButton from '../../components/indicator-button';
import * as COLOR from 'react-native-material-ui/src/styles/colors';
import NoDataMessageView from '../../components/no-data-message-view';

import Actions from '../../actions/scan-solution/pick-stock';

class ProductLocations extends StackScreen {
  titleKey = 'PickStock.ProductLocations.Title';

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
    const {navigation} = this.props;
    const product = this.props.navigation.getParam('product');

    Actions.getLocationsByProductId(product.id).then((locationsData) => {
      if (locationsData.succeeded) {
        this.setState({
          data: locationsData.result,
          loading: false,
          refreshing: false,
        });
      }
    });
  };

  goToDetail = (location) => {
    const {navigation} = this.props;
    const product = this.props.navigation.getParam('product');

    this.props.navigation.navigate('PickStockDetail', {
      product,
      location,
      goBack: true,
    });
  };

  barcodeScanned = (code) => {
    this.goToDetail(this.state.data.find((l) => l.locationCode === code));
  };

  render() {
    const {strings} = this.props;
    const {data, loading} = this.state;

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
                scanTo="location"
                onScan={this.barcodeScanned}
                expects={data.map((l) => l.locationCode)}
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
              {data.length ? (
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                  }}>
                  {data.map((location) => (
                    <IndicatorButton
                      raised
                      key={location.locationId}
                      text={location.locationCode}
                      containerStyle={styles.buttonContainer}
                      textStyle={styles.buttonText}
                      onPress={() => this.goToDetail(location)}
                    />
                  ))}
                </ScrollView>
              ) : (
                <NoDataMessageView messageKey="PickStock.ProductLocations.NoDataMessage" />
              )}
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export default connect(({locale: {strings}}) => ({strings}))(ProductLocations);

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
    flex: 1,
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
    padding: 20,
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 5,
    paddingVertical: 5,
    backgroundColor: COLOR.grey400,
  },
  buttonText: {
    color: COLOR.black,
    fontSize: 16,
  },
});
