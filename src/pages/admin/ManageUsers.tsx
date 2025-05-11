import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
  IonAlert,
  IonButtons,
} from '@ionic/react';
import { useHistory } from 'react-router-dom'; // assuming you're using React Router
import { supabase } from '../../utils/supabaseClient';
import '../../components/ManageUsers.css';

interface User {
  id: number;
  email: string;
  status: string;
  full_name: string;
  course: string;
  cellphone_number: string;
  gender: string;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const history = useHistory();

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, status, full_name, course, cellphone_number, gender');

    if (error) {
      console.error('Error fetching users:', error.message);
    } else {
      setUsers(data as User[]);
    }
  };

  const deleteUser = async (id: number) => {
    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      console.error('Error deleting user:', error.message);
    } else {
      setSuccessMessage('User deleted successfully!');
      fetchUsers();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    history.push('/siafinals/home'); // redirect to login page
  };

  const goToHome = () => {
    history.push('/siafinals/admindashboard'); // assuming this is your admin home route
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Manage Users</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={goToHome} color="light">
              Home
            </IonButton>
            <IonButton onClick={handleLogout} color="light">
              Logout
            </IonButton>
          </IonButtons>
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
              <th>Email</th>
              <th>Status</th>
              <th>Full Name</th>
              <th>Course</th>
              <th>Cellphone</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.status}</td>
                <td>{user.full_name}</td>
                <td>{user.course}</td>
                <td>{user.cellphone_number}</td>
                <td>{user.gender}</td>
                <td>
                  <IonButton
                    color="danger"
                    onClick={() => {
                      setDeleteId(user.id);
                      setAlertOpen(true);
                    }}
                  >
                    Delete
                  </IonButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <IonAlert
          isOpen={alertOpen}
          header="Confirm Delete"
          message="Are you sure you want to delete this user?"
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setAlertOpen(false),
            },
            {
              text: 'Delete',
              handler: () => {
                if (deleteId !== null) {
                  deleteUser(deleteId);
                }
                setAlertOpen(false);
              },
            },
          ]}
          onDidDismiss={() => setAlertOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default ManageUsers;