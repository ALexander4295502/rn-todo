import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import {
  getTheme
} from 'react-native-material-kit';

import Icon from 'react-native-vector-icons/Ionicons';

const theme = getTheme();

export default class CalenderListRow extends Component {

  todoTypeIconGenerate(){
    if(this.props.type === 'None')
      return (
        <Icon name="md-done-all" style={styles.iconStyle} size={14} color={this.props.theme.primaryColor} />
      );
    if(this.props.type === 'Work')
      return (
        <Icon name="ios-book" style={styles.iconStyle} size={14} color={this.props.theme.primaryColor} />
      );
    if(this.props.type === 'Life')
      return (
        <Icon name="md-basket" style={styles.iconStyle} size={14} color={this.props.theme.primaryColor} />
      );
  }

  render() {
    return (
    <View style={styles.container}>
      <Text style={[
        theme.cardContentStyle,
        {marginTop: -10, marginLeft: -10},
        this.props.complete && styles.complete
      ]}>
        {this.props.text}
      </Text>
      <View style={styles.metaView}>
        {this.todoTypeIconGenerate()}
        <Text style={styles.timeText}>
          {
            this.props.ddl === "" ?
              "No deadline" :
              "DDL: " + this.props.ddl
          }
        </Text>
      </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  iconStyle: {
    marginTop: -2,
  },
  metaView: {
    marginTop: 5,
    flexDirection: 'row',
  },
  timeText: {
    fontSize: 10,
    color: "#CC9A9A",
    marginLeft: 10,
  },
  complete: {
    textDecorationLine: "line-through",
    textDecorationColor: '#ff0000'
  },
});