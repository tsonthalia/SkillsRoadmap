import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';
import Button from 'react-bootstrap/Button';

const CreateSkillPageBase = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? <CreateSkillForm authUser={authUser}/> : null
    }
  </AuthUserContext.Consumer>
)

const INITIAL_STATE = {
  skillName: '',
  lessons: [{lessonName:"", lessonLink:"", lessonSource:""}],
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
      skillName, lessons
    } = this.state;

    this.props.firebase
      .skill(skillName)
      .set({
        skillName,
        skillCreator: this.props.authUser.email,
		lessons
      })
      .then(() => {
        this.setState({
		  skillName: '',
		  lessons: [{lessonName:"", lessonLink:"", lessonSource:""}],
		  error: null,
		});
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  onChangeSkillName = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const {
      skillName,
	  lessons,
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
            onChange={this.onChangeSkillName}
            type="text"
            placeholder="Skill Name"
          />
		  {lessons.map((lesson, i) => (
			  <div>
			  <input
				name="lessonName"
				value={lesson.lessonName}
				onChange={(event) => {
					 var temp = this.state.lessons;
					 temp[i].lessonName = event.target.value;
					 this.setState({lessons: temp});
				}}
				type="text"
				placeholder="Lesson Name"
			  />
			  <input
				name="lessonLink"
				value={lesson.lessonLink}
				onChange={(event) => {
					 var temp = this.state.lessons;
					 temp[i].lessonLink = event.target.value;
					 this.setState({lessons: temp});
				}}
				type="text"
				placeholder="Lesson Link"
			  />
			  <input
				name="lessonSource"
				value={lesson.lessonSource}
				onChange={(event) => {
					console.log("hi");
					 var temp = this.state.lessons;
					 temp[i].lessonSource = event.target.value;
					 this.setState({lessons: temp});
				}}
				type="text"
				placeholder="Lesson Source"
			  />
			  <Button onClick={(event) => {
				  console.log("hi");
				var temp = this.state.lessons;
				temp.splice(i+1, 0, {lessonName:"", lessonLink:"", lessonSource:""}); //inserting
				this.setState({lessons:temp});
				console.log(this.state.lessons);
			  }}>
				"Add"
			  </Button>
			  <Button onClick={(event) => {
				if(lessons.length > 1){
					var temp = this.state.lessons;
					temp.splice(i, 1); //deleting
					this.setState({lessons:temp});
				}
			  }}>
				"Delete"
			  </Button>
		  </div>
		  ))}
		  

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
