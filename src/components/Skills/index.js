import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import { LessonsSearchForm } from '../Lessons';

class SkillsPageBase extends Component {

  render() {
    const { skillName } = this.props.match.params;

    return (
      <AuthUserContext.Consumer>
        {authUser =>
          authUser ? (
            <SkillsPageAuth
              authUser={authUser}
              skillName={skillName}
            />
          ) : (
            <SkillsPageNonAuth
              skillName={skillName}
            />
          )
        }
      </AuthUserContext.Consumer>
    )
  }
}

class SkillsPageAuthBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skillName: '',
      skillCreator: '',
      lessons: [],
      isLiked: false,
      isModerated: false,
    }
  }

  componentDidMount() {
    const skillName = this.props.skillName;

    this.props.firebase
      .skill(skillName)
      .on('value', snapshot => {
        if (snapshot.val() !== null) {
          const lessonsObject = snapshot.val().lessons;

          const lessonsList = Object.keys(lessonsObject).map(key => ({
            ...lessonsObject[key],
          }));

          this.setState({
            skillName: snapshot.val().skillName,
            skillCreator: snapshot.val().skillCreator,
            lessons: lessonsList,
          })
        } else {
          this.setState({
            skillName: "Skill Does Not Exist",
          })
        }
      })

    this.props.firebase
      .userSpecific(this.props.authUser.uid, 'likedSkills')
      .once('value')
      .then(snapshot => {
        if (snapshot.child(skillName).exists()) {
          this.setState({ isLiked: true })
        }
      })
      .catch(error => {
        console.log(error.message);
      })

    this.props.firebase
      .userSpecific(this.props.authUser.uid, 'moderatedSkills')
      .once('value')
      .then(snapshot => {
        if (snapshot.child(skillName).exists()) {
          this.setState({ isModerated: true })
        }
      })
      .catch(error => {
        console.log(error.message);
      })
  }

  onLike = () => {
    const { skillName } = this.state;

    this.props.firebase
      .userSpecific(this.props.authUser.uid, 'likedSkills')
      .update({
        [skillName]: skillName,
      })
      .then(() => {
        // console.log("Success")
        this.setState({ isLiked: true });
      })
      .catch(error => {
        console.log("Add Failed: " + error.message)
      })
  }

  onUnlike = () => {
    const { skillName } = this.state;

    this.props.firebase
      .userSpecific(this.props.authUser.uid, 'likedSkills')
      .child(skillName)
      .remove()
      .then(() => {
        // console.log("Success")
        this.setState({ isLiked: false });
      })
      .catch(error => {
        console.log("Remove Failed: " + error.message)
      })
  }

  onModerate = () => {
    const { skillName } = this.state;

    this.props.firebase
      .userSpecific(this.props.authUser.uid, 'moderatedSkills')
      .update({
        [skillName]: skillName,
      })
      .then(() => {
        // console.log("Success")
        this.setState({ isModerated: true });
      })
      .catch(error => {
        console.log("Moderate Failed: " + error.message)
      })
  }

  onUnmoderate = () => {
    const { skillName } = this.state;

    this.props.firebase
      .userSpecific(this.props.authUser.uid, 'likedSkills')
      .child(skillName)
      .remove()
      .then(() => {
        // console.log("Success")
        this.setState({ isModerated: false });
      })
      .catch(error => {
        console.log("Unmoderate Failed: " + error.message)
      })
  }

  render() {
    const {
      skillName,
      skillCreator,
      lessons,
      isLiked,
      isModerated,
    } = this.state;

    return (
      <div>
        <h1>{skillName}</h1>
        <p>Creator: {skillCreator}</p>
        {
          !isLiked ? (
            <button onClick={() => this.onLike()}>Like this Skill</button>
          ) : (
            <button onClick={() => this.onUnlike()}>Unlike this Skill</button>
          )
        }

        {
          !isModerated ? (
            <button onClick={() => this.onModerate()}>Moderate this Skill</button>
          ) : (
            <button onClick={() => this.onUnmoderate()}>Stop Moderating this Skill</button>
          )
        }

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

class SkillsPageNonAuthBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skillName: '',
      skillCreator: '',
      lessons: [],
    }
  }

  componentDidMount() {
    const skillName = this.props.skillName;

    this.props.firebase
      .skill(skillName)
      .on('value', snapshot => {
        if (snapshot.val() !== null) {
          const lessonsObject = snapshot.val().lessons;

          const lessonsList = Object.keys(lessonsObject).map(key => ({
            ...lessonsObject[key],
          }));

          this.setState({
            skillName: snapshot.val().skillName,
            skillCreator: snapshot.val().skillCreator,
            lessons: lessonsList,
          })
        } else {
          this.setState({
            skillName: "Skill Does Not Exist",
          })
        }
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

const SkillsPageNonAuth = withFirebase(SkillsPageNonAuthBase)
const SkillsPageAuth = withFirebase(SkillsPageAuthBase)


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

const SkillsPage = withFirebase(SkillsPageBase)

export default SkillsPage;

export { SkillsSearchForm };
