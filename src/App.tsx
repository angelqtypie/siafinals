import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import AddProducts from './pages/admin/AddProducts';
import AdminLogin from './pages/admin/AdminLogin';
import ManageUsers from './pages/admin/ManageUsers';
import ViewFeedbacks from './pages/admin/ViewFeedbacks';
import ViewRequests from './pages/admin/ViewRequests';
import AdminDashboard from './pages/admin/AdminDashboard';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/siafinals/adminlogin">
          <AdminLogin /></Route>
        <Route exact path="/siafinals/addproducts">
          <AddProducts /></Route>
        <Route exact path="/siafinals/manageusers">
          <ManageUsers /></Route>
        <Route exact path="/siafinals/viewfeedbacks">
          <ViewFeedbacks /></Route>
        <Route exact path="/siafinals/viewrequests">
          <ViewRequests /></Route>
        <Route exact path="/siafinals/admindashboard">
          <AdminDashboard /></Route>          
        <Route exact path="/siafinals/home">
          <Home />

        </Route>
        <Route exact path="/siafinals/">
          <Redirect to="/siafinals/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
