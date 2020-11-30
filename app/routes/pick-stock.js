import {createStackNavigator} from 'react-navigation-stack';
// import {createAppContainer} from 'react-navigation';
import ScanProduct from '../screens/pick-stock/scan-product';
import ProductLocations from '../screens/pick-stock/product-locations';
import PickStockDetail from '../screens/pick-stock/pick-stock-detail';
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
//     <Stack.Navigator initialRouteName="ScanProduct">
//       <Stack.Screen
//         name="ScanProduct"
//         component={ScanProduct}
//         options={option}
//       />
//       <Stack.Screen
//         name="ProductLocations"
//         component={ProductLocations}
//         options={option}
//       />
//       <Stack.Screen
//         name="PickStockDetail"
//         component={PickStockDetail}
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

export default (navigationOptions) =>
  createStackNavigator(
    {
      ScanProduct: {screen: ScanProduct},
      ProductLocations: {screen: ProductLocations},
      PickStockDetail: {screen: PickStockDetail},
    },
    {
      initialRouteName: 'ScanProduct',
      navigationOptions,
    },
  );
