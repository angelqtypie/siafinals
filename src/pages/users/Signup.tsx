import { IonContent, IonPage, IonItem,IonFooter, IonLabel, IonInput, IonRouterLink, IonButton, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, IonHeader } from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useHistory } from 'react-router-dom';

const Signup: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [cellphoneNumber, setCellphoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSignup = async () => {
    if (!fullName || !email || !course || !cellphoneNumber || !gender || !status || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must have at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Register the user in Supabase auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const user_id = data.user?.id;
    if (!user_id) {
      setError('Failed to create user.');
      return;
    }

    // Insert the extra user data into your 'users' table
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: user_id,  // Make sure the id column in your table is UUID
        full_name: fullName,
        email: email,
        course: course,
        cellphone_number: cellphoneNumber,
        gender: gender,
        status: status,
        password: password
      }
    ]);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    history.push('/siafinals/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle >Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {error && <IonText color="danger"><p>{error}</p></IonText>}

        <IonItem>
          <IonLabel position="floating">Full Name</IonLabel>
          <IonInput value={fullName} onIonChange={e => setFullName(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput value={email} type="email" onIonChange={e => setEmail(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Status</IonLabel>
          <IonSelect value={status} placeholder="Select Status" onIonChange={e => setStatus(e.detail.value)}>
            <IonSelectOption value="student">Student</IonSelectOption>
            <IonSelectOption value="staff">Staff</IonSelectOption>
          </IonSelect>
        </IonItem>

        {status === 'student' && (
          <IonItem>
            <IonLabel position="floating">Course</IonLabel>
            <IonSelect value={course} placeholder="Select Course" onIonChange={e => setCourse(e.detail.value)}>
              <IonSelectOption value="ICS">ICS</IonSelectOption>
              <IonSelectOption value="ITE">ITE</IonSelectOption>
              <IonSelectOption value="IBM">IBM</IonSelectOption>
            </IonSelect>
          </IonItem>
        )}

        <IonItem>
          <IonLabel position="floating">Cellphone Number</IonLabel>
          <IonInput value={cellphoneNumber} onIonChange={e => setCellphoneNumber(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Gender</IonLabel>
          <IonSelect value={gender} placeholder="Select Gender" onIonChange={e => setGender(e.detail.value)}>
            <IonSelectOption value="Male">Male</IonSelectOption>
            <IonSelectOption value="Female">Female</IonSelectOption>
            <IonSelectOption value="Other">Other</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput value={password} type="password" onIonChange={e => setPassword(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Confirm Password</IonLabel>
          <IonInput value={confirmPassword} type="password" onIonChange={e => setConfirmPassword(e.detail.value!)} />
        </IonItem>

        <IonButton expand="block" onClick={handleSignup} className="ion-margin-top">
          Sign Up
        </IonButton>

        <IonText className="ion-text-center ion-margin-top">
          <p>
            Already have an account? <IonRouterLink routerLink="/siafinals/login">Login here</IonRouterLink>.
          </p>
          <p>
            Or would you like to go <IonRouterLink routerLink="/siafinals/home">back</IonRouterLink>?
          </p>
        </IonText>
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

export default Signup;
