import React from 'react';
import {StyleSheet, View} from 'react-native';
import PickerSelect from 'react-native-picker-select';

export default function ({placeholderText, ...props}) {
  return (
    <View style={[{flex: 1}, props.disabled ? {opacity: 0.5} : null]}>
      <PickerSelect
        placeholder={
          placeholderText
            ? {
                label: placeholderText,
                value: null,
              }
            : undefined
        }
        style={{inputIOS: styles.select}}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  select: {
    fontSize: 14,
    marginHorizontal: 5,
    paddingHorizontal: 0,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#fff9',
    color: '#fff9',
  },
});
