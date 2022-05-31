import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import './assets/scss/global.scss'

initializeApp({
  apiKey: 'AIzaSyD2trh3VfGZ3ALVbFKrJe7wVENC-ze4y1g',
  authDomain: 'portfolio-images-580ff.firebaseapp.com',
  projectId: 'portfolio-images-580ff',
  storageBucket: 'portfolio-images-580ff.appspot.com',
  messagingSenderId: '723295325231',
  appId: '1:723295325231:web:76a26c96e934e19bc58ada'
})

const auth = getAuth()
signInAnonymously(auth)
  .then(() => console.log('signed in'))
  .catch(console.warn)

const app = createApp(App)

app.use(router)

app.mount('#app')
