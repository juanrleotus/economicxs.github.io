import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        admin: 'Admin Panel',
        logout: 'Logout'
      },
      home: {
        title: 'Economicxs',
        subtitle: 'News Navigator',
        clickCountry: 'Click on any country to view newspapers'
      },
      country: {
        newspapers: 'Digital Newspapers',
        noNewspapers: 'No newspapers registered for this country yet',
        visitWebsite: 'Visit Website'
      },
      admin: {
        login: 'Login',
        username: 'Username',
        password: 'Password',
        dashboard: 'Admin Dashboard',
        newspapers: 'Newspapers',
        addNewspaper: 'Add Newspaper',
        editNewspaper: 'Edit Newspaper',
        deleteNewspaper: 'Delete Newspaper',
        title: 'Title',
        url: 'URL',
        country: 'Country',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        add: 'Add',
        confirmDelete: 'Are you sure you want to delete this newspaper?',
        deleteConfirm: 'Delete',
        deleteCancel: 'Cancel',
        welcome: 'Welcome to Admin Panel',
        totalNewspapers: 'Total Newspapers',
        countries: 'Countries'
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        admin: 'Panel Admin',
        logout: 'Cerrar Sesión'
      },
      home: {
        title: 'Economicxs',
        subtitle: 'Navegador de Noticias',
        clickCountry: 'Haz clic en cualquier país para ver periódicos'
      },
      country: {
        newspapers: 'Diarios Digitales',
        noNewspapers: 'No hay diarios registrados para este país aún',
        visitWebsite: 'Visitar Sitio Web'
      },
      admin: {
        login: 'Iniciar Sesión',
        username: 'Usuario',
        password: 'Contraseña',
        dashboard: 'Panel de Administración',
        newspapers: 'Diarios',
        addNewspaper: 'Agregar Diario',
        editNewspaper: 'Editar Diario',
        deleteNewspaper: 'Eliminar Diario',
        title: 'Título',
        url: 'URL',
        country: 'País',
        actions: 'Acciones',
        edit: 'Editar',
        delete: 'Eliminar',
        save: 'Guardar',
        cancel: 'Cancelar',
        add: 'Agregar',
        confirmDelete: '¿Estás seguro de que quieres eliminar este diario?',
        deleteConfirm: 'Eliminar',
        deleteCancel: 'Cancelar',
        welcome: 'Bienvenido al Panel de Administración',
        totalNewspapers: 'Total de Diarios',
        countries: 'Países'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;