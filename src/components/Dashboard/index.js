import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { SkillsSearchForm } from '../Skills';

import * as ROUTES from '../../constants/routes';

const Dashboard = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Dashboard</h1>
        <p>Logged in as {authUser.username}</p>
        <SkillsSearchForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Dashboard);
