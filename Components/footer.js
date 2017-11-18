import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {
  MKRadioButton,
  MKButton,
} from 'react-native-material-kit';

export default class Footer extends Component {
  render() {
    const {filter} = this.props;
    const ClearAllButton = MKButton.coloredButton()
      .withText("Clear all\n completed")
      .withOnPress(() => {
        this.props.onClearComplete();
      })
      .withTextStyle({
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
      })
      .build();
    const fontColor= {
      color: this.props.primaryColor
    };
    return (
      <View style={styles.container}>
        <Text style={[styles.count, fontColor]}>{this.props.count} todo</Text>
        <View style={styles.filters}>
          <View style={styles.buttonWrap}>
            <MKRadioButton
              checked={filter === "ALL"}
              onCheckedChange={() => this.props.onFilter("ALL")}
            />
            <Text style={[styles.buttonText, fontColor]}>ALL</Text>
          </View>
          <View style={styles.buttonWrap}>
            <MKRadioButton
              checked={filter === "ACTIVE"}
              onCheckedChange={() => this.props.onFilter("ACTIVE")}
            />
            <Text style={[styles.buttonText, fontColor]}>ACTIVE</Text>
          </View>
          <View style={styles.buttonWrap}>
            <MKRadioButton
              checked={filter === "COMPLETED"}
              onCheckedChange={() => this.props.onFilter("COMPLETED")}
            />
            <Text style={[styles.buttonText, fontColor]}>COMPLETE</Text>
          </View>
        </View>
        <ClearAllButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filters: {
    flexDirection: 'row',
  },
  filter: {
    padding: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  count: {
    fontWeight: 'bold'
  },
  buttonWrap: {
    flexDirection: 'column',
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 10,
  }
});