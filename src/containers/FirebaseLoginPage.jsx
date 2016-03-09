import { Component } from 'react';


export default class FirebaseLoginPage extends Component {
  static propTypes = {
    firebase: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object
    ]).isRequired
  };

  render() {
    return (
        <FirebaseLogin
            firebase={this.props.firebase}
        >
          <div>
            <input type="text" name="email"/>
            <input type="password" name="password"/>
          </div>
          <div>
            <input type="submit" value="Go"/>
          </div>
        </FirebaseLogin>
    );
  }

}