import React, { useState, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';

const validators = {
  minLength: (value, targetLength) => value.length >= targetLength,
  maxLength: (value, targetLength) => value.length <= targetLength,
  regex: (value, regex, modifiers = "") => new RegExp(regex, modifiers).test(value),
  emailValidator: (value) => /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/.test(value),
  olderThan: (value, age) => {
    const birthDate = new Date(value);
    const currentDate = new Date();
    const ageDifference = currentDate.getFullYear() - birthDate.getFullYear();
    return ageDifference >= age;
  },
  passwordStrength: (value, regex) => new RegExp(regex).test(value),
  matchesField: (value, targetField, fields) => value === fields[targetField],
};

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

  const validateInput = (validatorKey, value, ...params) => {
    return validators[validatorKey](value, ...params);
  };
  const proceedToNextStep = (event) => {
    event.preventDefault();

    // Validacije za korak 1
    const enteredName = nameInputRef.current.value;
    const enteredSurname = surnameInputRef.current.value;
    const enteredDOB = dobInputRef.current.value;
    const enteredPhoneNumber = phoneNumberInputRef.current.value;

    if (!enteredName || !enteredSurname || !enteredDOB || !enteredPhoneNumber) {
      alert(t('messages.emptyFieldsAlert'));
      return;
    }

    if (!validateInput('olderThan', enteredDOB, 18)) { // Osobe mlađe od 18 godina ne smiju se registrirati
      alert(t('messages.underageError'));
      return;
    }

    // Preskoči na korak 2
    setRegistrationStep(2);
  };

  const submitHandler = (event) => {
    event.preventDefault();
  
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
  
    // Ako je korisnik u modusu prijave, ne trebate provjeravati ostala polja
    if (isLogin) {
      if (!enteredEmail || !enteredPassword) {
        alert(t('messages.emptyFieldsAlert'));
        return;
      }

      if (!validateInput('emailValidator', enteredEmail)) {
        alert(t('messages.invalidEmail'));
        return;
      }
    } else {
      const enteredUsername = usernameInputRef.current.value;
      const enteredPasswordConfirm = passwordConfirmInputRef.current.value;
      const acceptedTerms = termsInputRef.current.checked;
  
      if (!enteredEmail || !enteredUsername || !enteredPassword || !enteredPasswordConfirm) {
        alert(t('messages.emptyFieldsAlert'));
        return;
      }

      if (!validateInput('emailValidator', enteredEmail)) {
        alert(t('messages.invalidEmail'));
        return;
      }

      if (enteredPassword !== enteredPasswordConfirm) {
        alert(t('messages.passwordsDontMatch'));
        return;
      }
  
      if (!acceptedTerms) {
        alert(t('messages.termsAndConditions'));
        return;
      }
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
        history('/', { replace: true });

      })
      .catch((err) => {
            
             
          
          
      
        alert(err.message);
      });
  };
  


  
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? t('form.login') : t('form.register')}</h1>
      {isLogin ? (
        <form onSubmit={submitHandler}>
          <div className={classes.control}>
            <label htmlFor='email'>{t('form.email')}</label>
            <input type='email' id='email' required ref={emailInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor='password'>{t('form.password')}</label>
            <input type='password' id='password' required ref={passwordInputRef} />
          </div>
          <div className={classes.actions}>
            {!isLoading && <button>{t('form.login')}</button>}
            {isLoading && 
            <>
             <p>{t('messages.sendingRequest')}</p>
             <div className={classes.loader}></div>
            </>
           }
          </div>
        </form>
      ) : (
        <>
          {registrationStep === 1 ? (
            <form onSubmit={proceedToNextStep}>
              <div className={classes.control}>
                <label htmlFor='name'>{t('form.name')}</label>
                <input type='text' id='name' required ref={nameInputRef} />
              </div>
              <div className={classes.control}>
                <label htmlFor='surname'>{t('form.surname')}</label>
                <input type='text' id='surname' required ref={surnameInputRef} />
              </div>
              <div className={classes.control}>
                <label htmlFor='dob'>{t('form.dateOfBirth')}</label>
                <input type='date' id='dob' required ref={dobInputRef} />
              </div>
              <div className={classes.control}>
                <label htmlFor='phoneNumber'>{t('form.phoneNumber')}</label>
                <input type='tel' id='phoneNumber' required ref={phoneNumberInputRef} />
              </div>
              <div className={classes.actions}>
              <button type='submit'>{t('form.next')}</button>
              </div>
            </form>
          ) : (
            <form onSubmit={submitHandler}>
              <div className={classes.control}>
                <label htmlFor='email'>{t('form.email')}</label>
                <input type='email' id='email' required ref={emailInputRef} />
              </div>
              <div className={classes.control}>
                <label htmlFor='username'>{t('form.username')}</label>
                <input type='text' id='username' required ref={usernameInputRef} />
              </div>
              <div className={classes.control}>
                <label htmlFor='password'>{t('form.password')}</label>
                <input type='password' id='password' required ref={passwordInputRef} />
              </div>
              <div className={classes.control}>
                <label htmlFor='passwordConfirm'>{t('form.confirmPassword')}</label>
                <input type='password' id='passwordConfirm' required ref={passwordConfirmInputRef} />
              </div>
              <div className={classes.control}>
                <label>
                  <input type='checkbox' id='terms' ref={termsInputRef} /> {t('form.termsAndConditions')}
                </label>
              </div>
              <div className={classes.actions}>
                {!isLoading && <button>{t('form.register')}</button>}
                {isLoading && <>
             <p>{t('messages.sendingRequest')}</p>
             <div className="loader"></div>
            </>}
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
          {isLogin ? t('form.newAccount') : t('form.exsitAccount')}
        </button>
      </div>
    </section>
  );
};



export default AuthForm;