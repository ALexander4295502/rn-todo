import React, { Component } from 'react';
import {
  NavigatorIOS
} from 'react-native';
import MainPage from "./Components/mainPage";


export default class App extends Component<{}> {

  render() {
    return (
      <NavigatorIOS
        style={{
          flex: 1
        }}
        initialRoute={{
          title: 'Main Menu',
          component: MainPage
        }}
        navigationBarHidden={true}
        interactivePopGestureEnabled={true}
      />
    );
  }
}