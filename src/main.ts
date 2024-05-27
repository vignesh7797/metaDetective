import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC58MdJlSrk1Ld7hzsyM4JFQ9hQsamoGjg",
  authDomain: "meta-detective.firebaseapp.com",
  projectId: "meta-detective",
  storageBucket: "meta-detective.appspot.com",
  messagingSenderId: "2434976096",
  appId: "1:2434976096:web:69e284cf1ddc8b512c3605",
  measurementId: "G-592MK1TRF8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
