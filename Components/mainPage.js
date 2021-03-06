import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Keyboard,
  AsyncStorage,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

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

import Footer from './footer';
import TodoForm from './todoForm';
import PopModal from './popModal';
import Row from './row';
import Calendar from './calendar';

const filterItems = (items, statusFilter, typeFilter) => {
  if (items === null) return [];
  return items.filter((item) => {
    if (typeFilter === 'None') return true;
    else return item.type === typeFilter;
  }).filter((item) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'COMPLETED') return item.complete;
    if (statusFilter === 'ACTIVE') return !item.complete;
  })
};

setTheme({
  primaryColor: "#fd8ebe",
  primaryColorRGB: MKColor.RGBPink,
  accentColor: MKColor.Pink,
  accentColorRGB: MKColor.RGBPink,
});

const theme = {
  ...getTheme(),
  lightColor: '#e35183',
  darkColor: '#b4004e'
};

export default class MainPage extends Component<{}> {

  static propTypes = {
    navigator: PropTypes.object.isRequired
  }

  constructor(props) {
    // custom console
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
      openModal: false,
      showEditing: false,
      editingItem: {}
    };

    this.handleToggleComplete = this.handleToggleComplete.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleStatusFilter = this.handleStatusFilter.bind(this);
    this.handleUpdateItem = this.handleUpdateItem.bind(this);
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
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      // onRegister: function (token) {
      //   console.log('TOKEN:', token);
      // },
      // (required) Called when a remote or local notification is opened or received
      // onNotification: function (notification) {
      //   return;
      // },
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
        const items = JSON.parse(json) || [];
        this.setSource(items, items, {loading: false});
      } catch (e) {
        // console.error("Load storage error", e);
        this.setState({
          loading: false
        });
      }
    })
  }

  scheduleNotification(_id, _message, _date) {
    if (_date === "") return;
    let notificationDate = moment(_date, 'MM-DD-YYYY h:mm:ss a').toDate();
    let notificationMessage = 'You have a deadline today: ' + _message;
    PushNotification.localNotificationSchedule({
      id: _id,
      message: notificationMessage, // (required)
      date: notificationDate,
    });
  }

  setSource(items, itemsDatasource, otherState = {}) {
    this.setState({
      items,
      dataSource: itemsDatasource,
      ...otherState,
    }, () => {
      PushNotification.setApplicationIconBadgeNumber(
        filterItems(this.state.items, "ACTIVE", "None").length
      );
    });
    AsyncStorage.setItem("items", JSON.stringify(items));
  }

  handleUpdateItem(key, newItem) {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
      else {
        return {
          ...item,
          ...newItem
        }
      }
    });
    this.setState({
      editingItem: {},
      showEditing: false,
    }, () => {
      this.handleCloseModal();
    })
    this.setSource(newItems, filterItems(newItems, this.state.statusFilter, this.state.typeFilter));
  }

  handleTimeUp(key) {
    // console.log("time up!");
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
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
  handleToggleEditing(key, editing) {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
      else {
        return {
          ...item,
          editing,
          unsaved: item.text
        }
      }
    });
    this.setState({
      editingItem: this.state.items.find(item => item.key === key),
      showEditing: true,
    }, () => {
      this.handleOpenModal();
    });
    this.setSource(newItems, filterItems(newItems, this.state.statusFilter, this.state.typeFilter));
  }

  handleAddItem(newTodoObject) {
    let _date = moment().format('MM-DD-YYYY h:mm:ss a');
    this.scheduleNotification(_date, newTodoObject.value, newTodoObject.showDateValue);
    const newItems = [
      ...this.state.items || [],
      {
        key: Date.now(),
        date: _date,
        ddl: newTodoObject.showDateValue,
        text: newTodoObject.text,
        complete: false,
        editing: false,
        timeUp: false,
        type: newTodoObject.todoType
      }
    ];
    this.setSource(newItems, filterItems(newItems, this.state.statusFilter, this.state.typeFilter), {
      openModal: false
    });
  }

  handleToggleComplete(key, complete) {
    const _complete = complete.checked;
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
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

  handleHeaderInputChange(_value) {
    this.setState(
      {value: _value}
    );
  }

  handleCancelEditing(key) {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
      else {
        return {
          ...item,
          text: item.unsaved,
          editing: false
        }
      }
    });
    this.setState({
      editingItem: {},
      showEditing: false,
    }, () => {
      this.handleCloseModal();
    })
    this.setSource(newItems, filterItems(newItems, this.state.statusFilter, this.state.typeFilter));
  }

  handleShowTimePicker() {
    // console.log("show picker!!!");
    this.setState({
      showDatePicker: true
    });
  }

  _hideDateTimePicker() {
    this.setState({showDatePicker: false});
  }

  _handleDatePicked(date) {
    this.setState({
      showDateValue: this.formatDate(date)
    });
    this._hideDateTimePicker();
  }

  handleTodoTypeChange(type) {
    this.setState({
      todoType: type
    });
  }

  formatDate(date) {
    return date === null ?
      "" : moment(date).format('MM-DD-YYYY h:mm:ss a');
  }

  handleNavigation(component) {
    let _items = {};
    this.state.items.map((item) => {
      if (item.ddl === '') return;
      let _date = moment(item.ddl, 'MM-DD-YYYY h:mm:ss a').format('YYYY-MM-DD');
      _items[_date] = _items[_date] || [];
      _items[_date].push({...item});
    });
    switch (component) {
      case 'calendar':
        this.props.navigator.push({
          component: Calendar,
          passProps: {
            items: _items,
            theme: theme
          }
        });
        break;
      default:
        break;
    }
  }

  handleOpenModal() {
    this.setState({
      openModal: true
    });
  }

  handleCloseModal() {
    if(this.state.editingItem.key) {
      this.handleCancelEditing(this.state.editingItem.key);
    }
    this.setState({
      openModal: false
    });
  }

  renderEmpty() {
    return (
      <View style={styles.emptyView}>
        <TouchableOpacity 
          style={styles.hintContainer}
          onPress={this.handleOpenModal}
        >
          <Icon name="ios-add-circle-outline" color={theme.primaryColor} size={30}/>
          <Text style={styles.emptyText}>
            There is no todo, click here to add one.
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
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
                    onToggleEdit={(editing) => this.handleToggleEditing(key, editing)}
                    onTimeUp={() => this.handleTimeUp(key)}
                    theme={theme}
                    formatDate={this.formatDate}
                  />
                );
              }}
              ItemSeparatorComponent={() => {
                return <View key={Date.now()} style={styles.separator}/>;
              }}
              keyExtractor={(item) => {
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
        <PopModal
          open={this.state.openModal}
          offset={0}
          modalDidClose={this.handleCloseModal}
        >
          <TodoForm
            closeModal={this.handleCloseModal}
            onAddItem={this.handleAddItem}
            showEditing={this.state.showEditing}
            editingItem={this.state.editingItem}
            onCancelEdit={() => this.handleCancelEditing(this.state.editingItem.key)}
            onSaveEdit={(updateItem) => this.handleUpdateItem(this.state.editingItem.key, updateItem)}
          />
        </PopModal>
        <Footer
          statusFilter={this.state.statusFilter}
          typeFilter={this.state.typeFilter}
          onStatusFilter={this.handleStatusFilter}
          onTypeFilter={this.handleTodoTypeFilter}
          allTodoCount={filterItems(this.state.items, "ACTIVE", "None").length}
          workTodoCount={filterItems(this.state.items, "ACTIVE", "Work").length}
          lifeTodoCount={filterItems(this.state.items, "ACTIVE", "Life").length}
          theme={theme}
          onNavigation={this.handleNavigation}
          openModal={this.handleOpenModal}
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
      ios: {paddingTop: 30}
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
    color: theme.primaryColor,
    marginTop: 5,
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
    backgroundColor: 'transparent'
  },
  spinner: {
    width: 50,
    height: 50,
  },
  hintContainer: {
    alignItems: 'center'
  }
});
