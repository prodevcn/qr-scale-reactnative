import React from 'react';
import DialogWrapper from './dialog-wrapper';
import {BehaviorSubject} from 'rxjs';
import {Text} from 'react-native';

class AppDialog extends React.PureComponent {
  state = AppDialog.defaultState();
  appDialogSubscribe = null;

  static defaultState() {
    return {
      status: false,
      type: null,
      onPressBackdrop: null,
      onPressModalContent: null,
      expiredTime: null,
      style: null,
      title: '',
      content: '',
      actions: '',
      icon: null,
    };
  }

  componentDidMount() {
    this.appDialogSubscribe = AppDialog$.subscribe((state) => {
      this.setState({
        ...AppDialog.defaultState(),
        ...state,
      });
    });
    // console.log('app-dialog');
  }

  UNSAFE_componentWillUnmount() {
    if (this.appDialogSubscribe) {
      this.appDialogSubscribe.unsubscribe();
      this.appDialogSubscribe = null;
    }
  }

  onPressBackdrop() {
    this.setState({
      ...AppDialog.defaultState(),
    });
  }

  renderActions() {
    return this.state.actions || <Text />;
  }

  render() {
    if (!this.state.status) {
      return null;
    }
    return (
      <DialogWrapper
        onPressBackdrop={
          this.state.onPressBackdrop || this.onPressBackdrop.bind(this)
        }
        type={this.state.type || null}
        expiredTime={this.state.expiredTime || null}
        style={this.state.style || null}
        onPressModalContent={this.state.onPressModalContent || null}
        icon={this.state.icon}>
        <DialogWrapper.Title>{this.state.title}</DialogWrapper.Title>

        <DialogWrapper.Content>{this.state.content}</DialogWrapper.Content>
        {this.renderActions()}
      </DialogWrapper>
    );
  }
}

export const AppDialog$ = new BehaviorSubject(AppDialog.defaultState());

export default AppDialog;
