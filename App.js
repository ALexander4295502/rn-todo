/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Platform,
} from 'react-native';

import Footer from './Components/footer';
import Header from './Components/header';

export default class App extends Component<{}> {

  constructor(props){
    super(props);
    this.state = {
      value: "",
      items: []
    }
  }

  handleAddItem() {
    if(!this.state.value) return;
    const newItem = [
      ...this.state.items,
      {
        key: Date.now(),
        text: this.state.value,
        complete: false
      }
    ];
    this.setState({
      allComplete: false,
      items: newItem,
      value: ""
    });
  }

  handleToggleAllComplete(){
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map((item) => ({
      ...item,
      complete
    }));
    console.table(newItems);
    this.setState({
      items: newItems,
      allComplete: complete
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          value={this.state.value}
          onAddItem={this.handleAddItem.bind(this)}
          onChange={(value) => this.setState({value})}
          onToggleAllComplete={this.handleToggleAllComplete.bind(this)}
        />
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
