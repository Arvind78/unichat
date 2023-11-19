import React, { useState } from 'react';
import Styles from "./Styles.module.css";
import googleImg from "../../assets/google.png";
import uniChatIcon from "../../assets/Unichat icon.png";
import {notification} from "antd";
import sideImg from "../../assets/Data_security_02.jpg";
import axios, { formToJSON } from "axios";  
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from '../firebase/firebase';
 import cookies from "js-cookie"

const Login = () => {
  const [message,errorMessage] =notification.useNotification();
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    email: null,
    password: null
  });

  // Handle input change for email and password
  const handleInputValue = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    setErrors({
      email:"",
      password:""
    });
  };

  // Form validation logic
  const formValidation = () => {
    if (loginData.email === "") {
      setErrors({
        email: "Email is required"
      });
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(loginData.email)) {
      setErrors({
        email: 'Invalid email address'
      });
      return false;
    }

    if (loginData.password === "") {
      setErrors({
        password: 'Password is required'
      });
      return false;
    }

    return true;  // Return true if all validations pass
  };

  // Handle user login
  const handleUserLogin = (e) => {
    e.preventDefault();
    if (!formValidation()) {
      return false;
    } else {
      // Perform login logic using axios
      axios.post("http://localhost:8080/api/user/signin",loginData)
        .then((res) => {
          cookies.set('unichat', res.data.token, { expires: 30 })
          message.success({
            placement:"top",
            message:res.data.message, 
           })
        })
        .catch((err) => {
          console.error(err);
          return false;
        });
    }
  };



  // Handle sign in with Google
  const handleSignInWithGoogle = () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        axios.post("http://localhost:8080/api/user/google/auth", {email:user.email,fullName:user.displayName,profileImg:user.photoURL})
        .then((res) => {
          if(res.data.token){
            cookies.set('unichat', res.data.token, { expires: 30 })
          }
          message.success({
           placement:"top",
           message:res.data.message, 
          })

        })
        .catch((err) => {
          console.error(err);
        })
      }).catch((error) => {
        const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(credential);
      });
  };

  return (
    <div className={Styles.mainContainer}>
      {errorMessage}
     <div className={Styles.designContainer}></div>
     <div className={Styles.loginformContainer}>

      <div className={Styles.loginContainer}>
        <div className={Styles.imgContainer}>
          <img src={sideImg} alt="Side Image" />
        </div>
        <div className={Styles.formContainer}>
          <div className={Styles.formHeading}>
            <img src={uniChatIcon} alt="UniChat Icon" />
            <h2>Welcome Back</h2>
          </div>

          <form className={Styles.form} onSubmit={handleUserLogin}>
            <div className={Styles.formField}>
              <label htmlFor="email" style={{ color: errors.email && "red" }}>Email <sup>*</sup></label>
              <input
                type="text"
                id="email"
                name="email"
                onChange={handleInputValue}
                style={{ border: errors.email && "1px solid red", color: errors.email && "red" }}
                value={loginData.email}
                placeholder="Enter your email"
              />
              <p className={Styles.errors}>{errors.email}</p>
            </div>

            <div className={Styles.formField}>
              <label htmlFor="password" style={{ color: errors.password && "red" }}>Password <sup>*</sup></label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleInputValue}
                style={{ border: errors.password && "1px solid red", color: errors.password && "red" }}
                value={loginData.password}
                placeholder="Enter your password"
              />
              <p className={Styles.errors}>{errors.password}</p>
            </div>

            <div className={Styles.forget}>
              <span>Forget password</span>
            </div>

            <div className={Styles.loginBtn}>
              <button type='submit'>Login</button>
            </div>

          </form>
          <div className={Styles.otherSigninOption}>
            <h3>Or</h3>
          </div>
          <div className={Styles.googleBtn}>
            <button onClick={handleSignInWithGoogle}>
              <img height={"25px"} width={"25px"} src={googleImg} alt="Google Logo" />
              Sign in with Google
            </button>
          </div>

          <div className={Styles.signupClickOption}>
            <p>Don’t have an account? <span onClick={()=>setFormToogle(!formToogle)}>Signup here</span></p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Login;
