import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export class CategoryBinding {
  transaction_ids: string;
  category: string;

  constructor(ids, category) {
    this.transaction_ids = ids;
    this.category = category;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SetCategoryService {

  @Output() unselect: EventEmitter<boolean> = new EventEmitter();

  private setCategoryURL = 'http://localhost:5000/categorize';

  constructor(private http: HttpClient) { }

  setCategory(ids: string[], category: string): Observable<Object> {
    this.unselect.emit();
    const binding = new CategoryBinding(ids.toString(), category);
    return this.http.post(this.setCategoryURL, binding, httpOptions);
  }
}