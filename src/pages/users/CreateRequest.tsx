import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonHeader,IonFooter,IonText, IonToolbar, IonButtons, IonTitle, IonButton, IonCheckbox, IonLabel, IonItem, IonInput, IonAlert } from '@ionic/react';
import { supabase } from '../../utils/supabaseClient'; // Assuming you've set up Supabase client
import '../../components/CreateRequest.css'

const CreateRequest: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<any[]>([]);
  const [description, setDescription] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    // Fetch request types from Supabase
    const fetchRequestTypes = async () => {
      const { data, error } = await supabase.from('request_types').select('*');
      if (error) {
        setErrorMessage('Failed to load request types');
        return;
      }
      setRequests(data);
    };

    fetchRequestTypes();
  }, []);

  // Update total price based on selected requests
  const updateTotalPrice = (requestId: number, checked: boolean) => {
    let price = totalPrice;
    const request = requests.find((req) => req.id === requestId);

    if (request) {
      price = checked ? price + request.price : price - request.price;
    }
    setTotalPrice(price);
  };

  // Handle changes to selected requests
  const handleRequestChange = (event: any) => {
    const requestId = parseInt(event.target.value);
    const checked = event.target.checked;
    
    if (checked) {
      setSelectedRequests((prev) => [...prev, requestId]);
    } else {
      setSelectedRequests((prev) => prev.filter((id) => id !== requestId));
    }

    updateTotalPrice(requestId, checked); // Update the total price
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedRequests.length === 0) {
      setErrorMessage('Please select at least one request.');
      setShowAlert(true);
      return;
    }

    const userId = sessionStorage.getItem('id');
    if (!userId) {
      setErrorMessage('User not logged in.');
      setShowAlert(true);
      return;
    }

    const insertData = selectedRequests.map((requestId) => {
      const request = requests.find((req) => req.id === requestId);
      return {
        user_id: userId,
        request_id: requestId,
        status: 'pending',
        total_price: request?.price || 0,
        description,
      };
    });

    const { error } = await supabase.from('user_requests').insert(insertData);

    if (error) {
      setErrorMessage('Error submitting requests. Please try again.');
      setShowAlert(true);
    } else {
      window.location.href = '/siafinals/dashboard'; // Redirect to dashboard after successful submission
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle>Create Request</IonTitle>
          <IonButtons slot="end">
            <IonButton
              fill="clear"
              color="light"
              onClick={() => (window.location.href = '/siafinals/dashboard')}
            >
              Home
            </IonButton>
            <IonButton
              fill="clear"
              color="light"
              onClick={async () => {
                await supabase.auth.signOut();
                sessionStorage.clear();
                window.location.href = '/siafinals/home';
              }}
            >
              Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {showAlert && (
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header="Error"
            message={errorMessage}
            buttons={['OK']}
          />
        )}

        <h2>Create Request</h2>
        <p>Please select the items you want to request.</p>

        <form onSubmit={handleSubmit}>
          <div className="request-list">
            {requests.map((request) => (
              <IonItem key={request.id}>
                <IonCheckbox
                  slot="start"
                  value={request.id}
                  onIonChange={handleRequestChange}
                />
                <IonLabel>{request.request_name} - ${request.price.toFixed(2)}</IonLabel>
              </IonItem>
            ))}
          </div>

          <div className="total-price">
            <h4>Total Price: ${totalPrice.toFixed(2)}</h4>
          </div>

          <div className="description-input">
            <h4>Please provide a description for your request (optional):</h4>
            <IonInput
              value={description}
              onIonChange={(e) => setDescription(e.detail.value!)}
              placeholder="Enter description"
              debounce={0}
              clearInput
            />
          </div>

          <div className="submit-btn">
            <IonButton expand="block" type="submit" color="primary">
              Send Request
            </IonButton>
          </div>
        </form>
      </IonContent>
            <IonFooter>
        <IonToolbar>
          <IonText color={'dark'}>
            <p>© 2024 Northern Bukidnon State College. All Rights Reserved.</p>
          </IonText>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default CreateRequest;
