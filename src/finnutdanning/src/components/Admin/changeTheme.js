import React, {Component} from 'react';
import {withFirebase} from '../Firebase';

class ThemeChanger extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);


  }

  onClick(event) {
    const theme = this.props.firebase.theme();
    const pickedTheme = parseInt(event.target.value);

    theme.transaction(function () {
      return (pickedTheme);
    });

  }

  render() {
    return (
      <div>
        <div>
          <h2> Fargetema: </h2>
        </div>
        <div>
          <button type = "button" value = {0} onClick = {this.onClick}> #1 stygg farge </button>
          <button type = "button" value = {1} onClick = {this.onClick}> #2 stygg farge </button>
          <button type = "button" value = {2} onClick = {this.onClick}> #3 stygg farge </button>
          <button type = "button" value = {3} onClick = {this.onClick}> #4 stygg farge </button>
        </div>
      </div>
    );
  };
};

export default withFirebase(ThemeChanger);
