import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  // console.log(window.parent.document);
  window.parent.postMessage({message: 'Hello world'}, "*");

  // window.addEventListener('message', function(event) {
  //   // if(event.origin === 'http://localhost/3000')
  //   // {
  //     // alert('Received message: ' + event.data.message);
  //     console.log(event.data)
  //   // }
  //   // else
  //   // {
  //   //   alert('Origin not allowed!');
  //   // }
  // }, false);
  
  return (
    <div className="App">
      <h1>DOM tree widget</h1>
    </div>
  );
}

export default App;
