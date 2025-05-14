import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient'; // Your supabase client import
import { IonPage, IonHeader, IonToolbar, IonTitle, IonFooter, IonContent, IonButton, IonText, IonCard, IonCardHeader, IonCardContent, IonItem, IonLabel, IonList, IonListHeader, IonRow, IonCol, IonButtons, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { mailOutline, addCircleOutline, chatbubbleEllipsesOutline, logOutOutline } from 'ionicons/icons';
import '../../components/Dashboard.css'; // Make sure to link your custom CSS here

const Dashboard: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            const userSession = sessionStorage.getItem('loggedin');
            if (!userSession) {
                history.push('/siafinals/login');
                return;
            }

            const userId = sessionStorage.getItem('id');
            if (userId) {
                // Fetch user data
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id, full_name, email, course, cellphone_number, gender, status')
                    .eq('id', userId);

                if (userError || userData?.length === 0) {
                    history.push('/siafinals/login');
                    return;
                }
                setUser(userData[0]);

                // Fetch user's requests
                const { data: userRequests, error: requestsError } = await supabase
                    .from('user_requests')
                    .select('id, request_id, status, date_requested, total_price, description, request_types(request_name)')
                    .eq('user_id', userId);

                if (!requestsError) {
                    setRequests(userRequests);
                }

                // Fetch feedbacks with replies
                const { data: userFeedbacks, error: feedbackError } = await supabase
                    .from('feedbacks')
                    .select('id, feedback, rating, created_at, feedback_replies(reply, created_at)')
                    .eq('user_id', userId);

                if (!feedbackError) {
                    setFeedbacks(userFeedbacks);
                }
            }
        };
        fetchData();
    }, [history]);

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.removeItem('access_token');
        history.push('/siafinals/home');
    };

    if (!user) return <IonContent>Loading...</IonContent>;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="secondary">
                    <IonTitle>Dashboard</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => history.push('/siafinals/email')}>
                            <IonIcon icon={mailOutline} slot="start" />
                            Mail
                        </IonButton>
                        <IonButton onClick={() => history.push('/siafinals/createrequest')}>
                            <IonIcon icon={addCircleOutline} slot="start" />
                            Create Request
                        </IonButton>
                        <IonButton onClick={() => history.push('/siafinals/sendfeedbacks')}>
                            <IonIcon icon={chatbubbleEllipsesOutline} slot="start" />
                            Share Feedbacks
                        </IonButton>
                        <IonButton onClick={handleLogout} color="danger">
                            <IonIcon icon={logOutOutline} slot="start" />
                            Logout
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonCard className="welcome-card">
                    <IonCardHeader>
                        <IonTitle>Welcome to Your Dashboard!</IonTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <h3>Hello, {user.full_name}!</h3>
                        <IonList>
                            <IonItem>
                                <IonLabel>Email:</IonLabel>
                                <IonText>{user.email}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Course:</IonLabel>
                                <IonText>{user.course}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Cellphone Number:</IonLabel>
                                <IonText>{user.cellphone_number}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Gender:</IonLabel>
                                <IonText>{user.gender}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Status:</IonLabel>
                                <IonText>{user.status}</IonText>
                            </IonItem>
                        </IonList>
                    </IonCardContent>
                </IonCard>

                {/* Requests Table */}
                <IonCard className="ion-margin-top request-card">
                    <IonCardHeader>Your Requests</IonCardHeader>
                    <IonCardContent>
                        {requests.length > 0 ? (
                            <IonList>
                                {requests.map((request) => (
                                    <IonItem key={request.id}>
                                        <IonLabel>
                                            <h3>{request.request_types?.request_name ?? 'N/A'}</h3>
                                            <p><strong>Status:</strong> {request.status}</p>
                                            <p><strong>Date Requested:</strong> {new Date(request.date_requested).toLocaleDateString()}</p>
                                            <p><strong>Total Price:</strong> ₱{request.total_price.toFixed(2)}</p>
                                            <p>{request.description}</p>
                                        </IonLabel>
                                    </IonItem>
                                ))}
                            </IonList>
                        ) : (
                            <IonText>No requests found.</IonText>
                        )}
                    </IonCardContent>
                </IonCard>

                {/* Feedbacks Table */}
                <IonCard className="ion-margin-top feedback-card">
                    <IonCardHeader>Your Feedbacks</IonCardHeader>
                    <IonCardContent>
                        {feedbacks.length > 0 ? (
                            <IonList>
                                {feedbacks.map((feedback) => (
                                    <IonItem key={feedback.id}>
                                        <IonLabel>
                                            <h3>{feedback.feedback}</h3>
                                            <p><strong>Rating:</strong> {feedback.rating}/5</p>
                                            <p><strong>Submitted At:</strong> {new Date(feedback.created_at).toLocaleDateString()}</p>
                                            <div>
                                                <strong>Replies:</strong>
                                                {feedback.feedback_replies.length > 0 ? (
                                                    feedback.feedback_replies.map((reply: any) => (
                                                        <p key={reply.created_at}>
                                                            {reply.reply} <small>({new Date(reply.created_at).toLocaleDateString()})</small>
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p>No reply yet.</p>
                                                )}
                                            </div>
                                        </IonLabel>
                                    </IonItem>
                                ))}
                            </IonList>
                        ) : (
                            <IonText>No feedbacks found.</IonText>
                        )}
                    </IonCardContent>
                </IonCard>
  

            </IonContent>
            <IonFooter>
                    <IonToolbar>
                      <IonText className="ion-text-center">
                        <p>© 2024 Northern Bukidnon State College. All Rights Reserved.</p>
                      </IonText>
                    </IonToolbar>
                  </IonFooter>
        </IonPage>
    );
};

export default Dashboard;
