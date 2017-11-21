import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput
} from 'react-native';

import {
  MKButton,
  MKColor,
  getTheme
} from 'react-native-material-kit';

export default class Header extends Component {

  constructor(props){
    super(props);
    this.state={
      isDateTimePickerVisible: false,
    };
  }

  render() {
    const fontColor= {
      color: this.props.primaryColor
    };
    const FlatButton = MKButton.flatButton()
      .withText("Select date")
      .build();

    // TODO: here we use TextInput instead of MKTextInput because of:
    // https://github.com/xinthink/react-native-material-kit/issues/369
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={this.props.onToggleAllComplete}
          style={styles.toggleButton}
        >
          <Text
            style={[styles.toggleIcon, {color: this.props.primaryColor}]}
          >
            {String.fromCharCode(10003)}
          </Text>
        </TouchableOpacity>
        <View style={styles.input}>
          <TextInput
            value={this.props.value}
            onChangeText={this.props.onChange}
            onSubmitEditing={this.props.onAddItem}
            placeholder="What needs to be done?"
            blurOnSubmit={true}
            focusOnSubmit={false}
            returnKeyTupe="done"
            style={styles.textInput}
            clearButtonMode="while-editing"
          />
          <MKButton
            backgroundColor={MKColor.Transparent}
            maskColor={getTheme().bgPlain}
            rippleColor={getTheme().bgPlain}
            shadowAniEnabled={false}
            onPress={this.props.showDatePicker}
            style={styles.datePickerButton}
          >
            <Text pointerEvents="none"
                  style={{color: this.props.primaryColor, fontWeight: 'bold'}}>
              {this.props.showDatePickerFlag ?
                "Selecting" :
                this.props.showDateValue === "" ?
                  "When ?" : this.props.showDateValue
              }
            </Text>
          </MKButton>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: 'center'
  },
  toggleIcon: {
    fontSize: 30,
  },
  toggleButton: {
    marginHorizontal: 10,
  },
  datePickerText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  textInput: {
    height: 30,
    maxWidth: 200,
    flex: 1,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  datePickerButton: {
    height: 35,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  }
});