import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {TouchableOpacity, RefreshControl} from 'react-native';
// import {} from '@mdi/svg/svg/';

export default class MultiSelectList extends React.PureComponent {
  state = {
    selected: new Map(),
    refreshing: false,
  };

  refresh = () => {
    this.setState({refreshing: true});
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 2000);
  };

  onPressItem = (id) => {
    this.setState((state) => {
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id));
      return {selected};
    }, this.notifySelectedChanged);
  };

  notifySelectedChanged = () => {
    this.props.onSelectedChanged(this.state.selected);
  };

  render() {
    const {data} = this.props;
    const {refreshing, selected} = this.state;

    return (
      <FlatList
        style={styles.list}
        data={data}
        extraData={this.state}
        keyExtractor={({id}) => (Number.isInteger(id) ? id.toString() : id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this.refresh} />
        }
        renderItem={({item}) => (
          <ListItem
            id={item.id}
            title={item.title}
            selected={!!selected.get(item.id)}
            onPressItem={this.onPressItem}
          />
        )}
      />
    );
  }
}

class ListItem extends React.PureComponent {
  render() {
    const {id, title, selected} = this.props;

    return (
      <TouchableOpacity onPress={() => this.props.onPressItem(id)}>
        <View style={styles.item}>
          <Text style={styles.itemSelect}>Select</Text>
          <Text style={styles.itemText}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
  },
  itemSelect: {
    flex: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  itemText: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    borderWidth: 1,
    color: '#eee',
  },
  text: {
    color: '#f00',
  },
});
