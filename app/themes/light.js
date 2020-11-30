import Color from 'color';
import {COLOR} from 'react-native-material-ui';

export default {
  iconSet: 'MaterialCommunityIcons',
  palette: {
    primaryColor: COLOR.blue500,
    accentColor: COLOR.red500,
    primaryTextColor: Color(COLOR.black).alpha(0.87).toString(),
    secondaryTextColor: Color(COLOR.black).alpha(0.54).toString(),
    alternateTextColor: COLOR.white,
    canvasColor: COLOR.white,
    borderColor: Color(COLOR.black).alpha(0.12).toString(),
    disabledColor: Color(COLOR.black).alpha(0.38).toString(),
    disabledTextColor: Color(COLOR.black).alpha(0.26).toString(),
    activeIcon: Color(COLOR.black).alpha(0.54).toString(),
    inactiveIcon: Color(COLOR.black).alpha(0.38).toString(),
  },
};
