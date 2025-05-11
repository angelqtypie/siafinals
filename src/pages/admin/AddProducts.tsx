import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonInput,
    IonList,
    IonItem,
    IonLabel,
    IonText
  } from '@ionic/react';
  import { useEffect, useState } from 'react';
  import { supabase } from '../../utils/supabaseClient';
  import { useHistory } from 'react-router-dom';
  
  const AddProducts: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [requestName, setRequestName] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');
    const [username] = useState('Admin'); // static Admin name since no Supabase Auth
  
    const history = useHistory();
  
    // Fetch products from Supabase
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('request_types')
        .select('*')
        .order('id', { ascending: true });
  
      if (error) {
        console.error(error);
      } else {
        setProducts(data || []);
      }
    };
  
    const addProduct = async () => {
      if (!requestName || !price) {
        setMessage('Please fill in all fields');
        return;
      }
  
      const { error } = await supabase
        .from('request_types')
        .insert([{ request_name: requestName, price: parseFloat(price) }]);
  
      if (error) {
        setMessage(`Error adding product: ${error.message}`);
      } else {
        setMessage('Product added successfully!');
        setRequestName('');
        setPrice('');
        fetchProducts();
      }
    };
  
    const deleteProduct = async (id: number) => {
      const { error } = await supabase.from('request_types').delete().eq('id', id);
      if (error) {
        setMessage(`Error deleting product: ${error.message}`);
      } else {
        setMessage('Product deleted.');
        fetchProducts();
      }
    };
  
    const updateProduct = async (id: number, newName: string, newPrice: string) => {
      const { error } = await supabase
        .from('request_types')
        .update({ request_name: newName, price: parseFloat(newPrice) })
        .eq('id', id);
  
      if (error) {
        setMessage(`Error updating product: ${error.message}`);
      } else {
        setMessage('Product updated.');
        fetchProducts();
      }
    };
  
    // Logout function (optional — no Supabase Auth session but keeps routing clean)
    const handleLogout = async () => {
      await supabase.auth.signOut(); // won't affect SQL-only admin but fine to keep
      history.push('/siafinals/home');
    };
  
    useEffect(() => {
      fetchProducts();
    }, []);
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Manage Products</IonTitle>
            <IonButtons slot="start">
              <IonButton onClick={() => history.push('/siafinals/admindashboard')}>Home</IonButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonText className="ion-padding">{username}</IonText>
              <IonButton color="danger" onClick={handleLogout}>
                Logout
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
  
        <IonContent className="ion-padding">
          <h2>Add New Product</h2>
          <IonInput
            placeholder="Product Name"
            value={requestName}
            onIonChange={(e) => setRequestName(e.detail.value!)}
          />
          <IonInput
            type="number"
            placeholder="Price"
            value={price}
            onIonChange={(e) => setPrice(e.detail.value!)}
          />
          <IonButton expand="block" onClick={addProduct}>
            Add Product
          </IonButton>
  
          {message && (
            <IonText color="primary">
              <p>{message}</p>
            </IonText>
          )}
  
          <h2 className="ion-margin-top">Existing Products</h2>
          <IonList>
            {products.map((product) => (
              <IonItem key={product.id}>
                <IonLabel>
                  <h3>{product.request_name}</h3>
                  <p>Price: {product.price}</p>
                </IonLabel>
                <IonInput
                  value={product.request_name}
                  onIonChange={(e) => {
                    const updatedName = e.detail.value!;
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === product.id ? { ...p, request_name: updatedName } : p
                      )
                    );
                  }}
                />
                <IonInput
                  type="number"
                  value={product.price}
                  onIonChange={(e) => {
                    const updatedPrice = e.detail.value!;
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === product.id ? { ...p, price: updatedPrice } : p
                      )
                    );
                  }}
                />
                <IonButton
                  color="success"
                  onClick={() => updateProduct(product.id, product.request_name, product.price)}
                >
                  Modify
                </IonButton>
                <IonButton color="danger" onClick={() => deleteProduct(product.id)}>
                  Delete
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        </IonContent>
      </IonPage>
    );
  };
  
  export default AddProducts;
  