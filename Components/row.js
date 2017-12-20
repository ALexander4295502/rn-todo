import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';

import {
  MKCheckbox,
  MKProgress,
} from 'react-native-material-kit';

import PropTypes from "prop-types";
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const {width} = Dimensions.get('window');

export default class Row extends Component {

  static propTypes = {
    date: PropTypes.string,
    ddl: PropTypes.string,
    type: PropTypes.string,
    theme: PropTypes.object,
    timeUp: PropTypes.bool,
    complete: PropTypes.bool,
    onTimeUp: PropTypes.func,
    onToggleEdit: PropTypes.func,
    onCancelEdit: PropTypes.func,
    onRemove: PropTypes.func,
    text: PropTypes.string,
    onUpdate: PropTypes.func,
    onComplete: PropTypes.func,
    editing: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.state = {
      timeRemain: moment.duration(
        moment().diff(moment(this.props.date, 'MM-DD-YYYY h:mm:ss a'))
      ),
      totalTime: moment.duration(
        moment(this.props.ddl, 'MM-DD-YYYY h:mm:ss a').diff(moment(this.props.date, 'MM-DD-YYYY h:mm:ss a'))
      ),
      timeInterval: {}
    };
    this.remainTimeTextGenerate = this.remainTimeTextGenerate.bind(this);
    this.remainTimeProgress = this.remainTimeProgress.bind(this);
  }

  todoTypeIconGenerate() {
    if (this.props.type === 'None')
      return (
        <Icon name="md-done-all" style={styles.iconStyle} size={18} color={this.props.theme.primaryColor}/>
      );
    if (this.props.type === 'Work')
      return (
        <Icon name="ios-book" style={styles.iconStyle} size={18} color={this.props.theme.primaryColor}/>
      );
    if (this.props.type === 'Life')
      return (
        <Icon name="md-basket" style={styles.iconStyle} size={18} color={this.props.theme.primaryColor}/>
      );
  }

  componentDidMount() {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 250,
    }).start();

    if (this.props.ddl !== "") {
      this.setState({
        timeInterval: setInterval(() => {
          if (!this.props.timeUp && !this.props.complete) {
            if (parseInt(this.state.timeRemain.asMilliseconds()) < 0) {
              this.props.onTimeUp();
              return;
            }
            this.setState({
              timeRemain: moment.duration(
                moment(this.props.ddl, 'MM-DD-YYYY h:mm:ss a').diff(moment())
              )
            })
          }
        }, 1000)
      })
    }
  }

  componentWillUnmount() {
    if(this.props.ddl !== "") {
      clearInterval(this.state.timeInterval);
    }
  }

  remainTimeTextGenerate(remainTime) {
    if (this.props.timeUp) return "time up";
    if (this.props.complete) return "completed!";
    if (parseInt(remainTime.asDays()) > 0)
      return parseInt(remainTime.asDays()) + " days left";
    else if (parseInt(remainTime.asHours()) > 0)
      return parseInt(remainTime.asHours()) + " hours left";
    else if (parseInt(remainTime.asMinutes()) > 0)
      return parseInt(remainTime.asMinutes()) + " minutes left";
    else if (parseInt(remainTime.asSeconds()) > 0)
      return parseInt(remainTime.asSeconds()) + " seconds left";
    return "loading";
  }

  remainTimeProgress(remainTime) {
    if (this.props.complete) return 0;
    if (this.props.timeUp) return 1.0;
    return Math.min(
      1.0,
      1.0 - parseInt(remainTime.asMilliseconds()) / parseInt(this.state.totalTime.asMilliseconds())
    );
  }

  clickDeleteButton = () => {
    // TODO: For now "remove item" makes the row below it stays in previous place for a while
    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 250,
    }).start(() => {
      this.props.onRemove();
    })
  };

  clickEditButton = () => {
    
  };

  render() {
    const animatedRowStyle = [
      {opacity: this.animatedValue},
      {
        transform: [
          {scale: this.animatedValue},
          {
            rotate: this.animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['35deg', '0deg'],
              extrapolate: 'clamp',
            })
          }
        ]
      }
    ];

    const {complete} = this.props;
    const textComponent = (
      <TouchableOpacity
        style={styles.textWrap}
        onLongPress={() => this.props.onToggleEdit(true)}
      >
        <Text style={[
          this.props.theme.cardContentStyle,
          {marginTop: -10, marginLeft: -10, fontSize: 20},
          complete && styles.complete
        ]}>
          {this.props.text}
        </Text>
        <View style={styles.metaView}>
          {this.todoTypeIconGenerate()}
          <Text style={styles.timeText}>
            {
              this.props.ddl === "" ?
                "No deadline" :
                "DDL: " + moment(
                this.props.ddl, 'MM-DD-YYYY h:mm:ss a'
                ).calendar()
            }
          </Text>
        </View>
        {this.props.ddl === "" ? null :
          <View style={styles.progressWrap}>
            <MKProgress
              progress={this.remainTimeProgress(this.state.timeRemain)}
              style={styles.progressBar}
            />
            <Text
              style={[
                styles.progressText,
                {color: this.props.theme.primaryColor}
              ]}
            >
              {this.remainTimeTextGenerate(this.state.timeRemain)}
            </Text>
          </View>
        }
      </TouchableOpacity>
    );

    // TODO: the thumb animation in MKSwitch cannot perform state change properly
    return (
      <Animated.View style={[styles.container, animatedRowStyle]}>
        <MKCheckbox
          checked={complete}
          onCheckedChange={this.props.onComplete}
          borderOffColor={this.props.theme.primaryColor}
        />
        {textComponent}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => this.props.onToggleEdit(true)}
        >
          <Icon name="ios-settings" size={25} color={this.props.theme.primaryColor}/>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={this.clickDeleteButton}
        >
          <Icon name="ios-trash" size={25} color={this.props.theme.primaryColor}/>
        </TouchableOpacity>
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
  progressWrap: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 3,
    alignItems: 'center'
  },
  progressText: {
    marginLeft: 0.01 * width,
    fontSize: 0.03 * width,
    fontWeight: 'bold',
    width: 0.2 * width,
    textAlign: 'center'
  },
  progressBar: {
    width: 0.6 * width,
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
  metaView: {
    marginTop: 5,
    flexDirection: 'row',
  },
  iconStyle: {
    marginTop: -2,
  },
  timeText: {
    fontSize: 12,
    color: "#CC9A9A",
    marginLeft: 10,
  },
  buttonWrap: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  button: {
    marginVertical: 10,
    marginHorizontal: 6,
  }
});