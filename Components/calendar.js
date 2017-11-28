import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';

import {Agenda} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';

import CalendarListRow from './calendarListRow';

const dotColor = {
  none: '#ffeb3b',
  work: '#fb8c00',
  life: '#009688'
};

export default class Calendar extends Component {
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
        <View
          style={styles.swipeIndicatorWrap}
          pointerEvents="none"
        >
          <Icon name="ios-arrow-back-outline" color="#000" size={20}/>
        </View>
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
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {
        newItems[key] = this.state.items[key];
      });
      this.setState({
        items: newItems,
        loading: false,
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
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 10,
    backgroundColor: 'transparent'
  },
  item: {
    backgroundColor: 'white',
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