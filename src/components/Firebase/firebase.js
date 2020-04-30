import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';

const config = {
  apiKey: "AIzaSyCVaawr5mXNCfhFyF0snV95MzkU-0yMsxQ",
  authDomain: "skillsroadmap-9e371.firebaseapp.com",
  databaseURL: "https://skillsroadmap-9e371.firebaseio.com",
  projectId: "skillsroadmap-9e371",
  storageBucket: "skillsroadmap-9e371.appspot.com",
  messagingSenderId: "21925427186",
  appId: "1:21925427186:web:2a8f884ffb1af5a37fdd6b",
  measurementId: "G-R4TJGK8TE8"
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
    this.functions = app.functions();

    this.googleProvide = new app.auth.GoogleAuthProvider();
  }

  // EMAIL AUTH API
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);


  // GOOGLE AUTH API
  doSignInWithGoogle = () =>
    this.auth.signInWithPopup(this.googleProvider)


  // USER API
  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users');


  // SKILLS API
  skill = skillName => this.db.ref(`skills/${skillName}`)

  skills = () => this.db.ref('skills')

  // LESSONS API
  lesson = (skillName, lessonName) => this.db.ref(`skills/${skillName}/lessons/${lessonName}`)


  // MERGE AUTH USER AND DB USER API
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              ...dbUser,
            };

            next(authUser);
          })
      } else {
        fallback(authUser);
      }
    })

  doAddMessage = messageText => {
    var addMessage = this.functions.httpsCallable('addMessage')
    return addMessage({
      text: messageText
    })
  }

  doTest = () => {
    console.log(this.functions.httpsCallable('test'))
    return this.functions.httpsCallable('test');
  }

  doCreateSkill = (skillName, skillCreator, lessons) => {
    var createSkill = this.functions.httpCallable('createSkill');
    return null
  }
}

export default Firebase;
