import './App.css';

import firebase from 'firebase/compat/app';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './Firebase';
import { Header } from './Header';
import { Chat } from './Chat';


function App() {
  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <Header />
      {user ? <Chat /> : <SignIn />}
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  const signInWithFB = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <div className="sign-in">
      <button className="sign-in-google" onClick={signInWithGoogle}>Sign in with Google</button>
      <button className="sign-in-google" onClick={signInWithFB}>Sign in with Facebook</button>
    </div>
  )
}


export default App;
