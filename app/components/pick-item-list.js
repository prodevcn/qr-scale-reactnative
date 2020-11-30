import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import _ from 'lodash';

import Actions from '../actions/scan-solution/order-picking';
import SelectList from '../components/select-list';
import PageIndicator from '../components/page-indicator';
import {ActionButton} from 'react-native-material-ui';

export default class PickItemList extends React.PureComponent {
  state = {
    list: {subSet: []},
    searchText: '',
    loading: true,
    refreshing: false,
    pageNumber: 1,
    pageSize: 20,
    hasNextPage: false,
  };

  componentDidMount() {
    this.loadRefreshData();
  }

  loadRefreshData = (params = {}) => {
    const {filterId} = this.props;
    const {searchText, pageNumber, pageSize} = this.state;
    const defaultParams = {pageNumber, pageSize, searchText, filterId};
    const computedParams = _.merge(defaultParams, params);

    Actions.getPickListByFilter(computedParams).then((data) => {
      if (data.succeeded) {
        data.subSet =
          pageNumber === 1
            ? data.subSet
            : [...this.state.list.subSet, ...data.subSet];
        this.setState({
          list: data,
          loading: false,
          refreshing: false,
          hasNextPage: data.hasNextPage,
          ...computedParams,
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
    this.setState(
      {refreshing: true, loading: true, pageNumber: 1},
      this.loadRefreshData,
    );
  };

  render() {
    const {list, loading} = this.state;

    return (
      <View style={styles.container} {...this.props}>
        {loading ? <PageIndicator /> : null}
        {list && list.subSet ? (
          <SelectList
            arrow
            data={list.subSet}
            itemOuterStyle={styles.itemOuter}
            itemStyle={(item) =>
              item.status === 'Confirmed' ? styles.green : styles.blue
            }
            onEndReached={
              this.state.hasNextPage ? this.loadNextPage.bind(this) : null
            }
            onEndReachedThreshold={
              this.state.hasNextPage
                ? parseInt((4 / this.state.list.subSet.length).toFixed(2))
                : null
            }
            itemDisabled={(item) => item.status !== 'Confirmed'}
            noDataMessageKey="PickItemList.List.NoDataMessage"
            title={(pickList) => (
              <View style={styles.line}>
                {pickList.isScanCompleted ? (
                  <View style={[styles.status]} />
                ) : null}
                <Text style={[styles.lineText, styles.lineTextTitle]}>
                  {pickList.pickListId}
                </Text>
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
            onPressItem={this.props.onSelect}
          />
        ) : null}
        {loading ? null : (
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
        )}
      </View>
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
    position: 'relative',
  },
  status: {
    height: 50,
    width: 10,
    backgroundColor: '#008D0B',
    position: 'absolute',
    left: -16,
    top: -10,
  },
  lineText: {
    flex: 1,
    padding: 5,
    color: '#fffa',
    fontSize: 14,
  },
  lineTextTitle: {
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
