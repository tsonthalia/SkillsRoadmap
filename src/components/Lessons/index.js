import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';

class LessonPageBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skillName: '',
      skillCreator: '',
      lessonName: '',
      lessonLink: '',
      lessonSource: '',
    }
  }

  componentDidMount() {
    const skillName = this.props.match.params.skillName;
    const lessonName = this.props.match.params.lessonName;

    this.props.firebase
      .lesson(skillName, lessonName)
      .on('value', snapshot => {
        if (snapshot.val() !== null) {
          this.setState({
            lessonName: snapshot.val().lessonName,
            lessonLink: snapshot.val().lessonLink,
            lessonSource: snapshot.val().lessonSource,
          })
        } else {
          this.setState({
            lessonName: "Lesson Does Not Exist"
          })
        }
      })
  }

  render() {
    const {
      skillName,
      skillCreator,
      lessonName,
      lessonSource,
      lessonLink
    } = this.state;

    return (
      <div>
        <h1>{skillName}</h1>
        <p>Creator: {skillCreator}</p>

        <p>{lessonName}</p>
        <p>{lessonSource}</p>
        <p><a href={lessonLink} target='_blank' rel='noopener noreferrer'>{lessonLink}</a></p>
      </div>
    )
  }
}

const INITIAL_STATE = {
  query: ''
}

class LessonsSearchFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { query } = this.state;

    this.props.history.push(this.props.history.location.pathname + '/' + query);

    event.preventDefault();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { query } = this.state;

    const isInvalid = query === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="query"
          value={query}
          onChange={this.onChange}
          type="text"
          placeholder="Search Lessons"
        />

        <button disabled={isInvalid} type="submit">
          Search
        </button>
      </form>
    )
  }
}

const LessonsSearchForm = compose(
  withRouter,
  withFirebase
)(LessonsSearchFormBase)

const LessonPage = withFirebase(LessonPageBase)

export default LessonPage;

export { LessonsSearchForm };
