import React, { useEffect, useState } from 'react';
import { db, collection, getDocs } from './services/firebase/Firebase';

export default function TestFirebase() {
  const [mensaje, setMensaje] = useState('Probando conexión...');

  useEffect(() => {
    const test = async () => {
      try {
        const snap = await getDocs(collection(db, 'planes'));
        setMensaje(`✅ Conectado correctamente. Documentos encontrados: ${snap.size}`);
      } catch (err) {
        setMensaje(`❌ Error: ${err.message}`);
      }
    };
    test();
  }, []);

  return <div style={{ padding: 20 }}>{mensaje}</div>;
}