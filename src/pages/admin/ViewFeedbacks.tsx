import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonList, IonItem, IonTextarea, IonText
  } from '@ionic/react';
  import { useEffect, useState } from 'react';
  import { supabase } from '../../utils/supabaseClient';
  import { useHistory } from 'react-router-dom';
  
  interface Feedback {
    id: number;
    feedback: string;
    rating: number;
    created_at: string;
    users: { full_name: string } | null;
  }
  
  interface Reply {
    reply: string;
    created_at: string;
  }
  
  const ViewFeedbacks: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [replies, setReplies] = useState<{ [key: number]: Reply[] }>({});
    const [newReply, setNewReply] = useState<{ [key: number]: string }>({});
    const [username, setUsername] = useState<string>('Admin');
    const history = useHistory();
  
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setUsername(data.user.email);
      }
    };
  
    const fetchFeedbacks = async () => {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('id, feedback, rating, created_at, users(full_name)')
        .order('created_at', { ascending: false }) as {
          data: Feedback[] | null;
          error: any;
        };
  
      if (error) {
        console.error('Error fetching feedbacks:', error);
        return;
      }
  
      if (data) setFeedbacks(data);
    };
  
    const fetchReplies = async (feedbackId: number) => {
      const { data, error } = await supabase
        .from('feedback_replies')
        .select('reply, created_at')
        .eq('feedback_id', feedbackId)
        .order('created_at', { ascending: true });
  
      if (error) {
        console.error('Error fetching replies:', error);
        return;
      }
  
      if (data) {
        setReplies((prev) => ({ ...prev, [feedbackId]: data }));
      }
    };
  
    const handleReply = async (feedbackId: number) => {
      const replyText = newReply[feedbackId];
      if (!replyText?.trim()) {
        alert('Reply cannot be empty.');
        return;
      }
  
      const { error } = await supabase.from('feedback_replies').insert([
        { feedback_id: feedbackId, reply: replyText }
      ]);
  
      if (error) {
        alert('Error adding reply: ' + error.message);
      } else {
        alert('Reply added successfully.');
        setNewReply((prev) => ({ ...prev, [feedbackId]: '' }));
        fetchReplies(feedbackId);
      }
    };
  
    const handleLogout = async () => {
      await supabase.auth.signOut();
      history.push('/siafinals/home');
    };
  
    useEffect(() => {
      fetchFeedbacks();
      fetchUser();
    }, []);
  
    useEffect(() => {
      feedbacks.forEach((f) => fetchReplies(f.id));
    }, [feedbacks]);
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>View Feedbacks</IonTitle>
            <IonButtons slot="start">
              <IonButton onClick={() => history.push('/siafinals/admindashboard')}>Home</IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonText className="ion-padding">{username}</IonText>
              <IonButton color="danger" onClick={handleLogout}>Logout</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
  
        <IonContent className="ion-padding">
          <h2>Recent Feedbacks</h2>
          <IonList>
            {feedbacks.map((feedback) => (
              <IonItem key={feedback.id} lines="full">
                <div style={{ width: '100%' }}>
                  <h3>{feedback.users?.full_name || 'Unknown User'} (Rating: {feedback.rating})</h3>
                  <p>{feedback.feedback}</p>
                  <p><i>Submitted on: {new Date(feedback.created_at).toLocaleString()}</i></p>
  
                  <h4>Admin Replies:</h4>
                  {replies[feedback.id]?.length ? (
                    replies[feedback.id].map((reply, idx) => (
                      <div key={idx} style={{ marginBottom: '10px', backgroundColor: '#f1f1f1', padding: '8px', borderRadius: '5px' }}>
                        <strong>Admin:</strong>
                        <p>{reply.reply}</p>
                        <small>Replied on: {new Date(reply.created_at).toLocaleString()}</small>
                      </div>
                    ))
                  ) : <p>No replies yet.</p>}
<IonTextarea
  placeholder="Type your reply here"
  value={newReply[feedback.id] || ''}
  onIonInput={(e) =>
    setNewReply((prev) => ({ ...prev, [feedback.id]: e.detail.value || '' }))
  }
/>

                  <IonButton
                    expand="block"
                    color="success"
                    onClick={() => handleReply(feedback.id)}
                    disabled={!newReply[feedback.id]?.trim()}
                  >
                    Reply
                  </IonButton>
                </div>
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonPage>
    );
  };
  
  export default ViewFeedbacks;
  