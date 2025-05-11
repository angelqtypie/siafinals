import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('adminUsername');
    history.push('/siafinals/home');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Admin Dashboard</IonTitle>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', paddingRight: '16px' }}>
            <IonText color="light" style={{ marginRight: '10px' }}>
              Welcome, {adminUsername}
            </IonText>
            <IonButton onClick={handleLogout} color="danger">Logout</IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '32px', color: '#1f4e79' }}>Admin Dashboard</h1>
          <p>Manage users, requests, feedback, and system settings.</p>
        </div>

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <h5>Manage Users</h5>
                  <p>View all the users registered in the system.</p>
                  <IonButton routerLink="/siafinals/manageusers" color="warning">Go to Users</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <h5>View Requests</h5>
                  <p>Review and process user requests efficiently.</p>
                  <IonButton routerLink="/siafinals/viewrequests" color="warning">View Requests</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <h5>Add Products</h5>
                  <p>Add, modify, and delete products in the system.</p>
                  <IonButton routerLink="/siafinals/addproducts" color="warning">Add Products</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <h5>View Feedbacks</h5>
                  <p>View and manage feedbacks provided by the users.</p>
                  <IonButton routerLink="/siafinals/viewfeedbacks" color="warning">View Feedbacks</IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;