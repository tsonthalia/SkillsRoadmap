import React from 'react';
import { Link } from 'react-router-dom';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget'
import * as ROUTES from '../../constants/routes';

import SignInForm from './signInForm';
import SignInGoogle from './signInGoogle';
import SignInFacebook from './signInFacebook';

const SignInPage = () => (
  <div>
    <h1>Sign In</h1>
    <SignInForm />
    <SignInGoogle />
    <SignInFacebook />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);


const SignInLink = () => (
  <p>
    Already have an account? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </p>
)

export default SignInPage;

export { SignInForm, SignInGoogle, SignInFacebook, SignInLink }
