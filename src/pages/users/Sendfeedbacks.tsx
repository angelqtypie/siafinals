import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButton } from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

const SendFeedback: React.FC = () => {
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback || rating === 0) {
            setMessage('Please provide both feedback and a rating.');
            return;
        }

        const userId = sessionStorage.getItem('id');
        if (!userId) {
            setMessage('User not logged in.');
            return;
        }

        const { error } = await supabase.from('feedbacks').insert({
            user_id: userId,
            feedback,
            rating,
            created_at: new Date().toISOString(),
        });

        if (error) {
            setMessage(`Error submitting feedback: ${error.message}`);
        } else {
            window.location.href = '/siafinals/thankyou';
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Send Feedback</IonTitle>
                    <IonButton slot="end" href="/siafinals/dashboard">Home</IonButton>
                    <IonButton slot="end" href="/siafinals/home">Logout</IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div style={{
                    maxWidth: '800px',
                    margin: '40px auto',
                    padding: '25px',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}>
                    <h1 style={{ fontSize: '32px', textAlign: 'center', marginBottom: '25px', color: '#333' }}>Share Your Feedback</h1>

                    {message && (
                        <div style={{
                            margin: '20px 0',
                            padding: '15px',
                            backgroundColor: message.includes('Error') ? '#f8d7da' : '#e7f7e7',
                            color: message.includes('Error') ? '#721c24' : '#28a745',
                            border: message.includes('Error') ? '1px solid #f5c6cb' : '1px solid #28a745',
                            borderRadius: '6px',
                            textAlign: 'center',
                            fontSize: '18px'
                        }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <label style={{ fontSize: '18px', color: '#444' }}>Your Thoughts:</label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            required
                            style={{
                                padding: '15px',
                                fontSize: '16px',
                                border: '1px solid #ddd',
                                borderRadius: '10px',
                                resize: 'vertical',
                                minHeight: '150px',
                                transition: 'border-color 0.3s'
                            }}
                        />
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row-reverse',
                            gap: '5px',
                            marginTop: '10px'
                        }}>
                            {[5, 4, 3, 2, 1].map((star) => (
                                <label key={star} style={{ fontSize: '32px', cursor: 'pointer', color: star <= rating ? '#ff9900' : '#ddd' }}>
                                    ★
                                    <input
                                        type="radio"
                                        value={star}
                                        checked={rating === star}
                                        onChange={() => setRating(star)}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            ))}
                        </div>

                        <IonButton type="submit" expand="block" color="success">
                            Submit Feedback
                        </IonButton>
                    </form>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default SendFeedback;

