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

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
// Get cheat sheet here:
// https://infinitered.github.io/ionicons-version-3-search/

export default class Footer extends Component {

  constructor(props){
    super(props);
    this.todoTypeIconGenerate = this.todoTypeIconGenerate.bind(this);
  }

  todoTypeIconGenerate(){
    if(this.props.typeFilter === 'None')
      return (<Icon name="md-done-all" color="#fff" size={20}/>);
    if(this.props.typeFilter === 'Work')
      return (<Icon name="ios-book" color="#fff" size={20}/>);
    if(this.props.typeFilter === 'Life')
      return (<Icon name="md-basket" color="#fff" size={20}/>);
  }

  render() {
    const {statusFilter} = this.props;
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
      color: this.props.theme.primaryColor
    };
    return (
      <View style={styles.container}>
        <View style={styles.filters}>
          <View style={styles.actionButtonWrap}>
            <ActionButton
              buttonColor={this.props.theme.primaryColor}
              position="left"
              offsetX={0}
              offsetY={0}
              size={40}
              icon={this.todoTypeIconGenerate()}
              shadowStyle={{
                  shadowOpacity: 0.7,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 0.5
                  },
              }}
            >
              <ActionButton.Item
                buttonColor='#e35183'
                title="Calendar"
                textStyle={{
                  minWidth: 54,
                }}
                onPress={() => this.props.onNavigation('calendar')}
              >
                <Icon name="ios-calendar" style={styles.actionButtonIcon} />
              </ActionButton.Item>
              <ActionButton.Item
                buttonColor={this.props.theme.lightColor}
                title={`Life (${this.props.lifeCount})`}
                textStyle={{
                  minWidth: (`Life (${this.props.lifeCount})`).length*5,
                }}
                onPress={() => this.props.onTypeFilter("Life")}
              >
                <Icon name="md-basket" style={styles.actionButtonIcon} />
              </ActionButton.Item>
              <ActionButton.Item
                buttonColor={this.props.theme.lightColor}
                title={`Work (${this.props.workCount})`}
                textStyle={{
                  minWidth: (`Work (${this.props.workCount})`).length*6.5,
                }}
                onPress={() => this.props.onTypeFilter("Work")}
              >
                <Icon name="ios-book" style={styles.actionButtonIcon} />
              </ActionButton.Item>
              <ActionButton.Item
                buttonColor={this.props.theme.lightColor}
                title={`All (${this.props.allCount})`}
                textStyle={{
                  minWidth: (`All (${this.props.allCount})`).length*5,
                }}
                onPress={() => this.props.onTypeFilter("None")}
              >
                <Icon name="md-done-all" style={styles.actionButtonIcon} />
              </ActionButton.Item>
            </ActionButton>
          </View>
          <View style={styles.buttonWrap}>
            <MKRadioButton
              checked={statusFilter === "ALL"}
              onCheckedChange={() => this.props.onStatusFilter("ALL")}
            />
            <Text style={[styles.buttonText, fontColor]}>ALL</Text>
          </View>
          <View style={styles.buttonWrap}>
            <MKRadioButton
              checked={statusFilter === "ACTIVE"}
              onCheckedChange={() => this.props.onStatusFilter("ACTIVE")}
            />
            <Text style={[styles.buttonText, fontColor]}>ACTIVE</Text>
          </View>
          <View style={styles.buttonWrap}>
            <MKRadioButton
              checked={statusFilter === "COMPLETED"}
              onCheckedChange={() => this.props.onStatusFilter("COMPLETED")}
            />
            <Text style={[styles.buttonText, fontColor]}>COMPLETE</Text>
          </View>
          <View style={styles.clearButtonWrap}>
            <ClearAllButton />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  filters: {
    flexDirection: 'row',
  },
  actionButtonWrap: {
    alignSelf: 'flex-start',
    flex: 1,
    marginTop: 7,
    marginLeft: 15,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  filter: {
    padding: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'space-around',
    alignItems: 'center',
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
  clearButtonWrap: {
    marginHorizontal: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 10,
  }
});