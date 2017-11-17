import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import {
  MKSwitch,
  MKCheckbox,
  MKButton,
} from 'react-native-material-kit';

export default class Row extends Component {
  render() {

    const SaveButton = MKButton.coloredButton()
      .withText('SAVE')
      .withOnPress(() => {
        this.props.onToggleEdit(false);
      })
      .build();

    const DeleteButton = MKButton.coloredButton()
      .withText('DELETE')
      .withOnPress(this.props.onRemove)
      .build();

    const {complete} = this.props;
    const textComponent = (
      <TouchableOpacity
        style={styles.textWrap}
        onLongPress={() => this.props.onToggleEdit(true)}
      >
        <Text style={[styles.text, complete && styles.complete]}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    );

    const editingComponent = (
      <View style={styles.textWrap}>
        <TextInput
          onChangeText={this.props.onUpdate}
          autoFocus
          value={this.props.text}
          style={styles.input}
          multiline
        />
      </View>
    );
    // TODO: the thumb animation in MKSwitch cannot perform state change properly
    return (
      <View style={styles.container}>
        <MKCheckbox
          checked={complete}
          onCheckedChange={this.props.onComplete}
        />
        {this.props.editing ? editingComponent : textComponent}
        {this.props.editing ? <SaveButton /> : <DeleteButton />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  input: {
    height: 100,
    flex: 1,
    fontSize: 24,
    padding: 0,
    color: '#4d4d4d'
  },
  done: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#7be290',
    padding: 7
  },
  doneText: {
    color: '#4d4d4d',
    fontSize: 20
  },
  textWrap: {
    flex: 1,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 24,
    color: '#4d4d4d'
  },
  complete: {
    textDecorationLine: "line-through"
  },
  destroy: {
    fontSize: 20,
    color: "#CC9A9A"
  },
});