import {createStackNavigator} from 'react-navigation-stack';
// import {createAppContainer} from 'react-navigation';
import StoreList from '../screens/purchase/store-list';
import OrderFilter from '../screens/purchase/order-filter';
import OrderList from '../screens/purchase/order-list';
import OrderProcess from '../screens/purchase/order-process';
import OrderLineProcess from '../screens/purchase/order-line-process';
import AddLineScanProduct from '../screens/purchase/add-line-scan-product';
import AddLineProductPreview from '../screens/purchase/add-line-product-preview';
import CreateOrder from '../screens/purchase/create-order';
// import React, {Component} from 'react';
export default (navigationOptions) =>
  createStackNavigator(
    {
      StoreList: StoreList,
      OrderFilter: OrderFilter,
      OrderList: OrderList,
      OrderProcess: OrderProcess,
      OrderLineProcess: OrderLineProcess,
      AddLineScanProduct: AddLineScanProduct,
      AddLineProductPreview: AddLineProductPreview,
      CreateOrder: CreateOrder,
    },
    {
      initialRouteName: 'StoreList',
      navigationOptions,
    },
  );
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
//     <Stack.Navigator initialRouteName="StoreList">
//       <Stack.Screen name="StoreList" component={StoreList} options={option} />
//       <Stack.Screen
//         name="OrderFilter"
//         component={OrderFilter}
//         options={option}
//       />
//       <Stack.Screen name="OrderList" component={OrderList} options={option} />
//       <Stack.Screen
//         name="OrderProcess"
//         component={OrderProcess}
//         options={option}
//       />
//       <Stack.Screen
//         name="OrderLineProcess"
//         component={OrderLineProcess}
//         options={option}
//       />
//       <Stack.Screen
//         name="AddLineScanProduct"
//         component={AddLineScanProduct}
//         options={option}
//       />
//       <Stack.Screen
//         name="AddLineProductPreview"
//         component={AddLineProductPreview}
//         options={option}
//       />
//       <Stack.Screen
//         name="CreateOrder"
//         component={CreateOrder}
//         options={option}
//       />
//     </Stack.Navigator>
//   );
// }

// export default class OrderPickingNavigator extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return <MainStack />;
//   }
// }
