import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { SignInGoogle, SignInFacebook, SignInLink } from '../SignIn';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const SignUpPage = () => (
  <div>
    <h1>Sign Up</h1>
    <SignUpForm />
    <SignInGoogle />
    <SignInFacebook />
    <SignInLink />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const {
      username,
      email,
      passwordOne,
      isAdmin,
    } = this.state;

    const roles = {};

    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            uid: authUser.user.uid,
            username,
            email,
            roles
          });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.DASHBOARD);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

      event.preventDefault();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  }

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      error
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return(
      <form onSubmit={this.onSubmit}>
        <input
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Username"
        />
        <br />
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <br />
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <br />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        />
        <br />
        {/*<input
          name="isAdmin"
          type="checkbox"
          checked={isAdmin}
          onChange={this.onChangeCheckbox}
        />*/}
        <br />
        <button disabled={isInvalid} type="submit">
          Sign Up
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
)

const ERROR_CODE_ACCOUNT_EXISTS ='auth/account-exists-with-different-credential';
const ERROR_MSG_ACCOUNT_EXISTS = `An account with an E-Mail address to this social account already exists. Try to login from this account instead and associate your social accounts on your personal account page.`;

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
