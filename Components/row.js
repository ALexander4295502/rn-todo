import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';

import {
  MKCheckbox,
  MKButton,
} from 'react-native-material-kit';

export default class Row extends Component {

  constructor(props){
    super(props);
    this.animatedValue = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 250,
    }).start()
  }

  render() {
    const animatedRowStyle = [
      {opacity: this.animatedValue},
      {
        transform: [
          {scale: this.animatedValue},
          {rotate: this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['35deg', '0deg'],
            extrapolate: 'clamp',
          })}
        ]
      }
    ];
    const SaveButton = MKButton.coloredButton()
      .withText('SAVE')
      .withOnPress(() => {
        this.props.onToggleEdit(false);
      })
      .withStyle(styles.button)
      .build();

    const CancelButton = MKButton.coloredButton()
      .withText('CANCEL')
      .withOnPress(() => {
        this.props.onCancelEdit();
      })
      .withStyle(styles.button)
      .build();

    const DeleteButton = MKButton.coloredButton()
      .withText('DELETE')
      .withStyle(styles.button)
      .withOnPress(() => {
        // TODO: For now "remove item" makes the row below it stays in previous place for a while
        Animated.timing(this.animatedValue, {
          toValue: 0,
          duration: 250,
        }).start(() => {this.props.onRemove();})
      })
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
        <View style={styles.timeView}>
          <Text style={styles.timeText}>{this.props.date}</Text>
        </View>
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

    const editingButtons = (
      <View style={styles.buttonWrap}>
        <SaveButton />
        <CancelButton />
      </View>
    );

    // TODO: the thumb animation in MKSwitch cannot perform state change properly
    return (
      <Animated.View style={[styles.container, animatedRowStyle]}>
        <MKCheckbox
          checked={complete}
          onCheckedChange={this.props.onComplete}
          borderOffColor={this.props.primaryColor}
        />
        {this.props.editing ? editingComponent : textComponent}
        {this.props.editing ? editingButtons : <DeleteButton />}
      </Animated.View>
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
    flex: 1,
    fontSize: 20,
    padding: 0,
    color: '#4d4d4d'
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
    fontSize: 20,
    color: '#4d4d4d'
  },
  complete: {
    textDecorationLine: "line-through",
    textDecorationColor: '#ff0000'
  },
  destroy: {
    fontSize: 20,
    color: "#CC9A9A"
  },
  timeView: {
    marginTop: 10
  },
  timeText: {
    fontSize: 10,
    color: "#CC9A9A"
  },
  buttonWrap: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  button: {
    marginVertical: 5,
    height: 33,
    width: 74,
  }
});