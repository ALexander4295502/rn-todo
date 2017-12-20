import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';

import {
  MKRadioButton,
  MKButton,
} from 'react-native-material-kit';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
// Get cheat sheet here:
// https://infinitered.github.io/ionicons-version-3-search/

const {width, height} = Dimensions.get('window');

export default class Footer extends Component {

  constructor(props) {
    super(props);
    this.todoTypeIconGenerate = this.todoTypeIconGenerate.bind(this);
  }

  todoTypeIconGenerate() {
    if (this.props.typeFilter === 'None')
      return (<Icon name="md-menu" color="#fff" size={20}/>);
    if (this.props.typeFilter === 'Work')
      return (<Icon name="ios-book" color="#fff" size={20}/>);
    if (this.props.typeFilter === 'Life')
      return (<Icon name="md-basket" color="#fff" size={20}/>);
  }

  render() {
    const {statusFilter} = this.props;
    const fontColor = {
      color: this.props.theme.primaryColor
    };
    const AddButton = MKButton.accentColoredFab()
      .withBackgroundColor(this.props.theme.primaryColor)
      .withOnPress(() => {
        this.props.openModal();
      })
      .withStyle({
        width: 40,
        height: 40,
      })
      .build();
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
                shadowOpacity: 0.45,
                shadowColor: '#000',
                shadowRadius: 1,
                shadowOffset: {
                  width: 1,
                  height: 1
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
                <Icon name="ios-calendar" style={styles.actionButtonIcon}/>
              </ActionButton.Item>
              <ActionButton.Item
                buttonColor={this.props.theme.lightColor}
                title={`Life (${this.props.lifeCount})`}
                textStyle={{
                  minWidth: (`Life (${this.props.lifeCount})`).length * 0.015 * width,
                }}
                onPress={() => this.props.onTypeFilter("Life")}
              >
                <Icon name="md-basket" style={styles.actionButtonIcon}/>
              </ActionButton.Item>
              <ActionButton.Item
                buttonColor={this.props.theme.lightColor}
                title={`Work (${this.props.workCount})`}
                textStyle={{
                  minWidth: (`Work (${this.props.workCount})`).length * 0.017 * width,
                }}
                onPress={() => this.props.onTypeFilter("Work")}
              >
                <Icon name="ios-book" style={styles.actionButtonIcon}/>
              </ActionButton.Item>
              <ActionButton.Item
                buttonColor={this.props.theme.lightColor}
                title={`All (${this.props.allCount})`}
                textStyle={{
                  minWidth: (`All (${this.props.allCount})`).length * 0.015 * width,
                }}
                onPress={() => this.props.onTypeFilter("None")}
              >
                <Icon name="md-menu" style={styles.actionButtonIcon}/>
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
          <View style={styles.buttonWrap}>
            <AddButton>
              <Icon name="md-add" style={styles.actionButtonIcon}/>
            </AddButton>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  actionButtonWrap: {
    top: -0.01*width,
    paddingBottom: 0.1 * width,
    paddingHorizontal: 0.04 * width
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
    paddingLeft: 0.08 * width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 10,
  }
});