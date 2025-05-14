import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonCardContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import '../../../src/components/Thankyou.css';

const ThankYou: React.FC = () => {
  const history = useHistory();

  const handleBackToDashboard = () => {
    history.push('/siafinals/dashboard');
  };

  return (
    <IonPage>
      <IonHeader >
        <IonToolbar>
          <IonTitle>Thank You!</IonTitle>
        </IonToolbar>
      </IonHeader>

<IonCardContent className="thank-you-content">
  <div className="card">
    <h1>🎉 Thank You!</h1>
    <p>Your feedback has been successfully submitted.<br />We appreciate your time and thoughts!</p>
    <IonButton expand="block" onClick={handleBackToDashboard}>
      BACK TO DASHBOARD
    </IonButton>
  </div>
</IonCardContent>

    </IonPage>
  );
};

export default ThankYou;
