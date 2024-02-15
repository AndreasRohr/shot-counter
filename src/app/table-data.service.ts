import { Injectable } from '@angular/core';
import { Firestore, collection, doc, updateDoc, addDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface TableEntry {
  name: string;
  counter: number;
}

@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  constructor(private firestore: Firestore) { }

  // Add a new counter
  async addCounter(name: string, counterValue: number): Promise<void> {
    const counterCollection = collection(this.firestore, 'counters');
    await addDoc(counterCollection, { name, counter: counterValue });
  }

  // Update an existing counter
  async updateCounter(counterId: string, counterValue: number): Promise<void> {
    const counterDocRef = doc(this.firestore, `counters/${counterId}`);
    await updateDoc(counterDocRef, { counter: counterValue });
  }

  async removeCounter(counterId: string): Promise<void> {
    const counterDocRef = doc(this.firestore, `counters/${counterId}`);
    await deleteDoc(counterDocRef);
  }

  // Fetch all counters
  getCounters(): Observable<TableEntry[]> {
    const counterCollection = collection(this.firestore, 'counters');
    return new Observable((observer) => {
      const unsubscribe = onSnapshot(counterCollection, (snapshot) => {
        const counters = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as TableEntry }));
        observer.next(counters);
      }, observer.error);

      return { unsubscribe };
    });
  }


}

