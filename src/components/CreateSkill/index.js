import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Button } from 'react-bootstrap';

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
  lessons: [{
    lessonName: "",
    lessonLink: "",
    lessonSource: ""
  }],
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
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  onChangeSkillName = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onChangeLesson = (event, i) => {
    var temp = this.state.lessons;
    temp[i][event.target.name] = event.target.value;
    this.setState({ lessons: temp });
  }

  onAddLesson = (event, i) => {
    var temp = this.state.lessons;
    temp.splice(i+1, 0, {lessonName:"", lessonLink:"", lessonSource:""}); // Inserting Lesson
    this.setState({ lessons: temp });
  }

  onDeleteLesson = (event, i) => {
    if(this.state.lessons.length > 1){
      var temp = this.state.lessons;
      temp.splice(i, 1); // Deleting Lesson
      this.setState({ lessons: temp });
    }
  }

  render() {
    const {
      skillName,
      lessons,
      error,
    } = this.state;

    const isInvalid =
      skillName === '' ||
      lessons[0].lessonName === '' ||
      lessons[0].lessonLink === '' ||
      lessons[0].lessonSource === '';

    const isInvalidDelete = lessons.length <= 1;

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

		      {
            lessons.map((lesson, i) => (
              <div key={i}>
                <input
                  name="lessonName"
                  value={lesson.lessonName}
                  onChange={(event) => this.onChangeLesson(event, i)}

                  type="text"
                  placeholder="Lesson Name"
                />
                <input
                  name="lessonLink"
                  value={lesson.lessonLink}
                  onChange={(event) => this.onChangeLesson(event, i)}
                  type="text"
                  placeholder="Lesson Link"
                />
                <input
                  name="lessonSource"
                  value={lesson.lessonSource}
                  onChange={(event) => this.onChangeLesson(event, i)}
                  type="text"
                  placeholder="Lesson Source"
                />

                <Button onClick={(event) => this.onAddLesson(event, i)} >
                  Add
                </Button>

                <Button
                  onClick={(event) => this.onDeleteLesson(event, i)}
                  disabled={isInvalidDelete}
                >
                  Delete
                </Button>
              </div>
            ))
          }

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
