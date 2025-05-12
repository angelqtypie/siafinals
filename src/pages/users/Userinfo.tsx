import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonText } from '@ionic/react';
import { supabase } from '../../utils/supabaseClient'; // your supabase client import
import { useHistory } from 'react-router-dom';

const ProfileUpdate: React.FC = () => {
    const [course, setCourse] = useState<string>('');
    const [cellphoneNumber, setCellphoneNumber] = useState<string>('');
    const [gender, setGender] = useState<string>('');
    const [error, setError] = useState<string>('');
    const history = useHistory();

    useEffect(() => {
        // Check if the user is logged in by fetching session info
        const userSession = localStorage.getItem('access_token');
        if (!userSession) {
            history.push('/siafinals/login');
        }
    }, [history]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!course || !cellphoneNumber || !gender) {
            setError('Please fill in all fields');
            return;
        }

        const userId = localStorage.getItem('user_id');
        if (userId) {
            const { data, error } = await supabase
                .from('users')
                .update({ course, cellphone_number: cellphoneNumber, gender })
                .eq('id', userId)
                .single();

            if (error) {
                setError(error.message);
                return;
            }

            history.push('/siafinals/dashboard');
        } else {
            setError('User not found.');
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Complete Your Information</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <h2>Please fill out your information</h2>
                {error && <IonText color="danger"><p>{error}</p></IonText>}

                <form onSubmit={handleSubmit}>
                    <IonItem>
                        <IonLabel position="stacked">Course</IonLabel>
                        <IonInput
                            type="text"
                            value={course}
                            onIonChange={(e) => setCourse(e.detail.value!)}
                            required
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Cellphone Number</IonLabel>
                        <IonInput
                            type="text"
                            value={cellphoneNumber}
                            onIonChange={(e) => setCellphoneNumber(e.detail.value!)}
                            required
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Gender</IonLabel>
                        <IonSelect
                            value={gender}
                            onIonChange={(e) => setGender(e.detail.value!)}
                            required
                        >
                            <IonSelectOption value="male">Male</IonSelectOption>
                            <IonSelectOption value="female">Female</IonSelectOption>
                            <IonSelectOption value="other">Other</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonButton expand="block" type="submit" className="ion-margin-top">
                        Save Information
                    </IonButton>
                </form>
            </IonContent>
        </IonPage>
    );
};

export default ProfileUpdate;
