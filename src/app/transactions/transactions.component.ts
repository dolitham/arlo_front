import {Component, OnInit} from '@angular/core';
import {category_icons, Transaction} from '../types/transaction';
import {TransactionService} from '../services/transaction.service';
import {SetFieldsService} from '../services/set-fields.service';
import {RefreshTransactionsService} from '../services/refresh-transactions.service';
import {CreateTransactionService} from '../services/create-transaction.service';
import {CycleService} from '../services/cycle.service';
import {ReferenceMakerService} from '../services/reference-maker.service';
import {CategoryService} from '../services/category.service';
import {DepositService} from '../services/deposit.service';
import {DeviceService} from '../services/device.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  transactions: Transaction[];
  selectedTransactions: Transaction[];
  hideLinked = true;
  icons = category_icons;
  filteredCategories: string[];
  filteredAccounts: string[];
  accounts: string[];
  categories: string[];
  local_cycles: string[];
  deposit_names: string[];

  private cycle: string;
  public mobile = false;

  constructor(private transactionService: TransactionService,
              private setFieldsService: SetFieldsService,
              private refreshService: RefreshTransactionsService,
              private createTransactionService: CreateTransactionService,
              private cycleService: CycleService,
              private referenceNameMakerService: ReferenceMakerService,
              private categoryService: CategoryService,
              private depositService: DepositService,
              private deviceService: DeviceService) {
  }

  ngOnInit() {
    this.selectedTransactions = [];
    this.filteredCategories = [];
    this.filteredAccounts = [];
    this.cycleService.currentCycle.subscribe(cycle => {
      this.cycle = cycle;
      this.getTransactions();
      // @ts-ignore
      this.cycleService.getLocalCycle(cycle, false).subscribe(cycles => this.local_cycles = cycles);
    });

    this.setFieldsService.transactionsModified.subscribe(() => {
      this.selectedTransactions = [];
      this.getTransactions();
    });

    this.refreshService.refreshed.subscribe(() => this.getTransactions());
    this.createTransactionService.created.subscribe(() => this.getTransactions());
    this.referenceNameMakerService.referenceCreated.subscribe(() => this.getTransactions());
    this.transactionService.transactionsSplit.subscribe(() => this.getTransactions());
    this.depositService.depositChanged.subscribe(() => this.getTransactions());

    this.transactionService.categoryClick.subscribe(category => {
      this.toggleCategory(category);
    });
    this.categoryService.getAllAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.depositService.getDepositNames().subscribe(deposit_names => {
      this.deposit_names = deposit_names;
    });
    this.mobile = this.deviceService.getIsMobileResolution();
  }

  displayTransaction(transaction): boolean {
    return ((!this.hideLinked || !transaction.linked) &&
      this.acceptedCategory(transaction.category) &&
      this.acceptedAccount(transaction.account));
  }

  removeSelectedTransactionIndex(index: number): void {
    this.selectedTransactions.splice(index, 1);
  }

  private getTransactions(): void {
    this.transactionService.getTransactions(this.cycle).subscribe(transactions => {
      this.transactions = transactions;
      this.selectedTransactions = [];
    });
  }

  private acceptedCategory(category: string): boolean {
    return this.filteredCategories.length === 0 ||
      this.filteredCategories.includes(category);
  }

  private acceptedAccount(account: string): boolean {
    return this.filteredAccounts.length === 0 ||
      this.filteredAccounts.includes(account);
  }

  private razFilterCategories(): void {
    this.filteredCategories = [];
    this.selectedTransactions = [];
  }

  private unselectInvisibleTransactions() {
    const to_remove_indexes = [];
    for (let i = 0; i < this.selectedTransactions.length; i++) {
      if (!this.acceptedCategory(this.selectedTransactions[i].category)
        ||
        !this.acceptedAccount(this.selectedTransactions[i].account)
      ) {
        to_remove_indexes.push(i);
      }
    }
    for (const index of to_remove_indexes.reverse()) {
      this.removeSelectedTransactionIndex(index);
    }
  }

  private toggleCategory(category) {
    if (this.filteredCategories.includes(category)) {
      this.filteredCategories.splice(this.filteredCategories.indexOf(category), 1);
    } else {
      this.filteredCategories.push(category);
    }
    this.unselectInvisibleTransactions();
  }

  private totalSelectedTransactions(): number {
    return this.selectedTransactions.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }

  toggleHideLinked() {
    this.hideLinked = !this.hideLinked;
  }
}
