import React from 'react';
import {connect} from 'react-redux';
import StackScreen from '../../base-components/stack-screen';

import {StatusBar, StyleSheet, SafeAreaView} from 'react-native';
import {View, Text} from 'react-native';
import TextField from 'react-native-material-textfield/src/components/field';
import Picker from '../../components/picker';
import IndicatorButton from '../../components/indicator-button';
import DateRangePicker from '../../components/date-range-picker';

const statusList = [
  'Draft',
  'OnHold',
  'Confirmed',
  'Processing',
  'Cancelled',
  'Completed',
];

class OrderFilter extends StackScreen {
  titleKey = 'Purchase.OrderFilter.Title';

  state = {
    isSaving: false,
    status: null,
    searchText: '',
    orderDateStart: null,
    orderDateEnd: null,
    deliveryDateStart: null,
    deliveryDateEnd: null,
    date: null,
  };

  filterOrders = () => {
    const {status, searchText, orderDateStart, orderDateEnd} = this.state;
    const {deliveryDateStart, deliveryDateEnd} = this.state;

    this.props.navigation.navigate('OrderList', {
      status,
      searchText,
      orderDateStart,
      orderDateEnd,
      deliveryDateStart,
      deliveryDateEnd,
    });
  };

  render() {
    const {strings} = this.props;
    const {searchText, status, isSaving} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <TextField
              label={
                strings.MobileUI['Purchase.OrderFilter.Fields.Text'] ||
                'Locale Error'
              }
              value={searchText}
              containerStyle={{marginHorizontal: 5}}
              textColor="#fff"
              tintColor="#fffa"
              baseColor="#fff9"
              labelHeight={12}
              onChangeText={(searchText) => this.setState({searchText})}
            />

            <View style={{flexDirection: 'row'}}>
              <Picker
                placeholderText={
                  strings.MobileUI['Purchase.OrderFilter.Fields.Status'] ||
                  'Locale Error'
                }
                items={statusList.map((s) => ({label: s, value: s}))}
                onValueChange={(status) => this.setState({status})}
                value={status}
              />
            </View>

            <DateRangePicker
              label={
                strings.MobileUI['Purchase.OrderFilter.Fields.OrderDate'] ||
                'Locale Error'
              }
              startDate={this.state.orderDateStart}
              endDate={this.state.orderDateEnd}
              onStartDateChange={(v) => this.setState({orderDateStart: v})}
              onEndDateChange={(v) => this.setState({orderDateEnd: v})}
            />

            <DateRangePicker
              label={
                strings.MobileUI['Purchase.OrderFilter.Fields.DeliveryDate'] ||
                'Locale Error'
              }
              startDate={this.state.deliveryDateStart}
              endDate={this.state.deliveryDateEnd}
              onStartDateChange={(v) => this.setState({deliveryDateStart: v})}
              onEndDateChange={(v) => this.setState({deliveryDateEnd: v})}
            />
          </View>

          <View style={styles.footContainer}>
            <IndicatorButton
              raised
              primary
              text={
                strings.MobileUI['Purchase.OrderFilter.Buttons.FilterOrders'] ||
                'Locale Error'
              }
              containerStyle={{paddingHorizontal: 40}}
              loading={isSaving}
              onPress={this.filterOrders}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(({locale: {strings}}) => ({strings}))(OrderFilter);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 15,
  },
  headContainer: {
    paddingBottom: 15,
    flexDirection: 'row',
  },
  titleText: {
    fontSize: 18,
    color: '#fff5',
  },
  contentContainer: {
    flex: 1,
  },
  footContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
