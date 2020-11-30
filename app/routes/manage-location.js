import {createStackNavigator} from 'react-navigation-stack';
import ScanLocation from '../screens/manage-location/scan-location';
import LocationProducts from '../screens/manage-location/location-products';
import AddProductToLocation from '../screens/manage-location/add-product-to-location';
import PickStockDetail from '../screens/pick-stock/pick-stock-detail';

export default (navigationOptions) =>
  createStackNavigator(
    {
      ScanLocation: ScanLocation,
      LocationProducts: LocationProducts,
      PickStockDetail: PickStockDetail,
      AddProductToLocation: AddProductToLocation,
    },
    {
      initialRouteName: 'ScanLocation',
      navigationOptions,
    },
  );

// import {createStackNavigator} from '@react-navigation/stack';
// import {createAppContainer} from 'react-navigation';
// import ScanLocation from '../screens/manage-location/scan-location';
// import LocationProducts from '../screens/manage-location/location-products';
// import AddProductToLocation from '../screens/manage-location/add-product-to-location';
// import PickStockDetail from '../screens/pick-stock/pick-stock-detail';
// import React, {Component} from 'react';
// const Stack = createStackNavigator();
// const option = {
//   headerStyle: {
//     backgroundColor: '#111',
//     height: 45,
//   },
//   headerTintColor: '#aaa',
// };
// function MainStack(props) {
//   return (
//     <Stack.Navigator initialRouteName="ScanLocation">
//       <Stack.Screen
//         name="ScanLocation"
//         component={ScanLocation}
//         options={option}
//       />
//       <Stack.Screen
//         name="LocationProducts"
//         component={LocationProducts}
//         options={option}
//       />
//       <Stack.Screen
//         name="PickStockDetail"
//         component={PickStockDetail}
//         options={option}
//       />
//       <Stack.Screen
//         name="AddProductToLocation"
//         component={AddProductToLocation}
//         options={option}
//       />
//     </Stack.Navigator>
//   );
// }

// export default class PickStockNavigator extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return <MainStack />;
//   }
// }
