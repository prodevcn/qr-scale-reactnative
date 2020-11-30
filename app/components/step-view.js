import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {Bar as ProgressBar} from 'react-native-progress';

function StepView({current, total, containerStyle}) {
  return (
    <View style={[{padding: 6, backgroundColor: '#0005'}, containerStyle]}>
      <ProgressBar
        progress={current / total}
        color="#070"
        borderWidth={0}
        width={null}
      />
    </View>
  );
}

StepView.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  containerStyle: PropTypes.object,
};

export default StepView;
