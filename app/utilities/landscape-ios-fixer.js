import {Dimensions, Platform, StatusBar} from 'react-native';

export default function () {
  const dimensionFixer = ({width, height}) => {
    if (Platform.OS === 'ios') {
      StatusBar.setHidden(true);
      // StatusBar.setHidden(width >= height);
    }
  };

  Dimensions.addEventListener('change', ({screen}) => dimensionFixer(screen));

  dimensionFixer(Dimensions.get('screen'));
}
