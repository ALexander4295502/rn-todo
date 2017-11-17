import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TextInput
} from 'react-native';

export default class Header extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <View style={styles.header}>
        <TextInput
          value={this.props.value}
          onChangeText={this.props.onChange}
          onSubmitEditing={this.props.onAddItem}
          placeholder="What needs to be done?"
          blurOnSubmit={false}
          returnKeyTupe="done"
          style={styles.input}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  input: {
    flex: 1,
    height: 50,
  }
});