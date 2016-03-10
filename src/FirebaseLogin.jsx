import React, { PropTypes, Component } from 'react';
import Firebase from 'firebase';

class FirebaseLogin extends Component {
  static propTypes = {
    firebase: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object
    ]).isRequired,
    onAuthSuccess: PropTypes.func,
    onAuthFailure: PropTypes.func,
    onBeginAuthentication: PropTypes.func,
    onEndAuthentication: PropTypes.func
  };

  static defaultProps = {
    onAuthSuccess: (firebaseRef, authResult) => {
      console.log("Firebase Login Success", authResult);
      alert("Logged in successfully!\n\n(supply an 'onAuthSuccess' prop to suppress this message)");
    },
    onAuthFailure: (message) => {
      console.log(`Firebase Login Failure: ${message}`);
      alert(`Login failure: ${message}\n\n(supply an 'onAuthFailure' prop to suppress this message)`);
    },
    onBeginAuthentication: () => {
      console.log("Authentication attempt starting");
    },
    onEndAuthentication: () => {
      console.log("Authentication attempt complete");
    }
  };

  get fbref() {
    return (typeof(this.props.firebase) === "string") ? new Firebase(this.props.firebase) : this.props.firebase;
  };

  _authHandler(e) {
    e.preventDefault();

    if (!e.target.email || !e.target.password) {
      alert("FirebaseLogin setup error (see console for details");
      console.error("FirebaseLogin missing child form fields named: 'email' and/or 'password'");
      return;
    }

    let email = e.target.email.value;
    let password = e.target.password.value;

    this.props.onBeginAuthentication();
    let fb = this.fbref;
    fb.authWithPassword({email, password})
        .then((authResult) => {
          this.props.onAuthSuccess(fb, authResult);
          this.props.onEndAuthentication();
        })
        .catch(err => {
          this.props.onAuthFailure(err);
          this.props.onEndAuthentication();
        });
  }

  render() {
    return (
        <form onSubmit={::this._authHandler}>
          {this.props.children}
        </form>
    );
  }
}

export default FirebaseLogin;