import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-display-names-similarity',
  templateUrl: './display-names-similarity.component.html',
  styleUrls: ['./display-names-similarity.component.scss']
})
export class DisplayNamesSimilarityComponent implements OnInit {
  formname:string = 'ManageEmployeeDuplicatedFrame1';
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['bonus_name', 'bonusreason_name', 'documenttype_name', 'document_number',
    'documentdate', 'action'];

  dataSource: MatTableDataSource<any>;

  constructor() { 
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
