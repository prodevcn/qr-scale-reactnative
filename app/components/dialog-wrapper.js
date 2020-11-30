import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Dialog, withTheme} from 'react-native-material-ui';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class DialogWrapper extends React.Component {
  _mounted = false;
  timeout = null;

  componentDidMount() {
    this._mounted = true;
    if (this.props.expiredTime) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.timeout = setTimeout(
        this.props.onPressBackdrop,
        this.props.expiredTime,
      );
    }
  }

  UNSAFE_componentWillUnmount() {
    this._mounted = false;
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  renderContent(childrenWithProps) {
    return (
      <View style={[StyleSheet.absoluteFill, styles.dialogContainer]}>
        <Dialog
          onPress={
            this.props.withoutTouchable
              ? null
              : this.props.onPressModalContent || this.props.onPressBackdrop
          }
          style={{
            container: [
              styles.dialog,
              this.props.type ? styles[this.props.type] : null,
              this.props.style ? this.props.style : null,
            ],
          }}>
          {this.props.icon ? (
            <Icon
              style={[styles.icon]}
              name={this.props.icon}
              size={21}
              color="#fff"
            />
          ) : null}
          {childrenWithProps}
        </Dialog>
      </View>
    );
  }

  render() {
    const {children} = this.props;

    const childrenWithProps = React.Children.map(children, (child) =>
      React.cloneElement(child, {
        type: this.props.type,
        icon: this.props.icon,
        rawContent: this.props.rawContent,
      }),
    );

    return this.props.withoutTouchable ? (
      this.renderContent(childrenWithProps)
    ) : (
      <TouchableOpacity
        style={[StyleSheet.absoluteFill, {zIndex: 1100}]}
        onPress={this.props.onPressBackdrop}>
        {this.renderContent(childrenWithProps)}
      </TouchableOpacity>
    );
  }
}

class Title extends React.Component {
  render() {
    return (
      <Dialog.Title
        style={{
          titleText: [
            styles.titleText,
            this.props.type ? styles[this.props.type + 'TitleText'] : undefined,
          ],
        }}>
        {this.props.children}
      </Dialog.Title>
    );
  }
}

class Content extends React.Component {
  render() {
    return (
      <Dialog.Content
        style={{
          contentContainer: {
            paddingBottom: 30,
          },
        }}>
        {this.props.rawContent ? (
          <View>{this.props.children}</View>
        ) : (
          <Text
            style={[
              styles.contentText,
              this.props.type
                ? styles[this.props.type + 'ContentText']
                : undefined,
            ]}>
            {this.props.children}
          </Text>
        )}
      </Dialog.Content>
    );
  }
}

class Actions extends React.Component {
  render() {
    return (
      <Dialog.Actions style={{actionsContainer: styles.actionsContainer}}>
        {this.props.children}
      </Dialog.Actions>
    );
  }
}

DialogWrapper.propTypes = {
  type: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  onPressBackdrop: PropTypes.func,
  onPressModalContent: PropTypes.func,
  expiredTime: PropTypes.number,
  style: PropTypes.any,
  icon: PropTypes.any,
  rawContent: PropTypes.bool,
  withoutTouchable: PropTypes.bool,
};

DialogWrapper.Title = Title;
DialogWrapper.Content = Content;
DialogWrapper.Actions = Actions;

const styles = StyleSheet.create({
  dialogContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 35, 70, .8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    backgroundColor: '#2f2d2d',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
    maxWidth: '90%',
  },
  error: {
    backgroundColor: '#d9534f',
  },
  warning: {
    backgroundColor: '#f0ad4e',
  },
  info: {
    backgroundColor: '#f9f9f9',
  },
  success: {
    backgroundColor: '#4cae4c',
  },
  titleText: {
    color: '#fff',
  },
  infoTitleText: {
    color: '#39b3d7',
  },
  icon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  contentText: {
    color: '#fff',
  },
  infoContentText: {
    color: '#2f2d2d',
  },
  actionsContainer: {
    marginHorizontal: 15,
    minHeight: 52,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default withTheme(DialogWrapper);
