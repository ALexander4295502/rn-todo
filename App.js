/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Platform
} from 'react-native';

import Footer from './Components/footer';
import Header from './Components/header';

export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.container}>
        <Header/>
        <View style={styles.content}>

        </View>
        <Footer/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    ...Platform.select({
      ios: { paddingTop: 30 }
    })
  },
  content: {
    flex: 1
  }
});
