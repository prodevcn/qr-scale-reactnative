import Color from 'color';
import {COLOR} from 'react-native-material-ui';

export default {
  iconSet: 'MaterialCommunityIcons',
  palette: {
    primaryColor: COLOR.blue500,
    accentColor: COLOR.red500,
    primaryTextColor: Color(COLOR.white).alpha(0.87).toString(),
    secondaryTextColor: Color(COLOR.white).alpha(0.54).toString(),
    alternateTextColor: COLOR.black,
    canvasColor: COLOR.black,
    borderColor: Color(COLOR.white).alpha(0.12).toString(),
    disabledColor: Color(COLOR.white).alpha(0.38).toString(),
    disabledTextColor: Color(COLOR.white).alpha(0.26).toString(),
    activeIcon: Color(COLOR.white).alpha(0.54).toString(),
    inactiveIcon: Color(COLOR.white).alpha(0.38).toString(),
  },
  button: {
    container: {
      borderRadius: 5,
    },
    text: {
      color: Color(COLOR.white).alpha(0.87).toString(),
    },
  },
  buttonRaised: {
    container: {
      backgroundColor: COLOR.grey900,
      borderColor: Color(COLOR.black).alpha(0.05).toString(),
    },
    text: {
      color: Color(COLOR.white).alpha(0.87).toString(),
    },
  },
  // typography: {
  //   buttons: {
  //     color: Color(COLOR.white)
  //       .alpha(0.87)
  //       .toString()
  //   }
  // }
};
