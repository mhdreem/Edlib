import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TBLShamelProgramTree } from 'src/app/modules/shared/models/systemservice/TBLShamelProgramTree';
import { TBLShamelProgramTreeService } from 'src/app/modules/shared/services/systemservice/tblshamel-program-tree.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TblshamelProgramTreeModifyComponent } from '../tblshamel-program-tree-modify/tblshamel-program-tree-modify.component';

@Component({
  selector: 'app-tblshamel-program-tree-list',
  templateUrl: './tblshamel-program-tree-list.component.html',
  styleUrls: ['./tblshamel-program-tree-list.component.scss']
})


export class TblshamelProgramTreeListComponent implements OnInit, AfterViewInit {
  formname:string = 'تعريف واجهات البرنامج';
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selectedNode: TBLShamelProgramTree= null;
  treeControl = new NestedTreeControl<TBLShamelProgramTree>(node => node.tBLShamelProgramTrees_Children);
  dataSource = new MatTreeNestedDataSource<TBLShamelProgramTree>();

  displayedColumns: string[] = ['formname', 'formtype', 'action'];

  tableDataSource: MatTableDataSource<TBLShamelProgramTree>;
  pageSizeOptions: number[] = [5, 10, 25, 100];


  constructor(private tblShamelProgramTreeService: TBLShamelProgramTreeService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) { 
    this.tableDataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.tblShamelProgramTreeService.BuildTree().subscribe(res =>{
      this.dataSource.data= res;
    });
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  hasChild = (_: number, node: TBLShamelProgramTree) => !!node.tBLShamelProgramTrees_Children && node.tBLShamelProgramTrees_Children.length > 0;

  
  add(){
    const dialogRef = this.dialog.open(TblshamelProgramTreeModifyComponent, {
      height: '35%',
      width: '25%',
      position: {top: '14%', left: '35%'},
      data: ''
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        //convert the selected node to a parent node
        this.tblShamelProgramTreeService.update({
          formname: this.selectedNode.formname,
          formtype: 1,
          parent_serail: this.selectedNode.parent_serail,
          serail: this.selectedNode.serail,
          tBLShamelProgramTrees_Children: this.selectedNode.tBLShamelProgramTrees_Children
        }).subscribe(res =>{
          let newNode: TBLShamelProgramTree= {
            formname: result,
            formtype: 2,
            parent_serail: this.selectedNode.serail,
            serail: null,
            tBLShamelProgramTrees_Children: null
          };
          this.tblShamelProgramTreeService.add(newNode).subscribe(
            res =>{
              if (res == 1){
                this.snackBar.open('تمت الإضافة بنجاح', '', {
                  duration: 3000,
                });
                this.tblShamelProgramTreeService.BuildTree().subscribe(res =>{
                  this.dataSource.data= res;
                });
                this.selectedNode= null;
              }
            }
          );
        });
        
      }
    });
  }

  Delete(node: TBLShamelProgramTree){
    this.tblShamelProgramTreeService.delete(node.serail).subscribe(res =>{
      if (res == 1){
        this.snackBar.open('تم الحذف بنجاح', '', {
          duration: 3000,
        });
        this.tblShamelProgramTreeService.BuildTree().subscribe(res =>{
          this.dataSource.data= res;
        });
      }
    });
  }

  Update(node: TBLShamelProgramTree){
    const dialogRef = this.dialog.open(TblshamelProgramTreeModifyComponent, {
      height: '35%',
      width: '25%',
      position: {top: '14%', left: '35%'},
      data: node.formname
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        node.formname= result;
        this.tblShamelProgramTreeService.update(node).subscribe(
          res =>{
            if (res == 1){
              this.snackBar.open('تم التعديل بنجاح', '', {
                duration: 3000,
              });
              this.tblShamelProgramTreeService.BuildTree().subscribe(res =>{
                this.dataSource.data= res;
              });
              this.selectedNode= null;
            }
          }
        );
      }
    });
    
  }

  ClickNode(node:TBLShamelProgramTree){
    this.tableDataSource.data= [];
    this.tableDataSource.data =node.tBLShamelProgramTrees_Children;
    console.log('node.tBLShamelProgramTrees_Children', node.tBLShamelProgramTrees_Children);
    this.selectedNode= node;
  }

}
