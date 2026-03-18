import React from 'react';
import { useState, useEffect } from 'react';
import NavBar from './components/navbar/NavBar.jsx';

function App() {

  const [searchQuery,setSearchQuery] = useState("");

  return (
    <>
      <NavBar/> {/*Pass in searchQuery soon as props*/}
      

    </>
  );
}

export default App
