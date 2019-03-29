import {EventEmitter, Injectable, Output} from '@angular/core';
import {Transaction} from '../types/transaction';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  @Output() transactionsChanged: EventEmitter<string> = new EventEmitter();

  private listURL = 'http://localhost:5000/transactions?cycle=';

  constructor(private http: HttpClient) { }

  getTransactions(cycle: string): Observable<Transaction[]> {
    // this.http.get(this.listURL + cycle, httpOptions).map();
    return this.http.get<Transaction[]>(this.listURL + cycle, httpOptions).pipe(
      tap(() => this.transactionsChanged.emit(cycle))
    );
  }
}
