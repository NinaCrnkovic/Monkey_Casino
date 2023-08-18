import React, { useState, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const history = useNavigate();
  const { t } = useTranslation();
  const nameInputRef = useRef();
  const surnameInputRef = useRef();
  const dobInputRef = useRef(); // Date of Birth
  const phoneNumberInputRef = useRef();
  const emailInputRef = useRef();
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();
  const termsInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
    setRegistrationStep(1); // Reset registration step if switching mode
  };

  const proceedToNextStep = (event) => {
    event.preventDefault();

    // Validations for step 1
    const enteredName = nameInputRef.current.value;
    const enteredSurname = surnameInputRef.current.value;
    const enteredDOB = dobInputRef.current.value;
    const enteredPhoneNumber = phoneNumberInputRef.current.value;

    if (!enteredName || !enteredSurname || !enteredDOB || !enteredPhoneNumber) {
        alert('Please fill in all the fields!');
        return;
    }

    // Move to step 2
    setRegistrationStep(2);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredUsername = usernameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredPasswordConfirm = passwordConfirmInputRef.current.value;
    const acceptedTerms = termsInputRef.current.checked;

    // Validations for step 2
    if (!enteredEmail || !enteredUsername || !enteredPassword || !enteredPasswordConfirm) {
        alert('Please fill in all the fields!');
        return;
    }

    if (enteredPassword !== enteredPasswordConfirm) {
        alert('Passwords do not match!');
        return;
    }

    if (!acceptedTerms) {
        alert('You must accept the terms and conditions to proceed!');
        return;
    }

    setIsLoading(true);


    let url;

    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDVumzBi9pham3Oy5EyGdMpUhjY0sY1Lng'
  
  
    } else {
      url= 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDVumzBi9pham3Oy5EyGdMpUhjY0sY1Lng'
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'Authentication failed!';
             if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
             }
  
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        const expirationTime = new Date(new Date().getTime() + (+data.expiresIn *1000));
        authCtx.login(data.idToken, expirationTime);
        history.replace('/');
      })
      .catch((err) => {
            
             
          
          
      
        alert(err.message);
      });
  };
  


  
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? t('login') : t('register')}</h1>
      {isLogin ? (
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor='email'>{t('email')}</label>
            <input type='email' id='email' required ref={emailInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor='password'>{t('password')}</label>
            <input type='password' id='password' required ref={passwordInputRef} />
          </div>
          <div className={classes.actions}>
            {!isLoading && <button>{t('login')}</button>}
            {isLoading && <p>Sending request...</p>}
          </div>
        </form>
      ) : (
        <>
          {registrationStep === 1 ? (
            <form onSubmit={proceedToNextStep}>
              <div className={classes.control}>
                <label htmlFor='name'>{t('name')}</label>
                <input type='text' id='name' required ref={nameInputRef} />
              </div>
              <div className={classes.control}>
                <label htmlFor='surname'>{t('surname')}</label>
                <input type='text' id='surname' required ref={surnameInputRef} />
              </div>
              <div className={classes.control}>
                <label htmlFor='dob'>{t('dateOfBirth')}</label>
                <input type='date' id='dob' required ref={dobInputRef} />
              </div>
              <div className={classes.control}>
                <label htmlFor='phoneNumber'>{t('phoneNumber')}</label>
                <input type='tel' id='phoneNumber' required ref={phoneNumberInputRef} />
              </div>
              <div className={classes.actions}>
              <button type='submit'>{t('next')}</button>
              </div>
            </form>
          ) : (
            <form onSubmit={submitHandler}>
              <div className={classes.control}>
                <label htmlFor='email'>{t('email')}</label>
                <input type='email' id='email' required ref={emailInputRef} />
              </div>
              <div className={classes.control}>
                <label htmlFor='username'>{t('username')}</label>
                <input type='text' id='username' required ref={usernameInputRef} />
              </div>
              <div className={classes.control}>
                <label htmlFor='password'>{t('password')}</label>
                <input type='password' id='password' required ref={passwordInputRef} />
              </div>
              <div className={classes.control}>
                <label htmlFor='passwordConfirm'>{t('confirmPassword')}</label>
                <input type='password' id='passwordConfirm' required ref={passwordConfirmInputRef} />
              </div>
              <div className={classes.control}>
                <label>
                  <input type='checkbox' id='terms' ref={termsInputRef} /> {t('termsAndConditions')}
                </label>
              </div>
              <div className={classes.actions}>
                {!isLoading && <button>{t('register')}</button>}
                {isLoading && <p>Sending request...</p>}
              </div>
            </form>
          )}
        </>
      )}
      <div className={classes.actions}>
        <button
          type='button'
          className={classes.toggle}
          onClick={switchAuthModeHandler}
        >
          {isLogin ? t('newAccount') : t('exsitAccount')}
        </button>
      </div>
    </section>
  );
};



export default AuthForm;