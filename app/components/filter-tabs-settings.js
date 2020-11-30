import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, View, Text, Alert} from 'react-native';
import update from 'immutability-helper';
import _ from 'lodash';

import Actions from '../actions/scan-solution/order-picking';

import IndicatorButton from './indicator-button';
import Picker from '../components/picker';
import TextField from 'react-native-material-textfield/src/components/field';
import PageIndicator from './page-indicator';

class FilterTabsSettings extends React.PureComponent {
  state = {
    isNew: true,
    isSaving: false,
    isDeleting: false,
    countries: [],
    warehouses: [],
    stores: [],
    shops: [],
    modalVisible: false,
    fetchedStoreId: null,
  };

  static getDerivedStateFromProps(props, state) {
    if (!_.isEqual(props.filter, state.oldFilter)) {
      return {
        oldFilter: _.cloneDeep(props.filter),
        model: _.cloneDeep(props.filter || FilterTabsSettings.getBaseModel()),
        isNew: !props.filter,
      };
    } else {
      return null;
    }
  }

  static getBaseModel() {
    return {
      id: Math.floor(Math.random() * 100000 + 1) * -1,
      name: '',
      filter: {
        countryId: null,
        warehouseId: null,
        storeId: null,
        shopId: null,
      },
    };
  }

  componentDidMount() {
    Actions.getCountries().then((countries) => {
      this.setState({countries: FilterTabsSettings.mapList(countries)});
    });

    Actions.getWarehouses().then((warehouses) => {
      this.setState({warehouses: FilterTabsSettings.mapList(warehouses)});
    });

    Actions.getStores().then((stores) => {
      this.setState({stores: FilterTabsSettings.mapList(stores)});
    });
  }

  loadShops = (storeId) => {
    Actions.getShopsByStore(storeId).then((data) => {
      if (data.succeeded) {
        this.setState({
          shops: FilterTabsSettings.mapList(data.result),
          fetchedStoreId: storeId,
        });
      }
    });
  };

  static mapList(list) {
    return list.map((item) => ({...item, label: item.name, value: item.id}));
  }

  setModelData = (property, value) => {
    if (property.includes('.')) {
      const properties = property.split('.');
      this.setState(
        update(this.state, {
          model: {[properties[0]]: {[properties[1]]: {$set: value}}},
        }),
        this.modelUpdated,
      );
    } else {
      this.setState(
        update(this.state, {model: {[property]: {$set: value}}}),
        this.modelUpdated,
      );
    }
  };

  modelUpdated = () => {
    const {fetchedStoreId} = this.state;
    const {storeId} = this.state.model.filter;

    if (storeId && storeId !== fetchedStoreId) {
      this.loadShops(storeId);
    }
  };

  save = () => {
    this.setState({isSaving: true}, () =>
      this.props.onSave(this.state.model).then(() =>
        this.setState(
          {
            isSaving: false,
            model: _.cloneDeep(FilterTabsSettings.getBaseModel()),
          },
          this.props.onClose,
        ),
      ),
    );
  };

  delete = () => {
    const {strings} = this.props;

    Alert.alert(
      strings.MobileUI['FilterTabsSettings.DeleteAlert.Title'] ||
        'Locale Error',
      strings.MobileUI['FilterTabsSettings.DeleteAlert.Body'] || 'Locale Error',
      [
        {
          text:
            strings.MobileUI['FilterTabsSettings.DeleteAlert.Buttons.Delete'] ||
            'Locale Error',
          onPress: () =>
            this.setState({isDeleting: true}, () =>
              this.props
                .onDelete(this.props.filter.id)
                .then(() =>
                  this.setState({isDeleting: false}, this.props.onClose),
                ),
            ),
        },
        {
          text:
            strings.MobileUI['FilterTabsSettings.DeleteAlert.Buttons.Cancel'] ||
            'Locale Error',
          style: 'cancel',
        },
      ],
    );
  };

  render() {
    const {strings} = this.props;
    const {model, isSaving, isDeleting, isNew, fetchedStoreId} = this.state;
    const {countries, warehouses, stores, shops} = this.state;
    const loading = !countries.length || !warehouses.length || !stores.length;

    return loading ? (
      <PageIndicator />
    ) : (
      <View style={styles.container}>
        <View style={styles.headContainer}>
          <Text style={styles.titleText}>
            {isNew
              ? strings.MobileUI['FilterTabsSettings.Title.NewFilter'] ||
                'Locale Error'
              : `${
                  strings.MobileUI['FilterTabsSettings.Title.EditFilter'] ||
                  'Locale Error'
                } (${this.props.filter.name})`}
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <TextField
            label={
              strings.MobileUI['FilterTabsSettings.Fields.Name'] ||
              'Locale Error'
            }
            value={model.name}
            containerStyle={{marginHorizontal: 5}}
            textColor="#fff"
            tintColor="#fffa"
            baseColor="#fff9"
            labelHeight={12}
            onChangeText={(val) => this.setModelData('name', val)}
          />

          <View style={{flexDirection: 'row'}}>
            <Picker
              placeholderText={
                strings.MobileUI['FilterTabsSettings.Fields.Country'] ||
                'Locale Error'
              }
              items={countries}
              disabled={!countries.length}
              onValueChange={(val) =>
                this.setModelData('filter.countryId', val)
              }
              value={model.filter.countryId}
            />

            <Picker
              placeholderText={
                strings.MobileUI['FilterTabsSettings.Fields.Warehouse'] ||
                'Locale Error'
              }
              items={warehouses}
              disabled={!warehouses.length}
              onValueChange={(val) =>
                this.setModelData('filter.warehouseId', val)
              }
              value={model.filter.warehouseId}
            />
          </View>

          <View style={{flexDirection: 'row'}}>
            <Picker
              placeholderText={
                strings.MobileUI['FilterTabsSettings.Fields.Store'] ||
                'Locale Error'
              }
              items={stores}
              disabled={
                !stores.length || model.filter.storeId !== fetchedStoreId
              }
              onValueChange={(val) => this.setModelData('filter.storeId', val)}
              value={model.filter.storeId}
            />

            <Picker
              placeholderText={
                strings.MobileUI['FilterTabsSettings.Fields.Shop'] ||
                'Locale Error'
              }
              items={shops}
              disabled={!shops.length || !model.filter.storeId}
              onValueChange={(val) => this.setModelData('filter.shopId', val)}
              value={model.filter.shopId}
            />
          </View>
        </View>
        <View style={styles.footContainer}>
          <View style={{flexDirection: 'row'}}>
            <IndicatorButton
              raised
              primary
              text={
                strings.MobileUI['FilterTabsSettings.Buttons.Save'] ||
                'Locale Error'
              }
              containerStyle={{paddingHorizontal: 40}}
              disabled={!model.name || !model.name.trim().length || isDeleting}
              loading={isSaving}
              onPress={this.save}
            />
            <IndicatorButton
              text={
                strings.MobileUI['FilterTabsSettings.Buttons.Cancel'] ||
                'Locale Error'
              }
              disabled={isSaving || isDeleting}
              containerStyle={{paddingHorizontal: 20, marginLeft: 20}}
              onPress={this.props.onClose}
            />
          </View>

          {!isNew ? (
            <IndicatorButton
              text=""
              icon="delete"
              loading={isDeleting}
              disabled={isSaving}
              containerStyle={{paddingHorizontal: 0, paddingLeft: 10}}
              onPress={this.delete}
            />
          ) : null}
        </View>
      </View>
    );
  }
}

FilterTabsSettings.propTypes = {
  filter: PropTypes.object,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
  onClose: PropTypes.func,
};

export default connect(({locale: {strings}}) => ({strings}))(
  FilterTabsSettings,
);

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
    justifyContent: 'space-between',
  },
});
