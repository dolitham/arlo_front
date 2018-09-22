import { Component, OnInit } from '@angular/core';
import { Transaction } from '../transaction';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {


  transactions: Transaction[];
  selectedTransactions: Transaction[];

  constructor(private transactionService: TransactionService) { }

  ngOnInit() {
    this.getTransactions();
    this.selectedTransactions = [];
  }

  onClick(transaction: Transaction): void {
    if (this.selectedTransactions.includes(transaction)) {
      this.selectedTransactions.splice(this.selectedTransactions.indexOf(transaction), 1);
    } else {
      this.selectedTransactions.push(transaction);
    }
  }

  private getTransactions(): void {
    this.transactionService.getTransactions().subscribe(transactions => this.transactions = transactions);
  }

}
