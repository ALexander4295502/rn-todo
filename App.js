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
  FlatList
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

import Footer from './Components/footer';
import Header from './Components/header';
import Row from './Components/row';

const filterItems = (filter, items) => {
  if(items === null) return [];
  return items.filter((item) => {
    if(filter === 'ALL') return true;
    if(filter === 'COMPLETED') return item.complete;
    if(filter === 'ACTIVE') return !item.complete;
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
      filter: 'ALL',
      showTimePicker: false,
      showDateValue: ""
    };
    this.handleToggleComplete = this.handleToggleComplete.bind(this);
    this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleClearComplete = this.handleClearComplete.bind(this);
    this.handleUpdateText = this.handleUpdateText.bind(this);
    this.handleToggleEditing = this.handleToggleEditing.bind(this);
    this.handleCancelEditing = this.handleCancelEditing.bind(this);
    this.handleHeaderInputChange = this.handleHeaderInputChange.bind(this);
    this.handleShowTimePicker = this.handleShowTimePicker.bind(this);
    this._hideDateTimePicker = this._hideDateTimePicker.bind(this);
    this._handleDatePicked = this._handleDatePicked.bind(this);
    this.formatDate = this.formatDate.bind(this);

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

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
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

  scheduleNotification(_message, _date) {
    if(_date === "") return;
    let notificationDate = moment(_date, 'MM-DD-YYYY h:mm a').toDate();
    let notificationMessage = 'You have a deadline today: ' + _message;
    PushNotification.localNotificationSchedule({
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
          date: moment().format('MM-DD-YYYY h:mm a')
        }
      }
    });
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

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
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

  handleAddItem() {
    if(!this.state.value) return;
    this.scheduleNotification(this.state.value, this.state.showDateValue);
    const newItems = [
      ...this.state.items || [],
      {
        key: Date.now(),
        date: moment().format('MMMM Do YYYY, h:mm:ss a'),
        ddl: this.state.showDateValue,
        text: this.state.value,
        complete: false,
        editing: false
      }
    ];
    this.setSource(newItems, filterItems(this.state.filter, newItems), {value: "", showDateValue: ""});
  }

  handleToggleAllComplete(){
    const complete = !this.state.allComplete;
    if(this.state.items === null) return;
    const newItems = this.state.items.map((item) => ({
      ...item,
      complete
    }));
    // console.table(newItems);
    this.setSource(newItems, filterItems(this.state.filter, newItems), {allComplete: complete});
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
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

  handleRemoveItem(key) {
    const newItems = this.state.items.filter((item) => {
      return item.key !== key;
    });
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

  handleFilter(filter) {
    this.setSource(this.state.items, filterItems(filter, this.state.items), {filter});
  }

  handleClearComplete(){
    const newItems = filterItems("ACTIVE", this.state.items);
    this.setSource(newItems, filterItems(this.state.filter, newItems));
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
    this.setSource(newItems, filterItems(this.state.filter, newItems));
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
  };

  formatDate(date){
    return date === null ?
      "" : moment(date).format('MM-DD-YYYY h:mm a');
  }

  render() {
    PushNotification.scheduleLocalNotification({
      foreground: true,
      userInteraction: true,
      title: "My Notification Title",
      message: "My Notification Message", // (required)
      date: new Date(Date.now() + (5 * 1000))
    });
    return (
      <View style={styles.container}>
        <Header
          value={this.state.value}
          onAddItem={this.handleAddItem}
          onChange={(value) => this.handleHeaderInputChange(value)}
          onToggleAllComplete={this.handleToggleAllComplete}
          primaryColor={theme.primaryColor}
          showDatePicker={this.handleShowTimePicker}
          showDatePickerFlag={this.state.showDatePicker}
          showDateValue={this.state.showDateValue}
        />
        <View style={styles.content}>
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
                  primaryColor={theme.primaryColor}
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
        </View>
        <DateTimePicker
          isVisible={this.state.showDatePicker}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          mode="datetime"
        />
        <Footer
          filter={this.state.filter}
          onFilter={this.handleFilter}
          onClearComplete={this.handleClearComplete}
          count={filterItems("ACTIVE", this.state.items).length}
          primaryColor={theme.primaryColor}
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
    flex: 1
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
