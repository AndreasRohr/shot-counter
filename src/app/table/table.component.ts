import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddEntryDialogComponent } from '../add-entry-dialog/add-entry-dialog.component';
import { TableDataService } from '../table-data.service';
import { Subscription } from 'rxjs';

interface TableEntry {
  name: string;
  counter: number;
  rank?: number;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  dataSource: TableEntry[] = [];
  displayedColumns: string[] = ['rank', 'name', 'counter', 'incrDecr', 'adjustCounter', 'remove'];
  columnWidths = {
    rank: '10%',
    name: '20%',
    counter: '50%',
    incrDecr: '5%',
    adjustCounter: '10%',
    remove: "5%",
  };


  private subscription: Subscription = new Subscription(); // To hold the subscription


  constructor(public dialog: MatDialog, private tableDataService: TableDataService) { }

  ngOnInit(): void {
    this.subscription.add(this.tableDataService.getCounters().subscribe(data => {
      const sortedData = data.sort((a, b) => b.counter - a.counter);
      sortedData.forEach((entry, index) => {
        entry.rank = index + 1; // Rank starting at 1
      });

      this.dataSource = sortedData;
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Clean up the subscription
  }

  openAddEntryDialog(): void {
    const dialogRef = this.dialog.open(AddEntryDialogComponent, {
      //width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        this.tableDataService.addCounter(result.name, result.counter);
      }
    });
  }

  increment(element: any): void {
    const newCount = element.counter + 1;
    this.tableDataService.updateCounter(element.id, newCount);
  }

  decrement(element: any): void {
    if (element.counter > 0) {
      const newCount = element.counter - 1;
      this.tableDataService.updateCounter(element.id, newCount);
    }
  }

  adjustCounter(element: any, value: string): void {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      const newCount = element.counter + numValue;
      this.tableDataService.updateCounter(element.id, newCount);
    }
  }


  loadData(): void {
    const savedData = localStorage.getItem('tableData');
    if (savedData) {
      this.dataSource = JSON.parse(savedData);
    }
  }

  removeEntry(element: any): void {
    this.tableDataService.removeCounter(element.id);

  }
}
