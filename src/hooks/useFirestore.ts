import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  QueryConstraint,
  DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';

export function useFirestore(collectionName: string) {
  const getAll = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      throw error;
    }
  };

  const getById = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar documento:', error);
      throw error;
    }
  };

  const add = async (data: DocumentData) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar documento:', error);
      throw error;
    }
  };

  const update = async (id: string, data: DocumentData) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      throw error;
    }
  };

  const remove = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao remover documento:', error);
      throw error;
    }
  };

  const queryDocuments = async (...queryConstraints: QueryConstraint[]) => {
    try {
      const q = query(collection(db, collectionName), ...queryConstraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao consultar documentos:', error);
      throw error;
    }
  };

  return {
    getAll,
    getById,
    add,
    update,
    remove,
    queryDocuments
  };
}