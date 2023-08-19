import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../../store/auth-context';

import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const { t, i18n } = useTranslation();
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
  };

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>Monkey Casino</div>
      </Link>
      <nav>
        <ul>
          
          {!isLoggedIn && (<li>
            <Link to='/auth'>{t('form.login')}</Link>
          </li>)}
          {isLoggedIn && (<li>
            <Link to='/profile'>{t('navigation.profile')}</Link>
          </li>)}
          {isLoggedIn && <li>
            <button onClick={logoutHandler}>{t('navigation.logout')}</button>
          </li>}
          <li>
            <select className={classes.languageDropdown} onChange={changeLanguage}>
              <option value="en">{t('navigation.english')}</option>
              <option value="hr">{t('navigation.croatian')}</option>
            </select>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
