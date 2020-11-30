import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import IndicatorButton from './indicator-button';

function LocationView(props) {
  const {strings, title} = props;
  const {currentLocation, selectedLocation, recommendedLocation} = props;
  const {targetLocation, availableLocations} = props;
  const location = currentLocation || selectedLocation || recommendedLocation;

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        {title ||
          strings.MobileUI[
            selectedLocation
              ? 'LocationView.SelectedLocation.Title'
              : 'LocationView.Title'
          ] ||
          'Locale Error'}
      </Text>

      {selectedLocation ||
      (!targetLocation &&
        (!availableLocations || availableLocations.length < 2)) ? (
        <View style={{flexDirection: 'row'}}>
          <View style={styles.lineWrapper}>
            <Text style={[styles.lineValue, styles.lineValueText]}>
              {location
                ? `${location.locationCode} (${location.quantity})`
                : availableLocations && availableLocations.length > 0
                ? `${availableLocations[0].locationCode} (${availableLocations[0].quantity})`
                : strings.MobileUI['LocationView.Fields.NoLocationFound'] ||
                  'Locale Error'}
            </Text>
          </View>

          {props.onChangePress ? (
            <IndicatorButton
              text=""
              icon="pencil"
              onPress={props.onChangePress}
              style={{marginLeft: 10}}
              containerStyle={styles.changeButton}
              textStyle={styles.changeButtonText}
            />
          ) : null}
        </View>
      ) : (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {location ? (
            <View style={[{flex: 1}, styles.lineWrapper]}>
              <Text style={[styles.lineLabel, styles.lineLabelText]}>
                {strings.MobileUI[
                  'LocationView.Fields.' +
                    (currentLocation
                      ? 'CurrentLocation'
                      : 'RecommendedLocation')
                ] || 'Locale Error'}
              </Text>

              <ScrollView style={{maxHeight: 50}}>
                <Text style={[styles.lineValue, styles.lineValueText]}>
                  {location.locationCode} ({location.quantity})
                </Text>
              </ScrollView>
            </View>
          ) : null}

          <View style={[{flex: 1}, styles.lineWrapper]}>
            <Text style={[styles.lineLabel, styles.lineLabelText]}>
              {strings.MobileUI[
                'LocationView.Fields.' +
                  (availableLocations ? 'AvailableLocations' : 'TargetLocation')
              ] || 'Locale Error'}
            </Text>

            <ScrollView style={{maxHeight: 50}}>
              <Text style={[styles.lineValue, styles.lineValueText]}>
                {availableLocations
                  ? availableLocations
                      .map((l) => `${l.locationCode} (${l.quantity})`)
                      .join(', ')
                  : targetLocation.locationCode}
              </Text>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

LocationView.propTypes = {
  targetLocation: PropTypes.object,
  currentLocation: PropTypes.object,
  selectedLocation: PropTypes.object,
  recommendedLocation: PropTypes.object,
  availableLocations: PropTypes.array,
  showChangeButton: PropTypes.bool,
  onChangePress: PropTypes.func,
  title: PropTypes.string,
};

export default connect(({locale: {strings}}) => ({strings}))(LocationView);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  titleText: {
    color: '#fff5',
    fontSize: 18,
  },
  lineWrapper: {
    flexDirection: 'column',
    paddingVertical: 4,
  },
  lineLabel: {},
  lineLabelText: {
    color: '#fff5',
    fontSize: 12,
  },
  lineValue: {},
  lineValueText: {
    color: '#fffc',
    fontSize: 16,
  },
  changeButton: {
    height: 40,
    paddingHorizontal: 15,
    paddingRight: 5,
    position: 'relative',
    bottom: 5,
  },
  changeButtonText: {
    color: '#fff5',
    fontSize: 14,
  },
});
