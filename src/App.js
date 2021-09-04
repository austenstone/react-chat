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
      {user ? <Chat user={user} /> : <SignIn />}
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in</button>
  )
}


export default App;
