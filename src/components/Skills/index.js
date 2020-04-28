import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { LessonsSearchForm } from '../Lessons';

class SkillsPageBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skillName: '',
      skillCreator: '',
      lessons: [],
    }
  }

  componentDidMount() {
    const skillName = this.props.match.params.skillName;

    this.props.firebase
      .skill(skillName)
      .on('value', snapshot => {
        const lessonsObject = snapshot.val().lessons;

        const lessonsList = Object.keys(lessonsObject).map(key => ({
          ...lessonsObject[key],
        }));

        this.setState({
          skillName: snapshot.val().skillName,
          skillCreator: snapshot.val().skillCreator,
          lessons: lessonsList,
        })
      })
  }

  render() {
    const {
      skillName,
      skillCreator,
      lessons
    } = this.state;

    return (
      <div>
        <h1>{skillName}</h1>
        <p>Creator: {skillCreator}</p>

        <LessonsSearchForm />
        {lessons.map((lesson, i) => (
          <div key={i}>
            <p>{lesson.lessonName}</p>
            <p>{lesson.lessonSource}</p>
            <p><a href={lesson.lessonLink} target='_blank' rel='noopener noreferrer'>{lesson.lessonLink}</a></p>
          </div>
        ))}
      </div>
    )
  }
}

const INITIAL_STATE = {
  query: ''
}

class SkillsSearchFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { query } = this.state;

    this.props.history.push('/skills/' + query);

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
          placeholder="Search Skills"
        />

        <button disabled={isInvalid} type="submit">
          Search
        </button>
      </form>
    )
  }
}

const SkillsSearchForm = compose(
  withRouter,
  withFirebase
)(SkillsSearchFormBase)

const SkillsPage = compose(
  withRouter,
  withFirebase
)(SkillsPageBase)

export default SkillsPage;

export { SkillsSearchForm };
