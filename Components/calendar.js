import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import PropTypes from "prop-types";

import {Agenda} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';

import CalendarListRow from './calendarListRow';

const dotColor = {
  none: '#ffeb3b',
  work: '#fb8c00',
  life: '#009688'
};

export default class Calendar extends Component {

  static propTypes = {
    items: PropTypes.object,
    theme: PropTypes.object,
    navigator: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      items: {
        ...this.props.items
      },
    };
    this.generateMarkedDots();
  }

  generateMarkedDots() {
    let markedDates = {};
    Object.keys(this.state.items).forEach((key) => {
      markedDates[key] = {dots: []};
      this.state.items[key].forEach((item) => {
        switch (item.type) {
          case 'None':
            markedDates[key].dots.push({
              key: item.key,
              color: dotColor.none,
            });
            break;
          case 'Work':
            markedDates[key].dots.push({
              key: item.key,
              color: dotColor.work,
            });
            break;
          case 'Life':
            markedDates[key].dots.push({
              key: item.key,
              color: dotColor.life,
            });
            break;
        }
      })
    });
    return markedDates;
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.props.navigator.pop}
          style={styles.swipeIndicatorWrap}
        >
          <Icon name="ios-arrow-back-outline" color="#000" size={20}/>
        </TouchableOpacity>
        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          markedDates={this.generateMarkedDots()}
          markingType={'multi-dot'}
          theme={{
            selectedDayBackgroundColor: this.props.theme.primaryColor,
            todayTextColor: this.props.theme.primaryColor,
            agendaTodayColor: this.props.theme.primaryColor,
          }}
        />
      </View>
    );
  }

  loadItems(day) {
    setTimeout(() => {
      let newItems = {};
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (this.state.items[strTime]) {
          newItems[strTime] = this.state.items[strTime];
        } else {
          // We need to set empty element to make sure thw renderEmptyDate() work
          newItems[strTime] = []
        }
      }
      this.setState({
        items: newItems
      });
    }, 1000);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, {height: item.height}]}>
        <CalendarListRow
          {...item}
          theme={this.props.theme}
        />
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  swipeIndicatorWrap: {
    position: "absolute",
    left: 10,
    top: '50%',
    height: 40,
    width: 40,
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 10,
  },
  item: {
    backgroundColor: '#fff',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
});