import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  onSnapshot,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../utils/firebase';

/**
 * Custom hook for Firestore data fetching
 * @param {string} collectionName - Firestore collection name
 * @param {Object} options - Query options
 * @param {Array} options.where - Array of where clauses [field, operator, value]
 * @param {string} options.orderBy - Field to order by
 * @param {number} options.limit - Limit number of results
 * @param {boolean} options.realtime - Enable realtime updates
 * @param {string} options.docId - Fetch single document by ID
 */
export const useFirestore = (collectionName, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch single document if docId provided
        if (options.docId) {
          const docRef = doc(db, collectionName, options.docId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setData({ id: docSnap.id, ...docSnap.data() });
          } else {
            setData(null);
            setError('Document not found');
          }
          setLoading(false);
          return;
        }

        // Build query
        let q = collection(db, collectionName);
        const constraints = [];

        // Add where clauses
        if (options.where && Array.isArray(options.where)) {
          options.where.forEach(([field, operator, value]) => {
            constraints.push(where(field, operator, value));
          });
        }

        // Add orderBy
        if (options.orderBy) {
          const [field, direction = 'asc'] = Array.isArray(options.orderBy) 
            ? options.orderBy 
            : [options.orderBy, 'asc'];
          constraints.push(orderBy(field, direction));
        }

        // Add limit
        if (options.limit) {
          constraints.push(limit(options.limit));
        }

        // Apply constraints
        if (constraints.length > 0) {
          q = query(q, ...constraints);
        } else {
          q = query(q);
        }

        // Realtime updates
        if (options.realtime) {
          const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
              const documents = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              setData(documents);
              setLoading(false);
            },
            (err) => {
              console.error('Firestore error:', err);
              setError(err.message);
              setLoading(false);
            }
          );

          return unsubscribe;
        } else {
          // One-time fetch
          const snapshot = await getDocs(q);
          const documents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(documents);
          setLoading(false);
        }

      } catch (err) {
        console.error('Firestore error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    const unsubscribe = fetchData();

    // Cleanup
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [collectionName, JSON.stringify(options)]);

  const refetch = async () => {
    setLoading(true);
    // Re-run the effect by updating a dependency
  };

  return { data, loading, error, refetch };
};

export default useFirestore;
