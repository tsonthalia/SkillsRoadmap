import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';

const CreateSkillPageBase = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? <CreateSkillForm authUser={authUser}/> : null
    }
  </AuthUserContext.Consumer>
)

const INITIAL_STATE = {
  skillName: '',
  error: null,
}

class CreateSkillFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    console.log(this.props.authUser)
    const {
      skillName
    } = this.state;

    this.props.firebase
      .skill(skillName)
      .set({
        skillName,
        skillCreator: this.props.authUser.email,
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const {
      skillName,
      error,
    } = this.state;

    const isInvalid = skillName === '';

    return (
      <div>
        <h1>Create Skill</h1>
        <form onSubmit={this.onSubmit}>
          <input
            name="skillName"
            value={skillName}
            onChange={this.onChange}
            type="text"
            placeholder="Skill Name"
          />

          <button disabled={isInvalid} type="submit">
            Create Skill
          </button>

          {error && <p>{error.message}</p>}
        </form>
      </div>
    )
  }
}

const condition = authUser => !!authUser;

const CreateSkillPage = withAuthorization(condition)(CreateSkillPageBase)

const CreateSkillForm = compose(
  withRouter,
  withFirebase,
)(CreateSkillFormBase)

export default CreateSkillPage;
