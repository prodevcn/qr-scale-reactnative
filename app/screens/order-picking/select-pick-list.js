import React from 'react';
import {connect} from 'react-redux';
import update from 'immutability-helper';
import StackScreen from '../../base-components/stack-screen';
import {StyleSheet, SafeAreaView, StatusBar} from 'react-native';

import DrawerLayout from 'react-native-drawer-layout';
import TabView from '../../components/tab-view';
import FilterTabsSettings from '../../components/filter-tabs-settings';
import PageIndicator from '../../components/page-indicator';
import PickItemList from '../../components/pick-item-list';

import Actions from '../../actions/scan-solution/order-picking';
import AsyncStorage from '@react-native-community/async-storage';

class SelectPickList extends StackScreen {
  titleKey = 'OrderPicking.SelectPickList.Title';
  homeButton = true;

  state = {
    loading: true,
    selectedIndex: null,
    index: 0,
    filters: null,
    editFilterId: null,
  };

  settingsDrawer = null;

  willScreenFocus = () => {
    if (!this.state.loading) {
      this.refresh();
    }
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    Actions.getFilters()
      .then((data) => {
        if (data.succeeded) {
          this.setState({
            filters: data.result,
            loading: false,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  refresh = () => {
    this.setState({loading: true}, this.loadData);
  };

  editFilter = (index) => {
    const {filters} = this.state;
    const editFilterId = index !== undefined ? filters[index].id : null;

    this.setState({editFilterId}, this.settingsDrawer.openDrawer);
  };

  saveFilter = (filter) =>
    new Promise((resolve, reject) => {
      if (filter.id < 0) {
        filter.id = 0;
      }

      Actions.filterSave(filter)
        .then((data) => {
          if (data.succeeded) {
            const index = this.state.filters.findIndex(
              (f) => f.id === filter.id,
            );

            if (index !== -1) {
              this.setState(
                update(this.state, {filters: {[index]: {$set: filter}}}),
                () => {
                  resolve();
                  this.refresh();
                },
              );
            } else {
              this.setState(
                update(this.state, {filters: {$push: [data.result]}}),
                () => {
                  resolve();
                  this.refresh();
                },
              );
            }
          } else {
            reject(data.errors);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    });

  deleteFilter = (filterId) =>
    new Promise((resolve, reject) => {
      Actions.filterDelete(filterId)
        .then((data) => {
          if (data.succeeded) {
            const index = this.state.filters.findIndex(
              (f) => f.id === filterId,
            );

            this.setState(
              update(this.state, {filters: {$splice: [[index, 1]]}}),
              resolve,
            );
          } else {
            reject(data.errors);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    });

  startSinglePicking = (pickList) => {
    this.props.navigation.navigate('PickingStep', {pickList});
  };

  render() {
    const {loading, filters, editFilterId} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <DrawerLayout
          locked={true}
          drawerWidth={400}
          drawerPosition={DrawerLayout.positions.Right}
          renderNavigationView={() => (
            <FilterTabsSettings
              filter={
                filters ? filters.find((f) => f.id === editFilterId) : null
              }
              onSave={this.saveFilter}
              onDelete={this.deleteFilter}
              onClose={() => this.settingsDrawer.closeDrawer()}
            />
          )}
          ref={(drawer) => (this.settingsDrawer = drawer)}>
          {loading ? (
            <PageIndicator />
          ) : (
            <TabView
              onAddPress={() => this.editFilter()}
              longPress={this.editFilter}>
              {filters.map((filter) => (
                <PickItemList
                  key={filter.id}
                  filterId={filter.id}
                  tabLabel={filter.name}
                  onSelect={this.startSinglePicking}
                />
              ))}
            </TabView>
          )}
        </DrawerLayout>
      </SafeAreaView>
    );
  }
}

export default connect(({locale: {strings}}) => ({strings}))(SelectPickList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
});
