import {useRef, useContext} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const newPaswordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const { t} = useTranslation();
  const history = useNavigate();

  const submitHandler =(event)=> {
    event.preventDefault();
    const enteredNewPassword = newPaswordInputRef.current.value;
// add validation
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDVumzBi9pham3Oy5EyGdMpUhjY0sY1Lng', {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      history.replace('/');


    });
  };


  
  return (
    <div>
    <h1>{t('messages.yourProfile')}</h1>
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>{t('form.newPassword')}</label>
        <input type='password' id='new-password' minLength="7" ref={newPaswordInputRef}/>
      </div>
      <div className={classes.action}>
        <button>{t('form.changePassword')}</button>
      </div>
    </form>
    </div>
  );
}

export default ProfileForm;
