import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text
} from 'react-native';

import {
  MKTextField,
} from 'react-native-material-kit';

export default class Header extends Component {

  constructor(props){
    super(props);
  }

  render() {

    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={this.props.onToggleAllComplete}
        >
          <Text style={styles.toggleIcon}>
            {String.fromCharCode(10003)}
          </Text>
        </TouchableOpacity>
        <TextInput
          value={this.props.value}
          onChangeText={this.props.onChange}
          onSubmitEditing={this.props.onAddItem}
          placeholder="What needs to be done?"
          blurOnSubmit={true}
          focusOnSubmit={false}
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
  toggleIcon: {
    fontSize: 30,
    color: "#ccc"
  },
  input: {
    flex: 1,
    marginLeft: 16,
    height: 50,
  }
});