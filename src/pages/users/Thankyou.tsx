import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import '../../components/Thankyou.css';

const ThankYou: React.FC = () => {
  const history = useHistory();

  const handleBackToDashboard = () => {
    history.push('/siafinals/dashboard');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Thank You!</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="thank-you-content">
        <div className="card">
          <h1>🎉 Thank You!</h1>
          <p>Your feedback has been successfully submitted. <br /> We appreciate your time and thoughts!</p>
          <IonButton expand="block" color="primary" onClick={handleBackToDashboard}>
            Back to Dashboard
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ThankYou;
