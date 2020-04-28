import React, { Component } from 'react';

import axios from 'axios';

const User = props => (
  <tr>
    <td>{props.user.username}</td>
    <td>{props.user.email}</td>
  </tr>
);

export default class ViewUsers extends Component {
  constructor(props) {
    super(props);
    console.log("constructor");
    this.state = {
      users: null
    };
  }

  componentDidMount() {
    axios.get('/useraccounts/allaccounts')
      .then(response => {
        console.log(response.data);
        this.setState({
          users: response.data
        });
      }).catch(function (error){
        console.log(error);
      });
  }

  userList() {
    if (this.state.users !== null) {
      const allUsers = [];

      for (var currentUser in this.state.users) {
        console.log(this.state.users[currentUser]);
        allUsers.push(<User user={this.state.users[currentUser]} key={currentUser} />)
      }
      return allUsers;
    }
  }

  render() {
    return (
      <div>
        <h3>All Users</h3>
        <table className="table table-striped" style={{ marginTop: 20 }} >
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {this.userList()}
          </tbody>
        </table>
      </div>
    );
  }
}
