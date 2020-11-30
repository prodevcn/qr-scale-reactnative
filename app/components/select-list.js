import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {TouchableOpacity, RefreshControl} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NoDataMessageView from './no-data-message-view';
import {ActionButton} from 'react-native-material-ui';

class SelectList extends React.PureComponent {
  state = {
    refreshing: false,
  };

  render() {
    const {data, checkbox, refreshing, title, arrow} = this.props;
    const {style, itemStyle, itemOuterStyle} = this.props;
    const {idKey = 'id', titleKey = 'title', noDataMessageKey} = this.props;

    return data && data.length ? (
      <View style={{flex: 1, backgroundColor: '#f000'}}>
        <FlatList
          style={[styles.list, style]}
          data={data}
          extraData={this.state}
          keyExtractor={(item) =>
            Number.isInteger(item[idKey]) ? item[idKey].toString() : item[idKey]
          }
          refreshControl={
            this.props.onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.props.onRefresh}
              />
            ) : null
          }
          renderItem={({item}) => {
            const titleValue = title ? title(item) : item[titleKey];

            return (
              <View style={itemOuterStyle}>
                <TouchableOpacity onPress={() => this.props.onPressItem(item)}>
                  <View
                    style={[
                      styles.item,
                      item.bgColor ? styles[item.bgColor] : null,
                      typeof itemStyle === 'function'
                        ? itemStyle(item)
                        : itemStyle,
                    ]}>
                    {checkbox ? (
                      <View style={[styles.iconView, styles.leftIconView]}>
                        <Icon
                          name={
                            item.checked
                              ? 'checkbox-marked-outline'
                              : 'checkbox-blank-outline'
                          }
                          size={18}
                          color="#fffe"
                        />
                      </View>
                    ) : null}
                    {React.isValidElement(titleValue) ? (
                      <View style={[styles.itemTextWrapper]}>{titleValue}</View>
                    ) : (
                      <Text style={styles.itemText}>{titleValue}</Text>
                    )}
                    {arrow ? (
                      <View style={[styles.iconView, styles.rightIconView]}>
                        <Icon name="chevron-right" size={22} color="#fff9" />
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          onEndReached={this.props.onEndReached || null}
          onEndReachedThreshold={this.props.onEndReachedThreshold || null}
        />
        <ActionButton
          icon="refresh"
          size={40}
          rippleColor="#000"
          onPress={this.props.onRefresh}
          style={{container: {backgroundColor: '#ccc'}, icon: {color: '#000e'}}}
        />
      </View>
    ) : (
      <NoDataMessageView messageKey={noDataMessageKey} />
    );
  }
}

SelectList.propTypes = {
  data: PropTypes.array,
  checkbox: PropTypes.bool,
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
  title: PropTypes.func,
  titleKey: PropTypes.string,
  arrow: PropTypes.bool,
  style: PropTypes.object,
  itemStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  itemOuterStyle: PropTypes.any,
  itemDisabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  noDataMessageKey: PropTypes.string.isRequired,
  // noDataMessageKey: PropTypes.string,
  idKey: PropTypes.string,
  onEndReached: PropTypes.func,
  onEndReachedThreshold: PropTypes.number,
};

export default SelectList;

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
  },
  itemTextWrapper: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  itemText: {
    flex: 1,
    lineHeight: 50,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#fffe',
  },
  iconView: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  leftIconView: {
    marginRight: -16,
  },
  rightIconView: {
    marginLeft: -16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#fff2',
    fontSize: 30,
  },
  red: {
    backgroundColor: '#a005',
  },
  green: {
    backgroundColor: '#343',
  },
  blue: {
    backgroundColor: '#334',
  },
});
