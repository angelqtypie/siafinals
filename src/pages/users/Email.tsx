import { useEffect, useState } from "react";
import { IonPage, IonHeader,IonFooter,IonText, IonToolbar, IonTitle, IonContent,IonButtons, IonButton, IonGrid, IonRow, IonCol, IonLoading } from "@ionic/react";
import { supabase } from "../../utils/supabaseClient";
import { useHistory } from "react-router-dom";

interface Request {
  id: number;
  request_id: number;
  status: string;
  date_requested: string;
  total_price: number;
  description: string;
  request_types: {
    request_name: string;
  }[];
}

const Email: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [requestHistory, setRequestHistory] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

const fetchRequests = async () => {
  // Get the current user from Supabase
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Failed to get user", userError);
    return;
  }

  if (!user) {
    history.push("/login");
    return;
  }

  // Fetch pending requests
  const { data: pendingData, error: pendingError } = await supabase
    .from("user_requests")
    .select(`
      id,
      request_id,
      status,
      date_requested,
      total_price,
      description,
      request_types(request_name)
    `)
    .eq("user_id", user.id)
    .eq("status", "pending")
    .order("date_requested", { ascending: false });

  // Fetch request history
  const { data: historyData, error: historyError } = await supabase
    .from("user_requests")
    .select(`
      id,
      request_id,
      status,
      date_requested,
      total_price,
      description,
      request_types(request_name)
    `)
    .eq("user_id", user.id)
    .order("date_requested", { ascending: false });

  if (pendingError || historyError) {
    console.error(pendingError || historyError);
  } else {
    setPendingRequests(pendingData || []);
    setRequestHistory(historyData || []);
  }

  setLoading(false);
};

  const updateStatus = async (requestId: number) => {
    const status = Math.random() < 0.5 ? "accepted" : "declined";
    await supabase
      .from("user_requests")
      .update({ status })
      .eq("id", requestId);
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle>Mail</IonTitle>
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
        <IonLoading isOpen={loading} message={"Loading requests..."} />
        <h2>Pending Requests</h2>

        {pendingRequests.length > 0 ? (
          <IonGrid>
            <IonRow>
              <IonCol>#</IonCol>
              <IonCol>Request Name</IonCol>
              <IonCol>Status</IonCol>
              <IonCol>Date Requested</IonCol>
              <IonCol>Total Price</IonCol>
              <IonCol>Description</IonCol>
              <IonCol>Action</IonCol>
            </IonRow>
            {pendingRequests.map((req) => (
              <IonRow key={req.id}>
                <IonCol>{req.id}</IonCol>
                <IonCol>{req.request_types?.[0]?.request_name || 'N/A'}</IonCol>
                <IonCol>{req.status}</IonCol>
                <IonCol>{new Date(req.date_requested).toLocaleString()}</IonCol>
                <IonCol>Php{req.total_price.toFixed(2)}</IonCol>
                <IonCol>{req.description}</IonCol>
                <IonCol>
                  <IonButton onClick={() => updateStatus(req.id)}>Process</IonButton>
                </IonCol>
              </IonRow>
            ))}
          </IonGrid>
        ) : (
          <p>No pending requests found.</p>
        )}

        <h3>Request History</h3>
        <IonGrid>
          <IonRow>
            <IonCol>#</IonCol>
            <IonCol>Request Name</IonCol>
            <IonCol>Status</IonCol>
            <IonCol>Date Requested</IonCol>
            <IonCol>Total Price</IonCol>
            <IonCol>Description</IonCol>
          </IonRow>
          {requestHistory.map((his) => (
            <IonRow key={his.id}>
              <IonCol>{his.id}</IonCol>
              <IonCol>{his.request_types?.[0]?.request_name || 'N/A'}</IonCol>
              <IonCol>{his.status}</IonCol>
              <IonCol>{new Date(his.date_requested).toLocaleString()}</IonCol>
              <IonCol>Php{his.total_price.toFixed(2)}</IonCol>
              <IonCol>{his.description}</IonCol>
            </IonRow>
          ))}
        </IonGrid>
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

export default Email;
