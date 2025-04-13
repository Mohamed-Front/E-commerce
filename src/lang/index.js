// i18n.js
import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
  en: {
    // English messages
    welcome: 'Welcome',
    // other messages...
  },
  ar: {
    // Arabic messages
    welcome: 'أهلاً بك',
    // other messages...
  },
};

const i18n = new VueI18n({
  locale: 'en', // default locale
  messages,
});

export default i18n;
