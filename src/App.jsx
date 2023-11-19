import React, { useEffect } from 'react'
import styles from "./App.module.css"
import Login from './components/login/Login'
import cookies from "js-cookie"
import axios from 'axios'
import { useNavigate,Routes,Route } from 'react-router-dom';
const App = () => {
  
const Navigate = useNavigate();
  const token = cookies.get("unichat")


  useEffect(()=>{
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', // You may need to adjust the content type based on your API
    };
    axios.post("http://localhost:8080/api/user/verify",{headers}).then((res)=>{
      
      Navigate("/login")

    }).catch((err)=>{throw err})
  },[])
  return (
    <div>
      <Routes>
       <Route path="/login" element={<Login/>}/>
      </Routes>
    </div>
  )
}

export default App