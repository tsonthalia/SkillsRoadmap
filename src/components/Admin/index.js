import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';


const AdminPage = () => (
  <div>
    <h1>Admin Page</h1>
    <p>The Admin Page is accessible by every signed in admin user.</p>

    <Switch>
      <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
      <Route exact path={ROUTES.ADMIN} component={UserList} />
    </Switch>
  </div>
)

class UserListBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    }
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase
      .users()
      .on('value', snapshot => {
        const usersObject = snapshot.val();

        const usersList = Object.keys(usersObject).map(key => ({
          ...usersObject[key],
          uid: key,
        }));

        this.setState({
          users: usersList,
          loading: false,
        })
      })
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const {
      users,
      loading
    } = this.state;

    return (
      <div>
        <h2>Users</h2>
        {loading && <div>Loading ...</div>}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.uid}>
                <td>{user.uid}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  <Link to={{
                      pathname: `${ROUTES.ADMIN}/${user.uid}`,
                      state: { user },
                    }}
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

class UserItemBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: null,
      ...props.location.state,
    }
  }

  componentDidMount() {
    if (this.state.user) {
      return;
    }

    this.setState({ loading: true });

    this.props.firebase
      .user(this.props.match.params.id)
      .on('value', snapshot => {
        this.setState({
          user: snapshot.val(),
          loading: false,
        })
      })
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  render() {
    const {
      user,
      loading
    } = this.state;

    return (
      <div>
        <h2>User ({this.props.match.params.id})</h2>
        {loading && <div>Loading...</div>}

        {user && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{user.uid}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    )
  }
}

const UserList = withFirebase(UserListBase);
const UserItem = withFirebase(UserItemBase);

const condition = authUser =>
  authUser && !!authUser.roles[ROLES.ADMIN];

export default withAuthorization(condition)(AdminPage);
