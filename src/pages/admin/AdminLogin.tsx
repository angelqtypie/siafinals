import React, { useState } from 'react';
import { IonButton, IonContent, IonInput, IonPage, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient'; // Make sure to initialize Supabase in a separate file

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      // Query Supabase for matching admin credentials
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error) {
        setError('Invalid Admin Username or Password!');
        return;
      }

      // Store session data in localStorage (or use state management like Redux)
      localStorage.setItem('admin', data.username);
      localStorage.setItem('admin_id', data.id);

      // Redirect to the Admin Dashboard
      history.push('/siafinals/admindashboard');
    } catch (err) {
      console.error(err);
      setError('An error occurred, please try again.');
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="login-container">
          <IonText color="primary">
            <h2>Admin Login</h2>
          </IonText>

          {error && <IonText color="danger"><p>{error}</p></IonText>}

          <IonInput
            value={username}
            onIonChange={(e) => setUsername(e.detail.value!)}
            placeholder="Username"
            type="text"
            required
          />
          <IonInput
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
            placeholder="Password"
            type="password"
            required
          />
          
          <IonButton expand="full" onClick={handleLogin}>Login</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminLogin;