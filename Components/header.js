import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  DatePickerIOS,
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

  shouldComponentUpdate(nextProps, nextState){
    return false;
  }

  render() {
    const MK_TextInput = MKTextField.textfieldWithFloatingLabel()
      .withPlaceholder("What needs to be done?")
      .build();

    // TODO: here we use 'shouldComponentUpdate' to make sure MK_TextInput works
    // (avoid keeping re-rendering) so we introduce clear button to clear text
    // instead of clearing it automatically once submitting the text
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={this.props.onToggleAllComplete}
        >
          <Text
            style={[styles.toggleIcon, {color: this.props.primaryColor}]}
          >
            {String.fromCharCode(10003)}
          </Text>
        </TouchableOpacity>
        <MK_TextInput
          text={this.props.value}
          onChangeText={this.props.onChange}
          onSubmitEditing={this.props.onAddItem}
          placeholder="What needs to be done?"
          blurOnSubmit={true}
          focusOnSubmit={false}
          returnKeyTupe="done"
          style={styles.input}
          clearButtonMode="while-editing"
        />
        <DatePickerIOS />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  toggleIcon: {
    fontSize: 30,
  },
  input: {
    flex: 1,
    marginLeft: 16,
    height: 50,
    marginBottom: 12,
  }
});