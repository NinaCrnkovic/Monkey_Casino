import classes from './StartingPageContent.module.css';
import { useTranslation } from 'react-i18next';

const StartingPageContent = () => {
  const { t } = useTranslation();
  return (
    <section className={classes.starting}>
     <h1>{t('messages.welcome')}</h1>
    </section>
  );
};

export default StartingPageContent;
