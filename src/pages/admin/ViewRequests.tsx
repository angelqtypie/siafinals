import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient'; // Assuming you have supabaseClient configured
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import '../../components/ViewReq.css'; // Import the CSS for styling

interface UserRequest {
  id: number;
  user_id: string;
  request_id: string;
  status: string;
  date_requested: string;
  total_price: number;
  description: string;
}

const ViewRequests: React.FC = () => {
  const [userRequests, setUserRequests] = useState<UserRequest[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const history = useHistory();

  const fetchUserRequests = async () => {
    const { data, error } = await supabase.from('user_requests').select('*');
    if (error) {
      console.error('Error fetching requests:', error.message);
    } else {
      setUserRequests(data as UserRequest[]);
    }
  };

  const updateStatus = async (status: string, id: number) => {
    const { error } = await supabase
      .from('user_requests')
      .update({ status })
      .eq('id', id);
    if (error) {
      console.error('Error updating status:', error.message);
      setSuccessMessage('Error updating status');
    } else {
      setSuccessMessage('Status updated successfully');
      fetchUserRequests();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    history.push('/siafinals/home');
  };

  const goToHome = () => {
    history.push('/siafinals/admindashboard');
  };

  useEffect(() => {
    fetchUserRequests();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>User Requests</IonTitle>
          <IonButton slot="end" onClick={goToHome} color="light">
            Home
          </IonButton>
          <IonButton slot="end" onClick={handleLogout} color="light">
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {successMessage && (
          <IonText color="success">
            <div className="success-message">{successMessage}</div>
          </IonText>
        )}

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Request ID</th>
              <th>Status</th>
              <th>Date Requested</th>
              <th>Total Price</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.user_id}</td>
                <td>{request.request_id}</td>
                <td className={`status-${request.status.toLowerCase()}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </td>
                <td>{request.date_requested}</td>
                <td>{request.total_price.toFixed(2)}</td>
                <td>{request.description}</td>
                <td className="actions">
                  <IonButton
                    color="success"
                    onClick={() => updateStatus('approved', request.id)}
                  >
                    Approve
                  </IonButton>
                  <IonButton
                    color="danger"
                    onClick={() => updateStatus('declined', request.id)}
                  >
                    Disapprove
                  </IonButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </IonContent>
    </IonPage>
  );
};

export default ViewRequests;