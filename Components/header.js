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

import {Dropdown} from 'react-native-material-dropdown';

export default class Header extends Component {

  constructor(props){
    super(props);
    this.state={
      isDateTimePickerVisible: false,
    };
  }

  render() {
    let data = [
      {value: 'None'},
      {value: 'Life'},
      {value: 'Work'},
    ];
    // TODO: here we use TextInput instead of MKTextInput because of:
    // https://github.com/xinthink/react-native-material-kit/issues/369
    return (
      <View style={styles.header}>
        <View style={styles.dropDownWrap}>
          <Dropdown
            label="todo type"
            data={data}
            dropdownPosition={-4.3}
            value={this.props.todoType}
            onChangeText={this.props.todoTypeChange}
          />
        </View>
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
            returnKeyType='done'
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
    alignItems: 'center',
    flex: 0.08,
  },
  dropDownWrap: {
    flex: 0.35,
    marginHorizontal: 10,
    marginBottom: 20,
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  datePickerButton: {
    height: 35,
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  }
});