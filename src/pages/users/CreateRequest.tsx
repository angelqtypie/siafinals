import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButton, IonCheckbox, IonLabel, IonItem, IonInput, IonAlert } from '@ionic/react';
import { supabase } from '../../utils/supabaseClient'; // Assuming you've set up Supabase client

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

    const updateTotalPrice = () => {
        let price = 0;
        selectedRequests.forEach((requestId) => {
            const request = requests.find((req) => req.id === requestId);
            if (request) {
                price += request.price;
            }
        });
        setTotalPrice(price);
    };

    const handleRequestChange = (event: any) => {
        const requestId = parseInt(event.target.value);
        if (event.target.checked) {
            setSelectedRequests([...selectedRequests, requestId]);
        } else {
            setSelectedRequests(selectedRequests.filter((id) => id !== requestId));
        }
        updateTotalPrice();
    };

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
                <IonToolbar color="primary">
                    <IonTitle>Create Request</IonTitle>
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
                    <div className="row">
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

                    <div className="mt-3">
                        <h4>Total Price: ${totalPrice.toFixed(2)}</h4>
                    </div>

                    <div className="mt-3">
                        <h4>Please provide a description for your request (optional):</h4>
                        <IonInput
                            value={description}
                            onIonChange={(e) => setDescription(e.detail.value!)}
                            placeholder="Enter description"
                            debounce={0}
                            clearInput
                        />
                    </div>

                    <div className="mt-3">
                        <IonButton expand="block" type="submit" color="primary">
                            Send Request
                        </IonButton>
                    </div>
                </form>
            </IonContent>
        </IonPage>
    );
};

export default CreateRequest;
