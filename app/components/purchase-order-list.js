import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import _ from 'lodash';

import Actions from '../actions/scan-solution/order-picking';
import SelectList from '../components/select-list';
import PageIndicator from '../components/page-indicator';

export default class PurchaseOrderList extends React.PureComponent {
  state = {
    list: {subSet: []},
    searchText: '',
    loading: true,
    refreshing: false,
  };

  render() {
    const {list, refreshing} = this.state;

    return (
      <SelectList
        arrow
        data={list.subSet}
        itemOuterStyle={styles.itemOuter}
        itemStyle={(item) =>
          item.status === 'Confirmed' ? styles.green : styles.blue
        }
        itemDisabled={(item) => item.status !== 'Confirmed'}
        noDataMessageKey="PurchaseOrderList.NoDataMessage"
        title={(pickList) => (
          <View style={styles.line}>
            <Text style={styles.lineText}>{pickList.pickListId}</Text>
            <Text style={[styles.lineText, {flex: 0, width: 100}]}>
              {pickList.orderId}
            </Text>
            <Text
              style={[
                styles.lineText,
                styles.lineTextMini,
                styles.lineTextCenter,
              ]}>
              {pickList.orderLineCount}/{pickList.amount}
            </Text>
            <Text style={[styles.lineText, styles.lineTextCenter]}>
              {pickList.createdDateTime}
            </Text>
          </View>
        )}
        refreshing={refreshing}
        onRefresh={this.refresh}
        onPressItem={this.props.onSelect}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  indicatorWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemOuter: {
    borderTopWidth: 1,
    borderTopColor: '#fff3',
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
});
