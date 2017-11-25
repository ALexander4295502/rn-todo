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
  Keyboard,
  AsyncStorage,
  FlatList,
  Text
} from 'react-native';

import {
  MKSpinner,
  setTheme,
  getTheme,
  MKColor
} from 'react-native-material-kit';

import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import PushNotification from 'react-native-push-notification';
import Icon from 'react-native-vector-icons/Ionicons';

import Footer from './Components/footer';
import Header from './Components/header';
import Row from './Components/row';

const filterItems = (items, statusFilter, typeFilter) => {
  if(items === null) return [];
  return items.filter((item) => {
    if (typeFilter === 'None') return true;
    else return item.type === typeFilter;
  }).filter((item) => {
    if(statusFilter === 'ALL') return true;
    if(statusFilter === 'COMPLETED') return item.complete;
    if(statusFilter === 'ACTIVE') return !item.complete;
  })
};

setTheme({
  primaryColor: "#fd8ebe",
  primaryColorRGB: MKColor.RGBPink,
  accentColor: MKColor.Pink,
  accentColorRGB: MKColor.RGBPink,
});

const theme = getTheme();

export default class App extends Component<{}> {

  constructor(props){
    console.ignoredYellowBox = ['Remote debugger'];
    super(props);
    this.state = {
      loading: true,
      value: "",
      items: [],
      allComplete: false,
      dataSource: [],
      showDatePicker: false,
      statusFilter: 'ALL',
      showTimePicker: false,
      showDateValue: "",
      visible: false,
      todoType: 'None',
      typeFilter: 'None',
    };
    this.handleToggleComplete = this.handleToggleComplete.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleStatusFilter = this.handleStatusFilter.bind(this);
    this.handleClearComplete = this.handleClearComplete.bind(this);
    this.handleUpdateText = this.handleUpdateText.bind(this);
    this.handleToggleEditing = this.handleToggleEditing.bind(this);
    this.handleCancelEditing = this.handleCancelEditing.bind(this);
    this.handleHeaderInputChange = this.handleHeaderInputChange.bind(this);
    this.handleShowTimePicker = this.handleShowTimePicker.bind(this);
    this._hideDateTimePicker = this._hideDateTimePicker.bind(this);
    this._handleDatePicked = this._handleDatePicked.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.renderEmpty = this.renderEmpty.bind(this);
    this.handleTimeUp = this.handleTimeUp.bind(this);
    this.handleTodoTypeChange = this.handleTodoTypeChange.bind(this);
    this.handleTodoTypeFilter = this.handleTodoTypeFilter.bind(this);

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log( 'TOKEN:', token );
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        return;
      },
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true,
      requestPermissions: true
    });
  }

  componentWillMount() {
    AsyncStorage.getItem("items").then((json) => {
      try {
        const items = JSON.parse(json);
        this.setSource(items, items, {loading: false});
      } catch (e) {
        console.error("Load storage error", e);
        this.setState({
          loading: false
        });
      }
    })
  }

  scheduleNotification(_id, _message, _date) {
    if(_date === "") return;
    let notificationDate = moment(_date, 'MM-DD-YYYY h:mm:ss a').toDate();
    let notificationMessage = 'You have a deadline today: ' + _message;
    PushNotification.localNotificationSchedule({
      id: _id,
      message: notificationMessage, // (required)
      date: notificationDate,
    });
  };

  setSource(items, itemsDatasource, otherState = {}) {
    this.setState({
      items,
      dataSource: itemsDatasource,
      ...otherState,
    });
    AsyncStorage.setItem("items", JSON.stringify(items));
  }

  handleUpdateText(key, text){
    const newItems = this.state.items.map((item) => {
      if(item.key !== key) return item;
      else {
        return {
          ...item,
          text,
        }
      }
    });
    this.setSource(newItems, filterItems(newItems, this.state.statusFilter, this.state.typeFilter));
  }

  handleTimeUp(key){
    console.log("time up!");
    const newItems = this.state.items.map((item) => {
      if(item.key !== key) return item;
      else {
        return {
          ...item,
          timeUp: true
        }
      }
    });
    this.setSource(newItems, filterItems(newItems, this.state.statusFilter, this.state.typeFilter));
  }

  // TODO: modify content should also update notification message
  handleToggleEditing(key, editing){
    const newItems = this.state.items.map((item) => {
      if(item.key !== key) return item;
      else {
        return {
          ...item,
          editing,
          unsaved: item.text
        }
      }
    });
    this.setSource(newItems, filterItems(newItems, this.state.statusFilter, this.state.typeFilter));
  }

  handleAddItem() {
    if(!this.state.value) return;
    let _date = moment().format('MM-DD-YYYY h:mm:ss a');
    this.scheduleNotification(_date, this.state.value, this.state.showDateValue);
    const newItems = [
      ...this.state.items || [],
      {
        key: Date.now(),
        date: _date,
        ddl: this.state.showDateValue,
        text: this.state.value,
        complete: false,
        editing: false,
        timeUp: false,
        type: this.state.todoType
      }
    ];
    this.setSource(newItems, filterItems(newItems, this.state.statusFilter, this.state.typeFilter), {value: "", showDateValue: ""});
  }

  handleToggleComplete(key, complete){
    const _complete=complete.checked;
    const newItems = this.state.items.map((item) => {
      if(item.key !== key) return item;
      return {
        ...item,
        complete: _complete
      };
    });
    this.setSource(newItems, filterItems(newItems, this.state.statusFilter, this.state.typeFilter));
  }

  handleRemoveItem(key) {
    const newItems = this.state.items.filter((item) => {
      return item.key !== key;
    });
    this.setSource(newItems, filterItems(newItems, this.state.statusFilter, this.state.typeFilter));
  }

  handleStatusFilter(statusFilter) {
    this.setSource(this.state.items, filterItems(this.state.items, statusFilter, this.state.typeFilter), {statusFilter});
  }

  handleTodoTypeFilter(typeFilter) {
    this.setSource(this.state.items, filterItems(this.state.items, this.state.statusFilter, typeFilter), {typeFilter});
  }

  handleClearComplete(){
    const newItems = filterItems(this.state.items, "ACTIVE", this.state.typeFilter);
    this.setSource(newItems, filterItems(newItems, this.state.statusFilter, this.state.typeFilter));
  }

  handleHeaderInputChange(_value){
    this.setState(
      {value: _value}
    );
  }

  handleCancelEditing(key) {
    const newItems = this.state.items.map((item) => {
      if(item.key !== key) return item;
      else {
        return {
          ...item,
          text: item.unsaved,
          editing: false
        }
      }
    });
    this.setSource(newItems, filterItems(newItems, this.state.statusFilter, this.state.typeFilter));
  }

  handleShowTimePicker() {
    console.log("show picker!!!");
    this.setState({
      showDatePicker: true
    });
  }

  _hideDateTimePicker(){
    this.setState({ showDatePicker: false });
  }

  _handleDatePicked(date){
    this.setState({
      showDateValue: this.formatDate(date)
    });
    this._hideDateTimePicker();
  }

  handleTodoTypeChange(type){
    this.setState({
      todoType: type
    });
    console.log("todotype change to ", type);
  }

  formatDate(date){
    return date === null ?
      "" : moment(date).format('MM-DD-YYYY h:mm:ss a');
  }

  renderEmpty(){
    return (
      <View style={styles.emptyView}>
        <Icon name="md-arrow-up" color={theme.primaryColor} size={30} />
        <Text style={styles.emptyText}>
          There is no todo, add todo from top
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          value={this.state.value}
          onAddItem={this.handleAddItem}
          onChange={(value) => this.handleHeaderInputChange(value)}
          primaryColor={theme.primaryColor}
          showDatePicker={this.handleShowTimePicker}
          showDatePickerFlag={this.state.showDatePicker}
          showDateValue={this.state.showDateValue}
          todoType={this.state.todoType}
          todoTypeChange={this.handleTodoTypeChange}
        />
        <View style={styles.content}>
          {this.state.items.length === 0 ?
            this.renderEmpty() :
            <FlatList
              style={styles.list}
              enableEmptySections
              data={this.state.dataSource}
              keyboardShouldPersistTaps="always"
              onScroll={() => Keyboard.dismiss()}
              renderItem={({item}) => {
                const {key, ...value} = item;
                return (
                  <Row
                    key={key}
                    {...value}
                    onRemove={() => this.handleRemoveItem(key)}
                    onComplete={(complete) => this.handleToggleComplete(key, complete)}
                    onUpdate={(text) => this.handleUpdateText(key, text)}
                    onToggleEdit={(editing) => this.handleToggleEditing(key, editing)}
                    onCancelEdit={() => this.handleCancelEditing(key)}
                    onTimeUp={() => this.handleTimeUp(key)}
                    theme={theme}
                    formatDate={this.formatDate}
                  />
                );
              }}
              ItemSeparatorComponent={() => {
                return <View key={Date.now()} style={styles.separator}/>;
              }}
              keyExtractor={(item, index) => {
                return item.key;
              }}
            />
          }

        </View>
        <DateTimePicker
          isVisible={this.state.showDatePicker}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          mode="datetime"
        />
        <Footer
          statusFilter={this.state.statusFilter}
          typeFilter={this.state.typeFilter}
          onStatusFilter={this.handleStatusFilter}
          onTypeFilter={this.handleTodoTypeFilter}
          onClearComplete={this.handleClearComplete}
          count={filterItems(this.state.items, "ACTIVE", this.state.typeFilter).length}
          theme={theme}
        />
        {this.state.loading && <View style={styles.loading}>
          <MKSpinner style={styles.spinner}/>
        </View>}
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
    flex: 1,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  emptyText: {
    color: theme.primaryColor
  },
  list: {
    backgroundColor: "#fff"
  },
  separator: {
    borderWidth: 1,
    borderColor: '#F5F5F5'
  },
  loading: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.2)'
  },
  spinner: {
    width: 50,
    height: 50,
  }
});
