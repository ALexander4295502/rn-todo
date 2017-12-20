import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Dimensions
} from 'react-native';
import PropTypes from "prop-types";

import {Dropdown} from 'react-native-material-dropdown';
import DateTimePicker from 'react-native-modal-datetime-picker';

import moment from 'moment';

import {
  FormInput,
  FormLabel,
  CheckBox,
  FormValidationMessage
} from 'react-native-elements';

import {
  MKButton,
  getTheme
} from 'react-native-material-kit';

const {width, height} = Dimensions.get('window');

export default class TodoForm extends Component {

  static propTypes = {
    onAddItem: PropTypes.func,
    closeModal: PropTypes.func,
    onSaveEdit: PropTypes.func,
    onCancelEdit: PropTypes.func,
    editingItem: PropTypes.object,
    showEditing: PropTypes.bool
  }

  constructor(props){
    super(props);

    this.state = {
      showDateValue: this.props.showEditing ? this.props.editingItem.ddl : "",
      showDatePicker: false,
      TodoType: this.props.showEditing ? this.props.editingItem.type : "None",
      TodoText: this.props.showEditing ? this.props.editingItem.text : "",
      error: ""
    };

    this.handleShowTimePicker = this.handleShowTimePicker.bind(this);
    this.handleDatePicked = this.handleDatePicked.bind(this);
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
    this.handleTodoTypeChange = this.handleTodoTypeChange.bind(this);

  }

  handleShowTimePicker() {
    this.setState({
      showDatePicker: true,
      showDateValue: ""
    });
  }

  formatDate(date) {
    return date === null ?
      "" : moment(date).format('MM-DD-YYYY h:mm:ss a');
  }

  hideDateTimePicker() {
    this.setState({showDatePicker: false});
  }

  handleDatePicked(date) {
    this.setState({
      showDateValue: this.formatDate(date)
    });
    this.hideDateTimePicker();
  }

  handleTodoTypeChange(type) {
    this.setState({
      TodoType: type
    });
  }

  formValidateCheck(){
    if(this.state.TodoText === "") {
      this.formInput.shake();
      this.showErrorMessage("This field is required!");
      return false;
    } else {
      return true;
    }
  }

  submitTodo = () => {
    if(this.props.showEditing) {
      this.props.onSaveEdit({
        type: this.state.TodoType,
        text: this.state.TodoText,
        ddl: this.state.showDateValue
      });
    } else {
      this.props.onAddItem(
        {
          showDateValue: this.state.showDateValue,
          text: this.state.TodoText,
          todoType: this.state.TodoType
        }
      )
    }
  };

  handleCloseModal = () => {
    if(this.props.showEditing){
      this.props.onCancelEdit();
    } else {
      this.props.closeModal();
    }
  }

  onChangeText = (text) => {
    this.setState({
      TodoText: text
    });

    if(this.state.error !== "") {
      this.setState({
        error: ""
      })
    }
  };

  showErrorMessage(err) {
    this.setState({
      error: err
    })
  }

  render() {

    let data = [{
      value: 'None',
    }, {
      value: 'Life',
    }, {
      value: 'Work',
    }];

    const SaveButton = MKButton.coloredButton()
      .withText('SAVE')
      .withOnPress(() => {
        if(this.formValidateCheck()){
          this.submitTodo()
        }
      })
      .withStyle(styles.button)
      .build();

    const CancelButton = MKButton.coloredButton()
      .withText('CANCEL')
      .withOnPress(() => {
        this.handleCloseModal();
      })
      .withStyle(styles.button)
      .build();

    return (
      <View>
        <FormLabel
          containerStyle={styles.formLabel}
          labelStyle={{
            color: getTheme().primaryColor,
            fontSize: 15
          }}
        >
          Todo Name
        </FormLabel>
        <FormInput
          ref={ref => this.formInput = ref}
          containerRef="containerRefYOYO"
          textInputRef="textInputRef"
          placeholder="Please enter your todo here"
          containerStyle={styles.formInput}
          value={this.state.TodoText}
          onChangeText={this.onChangeText}
        />
        {this.state.error === "" ? null :
          (
            <FormValidationMessage>
              {this.state.error}
            </FormValidationMessage>
          )
        }
        <FormLabel
          containerStyle={styles.formLabel}
          labelStyle={{
            color: getTheme().primaryColor,
            fontSize: 15
          }}
        >
          Todo Type
        </FormLabel>
        <Dropdown
          label=""
          labelHeight={10}
          data={data}
          value={this.state.TodoType}
          dropdownPosition={-4.3}
          containerStyle={styles.dropDownContainer}
          animationDuration={100}
          onChangeText={this.handleTodoTypeChange}
        />

        <FormLabel
          containerStyle={styles.formLabel}
          labelStyle={{
            color: getTheme().primaryColor,
            fontSize: 15
          }}
        >
          Todo DDL
        </FormLabel>
        <CheckBox
          center
          checkedIcon="clock-o"
          uncheckedIcon="clock-o"
          title={this.state.showDateValue === "" ? "When is the DDL?" : this.state.showDateValue}
          textStyle={{color: getTheme().primaryColor}}
          checkedColor="#4a6da7"
          containerStyle={styles.checkboxStyle}
          onPress={this.handleShowTimePicker}
        />
        <View style={styles.buttonWrap}>
          <SaveButton/>
          <CancelButton/>
        </View>
        <DateTimePicker
          isVisible={this.state.showDatePicker}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode="datetime"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  buttonWrap: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  dropDownContainer: {
    width: 100,
    marginLeft: 20,
    marginBottom: -5
  },
  formLabel: {
    marginLeft: 0,
  },
  formInput: {
    marginLeft: 20,
  },
  button: {
    marginVertical: 10,
    marginHorizontal: 20,
    height: 0.05 * height,
    width: 0.2 * width,
  },
  checkboxStyle: {
    marginTop: 10,
  }
});