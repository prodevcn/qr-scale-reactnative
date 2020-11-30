import React from 'react';
import {connect} from 'react-redux';
import StackScreen from '../../base-components/stack-screen';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';

import Actions from '../../actions/scan-solution/batch-picking';
import SelectList from '../../components/select-list';
import PageIndicator from '../../components/page-indicator';

class SelectBatchList extends StackScreen {
  titleKey = 'BatchPicking.BatchList.Title';

  state = {
    loading: true,
    refreshing: false,
    data: [],
    pageNumber: 1,
    pageSize: 20,
    hasNextPage: false,
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
    const {pageNumber, pageSize} = this.state;
    Actions.getBatchListByFilter({pageNumber, pageSize, status: 0}).then(
      (data) => {
        if (data.succeeded) {
          const list = data.subSet;
          this.setState({
            data: pageNumber === 1 ? list : [...this.state.data, ...list],
            loading: false,
            refreshing: false,
            hasNextPage: data.hasNextPage,
          });
        }
      },
    );
  };

  loadNextPage() {
    this.setState(
      {
        pageNumber: this.state.pageNumber + 1,
      },
      this.loadRefreshData,
    );
  }

  refresh = () => {
    this.setState({refreshing: true, pageNumber: 1}, this.loadRefreshData);
  };

  selectBatch = (pickList) => {
    this.props.navigation.navigate('ScanCart', {pickList});
  };

  render() {
    const {data, loading, refreshing} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        {loading ? (
          <PageIndicator />
        ) : (
          <View style={styles.wrapper}>
            <SelectList
              arrow
              data={data}
              refreshing={refreshing}
              onRefresh={this.refresh}
              onPressItem={this.selectBatch}
              onEndReached={
                this.state.hasNextPage ? this.loadNextPage.bind(this) : null
              }
              onEndReachedThreshold={
                this.state.hasNextPage
                  ? parseInt((4 / this.state.data.length).toFixed(2))
                  : null
              }
              noDataMessageKey="BatchPicking.NoDataMessage"
              title={(item) => (
                <View style={styles.batchView}>
                  <View style={styles.batchValuesView}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="middle"
                      style={styles.batchTitleText}>
                      {item.name}
                    </Text>
                    <View style={styles.subLine}>
                      <View style={styles.subItem}>
                        <Text style={styles.batchLabelText}>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.additionalColumn}>
                    <Text style={styles.batchValueText}>23/34</Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}
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
  batchView: {
    display: 'flex',
    flexDirection: 'row',
  },
  batchLabelsView: {
    flex: 0,
    marginRight: 5,
    justifyContent: 'space-between',
  },
  batchValuesView: {
    flex: 1,
  },
  batchLabelText: {
    color: '#fff5',
    fontSize: 14,
    paddingRight: 2,
  },
  batchTitleText: {
    fontSize: 18,
    color: '#fffc',
  },
  batchValueText: {
    fontSize: 14,
    color: '#fff9',
  },
  subLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subItem: {
    flexDirection: 'row',
  },
  additionalColumn: {
    flexBasis: 100,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

export default connect(({locale: {strings}}) => ({strings}))(SelectBatchList);
