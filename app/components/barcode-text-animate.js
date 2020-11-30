import React, {Component} from 'react';
import * as Animatable from 'react-native-animatable';
import PropTypes from 'prop-types';

// Register Animation
Animatable.initializeRegistryWithDefinitions({
  startAnimate: {
    from: {backgroundColor: '#0f00', transform: [{scale: 1}], color: '#fff6'},
    to: {backgroundColor: '#0f0f', transform: [{scale: 1.5}], color: '#ffff'},
  },
  endAnimate: {
    from: {backgroundColor: '#0f0f', transform: [{scale: 1.5}], color: '#ffff'},
    to: {backgroundColor: '#0f00', transform: [{scale: 1}], color: '#fff6'},
  },
});

class BarcodeTextAnimate extends Component {
  componentDidMount() {
    this._mounted = true;
    if (this.props.animate) {
      this.textRef
        .animate('startAnimate', 500)
        .then(() => {
          if (this._mounted) {
            this.textRef.animate('endAnimate', 500);
          }
        })
        .then(() => {
          if (this._mounted) {
            this.textRef.animate('startAnimate', 500);
          }
        })
        .then(() => {
          if (this._mounted) {
            this.textRef.animate('endAnimate', 500);
          }
        });
    }
  }

  UNSAFE_componentWillUnmount() {
    this._mounted = false;
  }

  handleTextRef = (ref) => (this.textRef = ref);

  render() {
    return (
      <Animatable.Text style={this.props.style} ref={this.handleTextRef}>
        {this.props.children}
      </Animatable.Text>
    );
  }
}

BarcodeTextAnimate.propTypes = {
  animate: PropTypes.bool,
  children: PropTypes.node.isRequired,
  style: PropTypes.any,
};

export default BarcodeTextAnimate;
