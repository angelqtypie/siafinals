import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonFooter, IonContent, IonButton, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import '../../components/Admindash.css';

const AdminDashboard: React.FC = () => {
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('adminUsername');
    history.push('/siafinals/home');
  };

  useEffect(() => {
    // Fetch admin username from localStorage or other source
    const username = localStorage.getItem('adminUsername');
    setAdminUsername(username);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Admin Dashboard</IonTitle>
            <IonButton slot='end' onClick={handleLogout} color="danger">Logout</IonButton>
       
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', color: '#1f4e79', fontWeight: '700' }}>Admin Dashboard</h1>
          <p style={{ fontSize: '18px', color: '#777' }}>Manage users, requests, feedback, and system settings.</p>
        </div>

        <IonGrid>
          <IonRow className="ion-text-center">
            <IonCol size="12" sizeMd="4">
              <IonCard className="dashboard-card">
                <IonCardContent>
                  <h5 style={{ fontSize: '20px', fontWeight: '600' }}>Manage Users</h5>
                  <p>View all the users registered in the system.</p>
                  <IonButton routerLink="/siafinals/manageusers" color="primary" expand="block">Go to Users</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard className="dashboard-card">
                <IonCardContent>
                  <h5 style={{ fontSize: '20px', fontWeight: '600' }}>View Requests</h5>
                  <p>Review and process user requests efficiently.</p>
                  <IonButton routerLink="/siafinals/viewrequests" color="primary" expand="block">View Requests</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard className="dashboard-card">
                <IonCardContent>
                  <h5 style={{ fontSize: '20px', fontWeight: '600' }}>Add Products</h5>
                  <p>Add, modify, and delete products in the system.</p>
                  <IonButton routerLink="/siafinals/addproducts" color="primary" expand="block">Add Products</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow className="ion-text-center">
            <IonCol size="12" sizeMd="4">
              <IonCard className="dashboard-card">
                <IonCardContent>
                  <h5 style={{ fontSize: '20px', fontWeight: '600' }}>View Feedbacks</h5>
                  <p>View and manage feedbacks provided by the users.</p>
                  <IonButton routerLink="/siafinals/viewfeedbacks" color="primary" expand="block">View Feedbacks</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
              <IonToolbar>
                <IonText color={'dark'}>
                  <p>© 2024 Northern Bukidnon State College. All Rights Reserved.</p>
                </IonText>
              </IonToolbar>
            </IonFooter>
    </IonPage>
  );
};

export default AdminDashboard;
