import React, { PropTypes, Component } from 'react';
import Firebase from 'firebase';

class FirebaseLogin extends Component {
  static propTypes = {
    firebase: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object
    ]).isRequired,
    authProvider: React.PropTypes.oneOf([
      "password",
      "google"
    ]).isRequired,
    authPersistence: PropTypes.oneOf([
      "default",      //whatever is configured in firebase dashboard (also the default value of this component)
      "sessionOnly",  //authenticated for the lifetime of the current window
      "none"          //no persistence -- refresh/reload will clear authentication
    ]).isRequired,
    onAuthSuccess: PropTypes.func,
    onAuthFailure: PropTypes.func,
    onBeginAuthentication: PropTypes.func,
    onEndAuthentication: PropTypes.func,
    children: PropTypes.object
  };

  static defaultProps = {
    authProvider: "password",
    authPersistence: "default",
    onAuthSuccess: (firebaseRef, authResult) => {
      console.log("Firebase Login Success", authResult);  // eslint-disable-line no-console
      alert("Logged in successfully!\n\n(supply an 'onAuthSuccess' prop to suppress this message)");
    },
    onAuthFailure: (message) => {
      console.log(`Firebase Login Failure: ${message}`);  // eslint-disable-line no-console
      alert(`Login failure: ${message}\n\n(supply an 'onAuthFailure' prop to suppress this message)`);
    },
    onBeginAuthentication: () => {
      console.log("Authentication attempt starting");  // eslint-disable-line no-console
    },
    onEndAuthentication: () => {
      console.log("Authentication attempt complete");  // eslint-disable-line no-console
    }
  };

  get fbref() {
    return (typeof(this.props.firebase) === "string") ? new Firebase(this.props.firebase) : this.props.firebase;
  }


  passwordAuthHandler(e, fb, authOptions) {
    if (!e.target.email || !e.target.password) {
      throw "FirebaseLogin configured for password authentication, " +
      "but missing child form fields named: 'email' and/or 'password'";
    }

    let email = e.target.email.value;
    let password = e.target.password.value;

    return fb.authWithPassword({email, password}, authOptions);
  }

  googleAuthHandler(e, fb, authOptions) {
    return fb.authWithOAuthPopup("google", authOptions);
  }

  _authHandler(e) {
    e.preventDefault();

    const authHandlers = {
      password: ::this.passwordAuthHandler,
      google: ::this.googleAuthHandler
    };

    const { authProvider, onBeginAuthentication, onEndAuthentication, onAuthSuccess, onAuthFailure, authPersistence } = this.props;
    const authHandler = authHandlers[authProvider];
    const fb = this.fbref;

    if (typeof authHandler === "undefined") {
      alert("FirebaseLogin setup error.  Invalid authProvider specified");
      console.error(`FirebaseLogin authProvider of '${authProvider}' is not valid`);  // eslint-disable-line no-console
      return;
    }

    onBeginAuthentication();
    authHandler(e, fb, {remember: authPersistence})
        .then((authResult) => {
          onAuthSuccess(fb, authResult);
          onEndAuthentication();
        })
        .catch(err => {
          onAuthFailure(err);
          onEndAuthentication();
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