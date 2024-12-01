import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Data, Router } from '@angular/router';
import { ToastServiceService } from '../../shared/toast-service.service';
import { HoaDonComponent } from './hoa-don/hoa-don.component';
import {  HoaDonUser, HoaDonService } from './hoadon.service';
import * as signalR from '@microsoft/signalr';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { HoaDon1Service } from './hoadon1.service';
import { HoaDonEditComponent } from './hoa-don-edit/hoa-don-edit.component';
@Component({
  selector: 'app-hoa-dons',
  templateUrl: './hoa-dons.component.html',
  styleUrls: ['./hoa-dons.component.scss']
})
export class HoaDonsComponent extends SecondPageIndexBase implements OnInit {

  dataSource: any = [];
  searchModel: any = {
    key: '',
  };
  pageSize = 10;
  pageIndex = 0;
  
  constructor(
    protected _injector: Injector,
    public service: HoaDon1Service,
    public router: Router,
    public http: HttpClient,
    public serviceToast: ToastServiceService) 
    {
      super(_injector);
    }

  displayedColumns: string[] = ['id', 'id_User', 'ngayTao', 'ghiChi', 'tongTien','trangThai','actions'];
  async ngOnInit() {

    this.cols = [
      // { field: 'id', header: 'Mã', visible: true, width: '10%', sort: true },
      { field: 'fullName', header: 'Người Đặt', visible: true, width: '10%', sort: false },
      { field: 'trangThai', header: 'Trạng Thái', visible: true, width: '20%', sort: true }, 
      { field: 'ghiChu', header: 'Ghi Chú', visible: true, width: '20%', sort: true },
      { field: 'ngayTao', header: 'Ngày Tạo', visible: true, width: '20%', sort: true },
      { field: 'tongTien', header: 'Tổng Tiền', visible: true, width: '20%', sort: false },
    ];

  await this.getData();
    // const connection = new signalR.HubConnectionBuilder()
    //   .configureLogging(signalR.LogLevel.Information)
    //   .withUrl('https://localhost:44302/notify')
    //   .build();
    // connection.start().then(function () {
    //   console.log('SignalR Connected!');
    // }).catch(function (err) {
    //   return console.error(err.toString());
    // });
    // connection.on("BroadcastMessage", () => {
    //   this.service.getAllHoaDons();
    // });
  } 
  onPageChange(event) {
    this.getData();
  } 
  
  onChangeRowLimit() {
    this.getData();
    this.fixTableScrollProblem();
  }
  
  toggleSearch() {
    super.toggleSearch();
    this.fixTableScrollProblem();
  }
  
  async getData() {
   await this.service.Gets(this.searchModel.key, (this.page - 1) * this.limit, this.limit, this.sortField).then(res => {
      if (res.status) {
        this.dataSource = res.data;
        this.total = res.totalRecord;
        this.isLoading = false;
      }
    }).catch(error => {
      this.isLoading = false;
      this._notifierService.showHttpUnknowError();
    });
  }
  
  onSearchProducts() {
  this.pageIndex = 0;
  this.getData();
  }
  

  exportGeneratePdf() {
    window.open("https://localhost:44302/api/GeneratePdf/allorder", "_blank");
  }

  // clickDelete(id: number) {
  //   if (confirm('Bạn có chắc chắn xóa bản ghi này không?')) {
  //     this.service.delete(id).then(
  //       res => {
  //         if (res.status) {
  //           const data = this.dataSource.filter(product => product.id !== id);
  //           this.dataSource = data;
  //           this.serviceToast.showToastXoaThanhCong();
  //         } else {
  //           this.serviceToast.showToastXoaThatBai();
  //         }
  //       },
  //       err => {
  //         this.serviceToast.showToastXoaThatBai();
  //       }
  //     );
  //   }
  // }
    
  onSort(event) {
    this.sortField = event.field;
    this.getData();
  }
  @ViewChild(HoaDonEditComponent) _HoaDonEditComponent: HoaDonEditComponent;
  onEdit(id:any){
    this._HoaDonEditComponent.showPopup(id);
  }
  modelEdit: any = {};
  onCloseForm(item: any) {
    var idx = this.dataSource.findIndex(x => x.id === item.id);
    this.service.getDetailhoadon(item.id).then(re => {
        if(idx != -1) {
          this.modelEdit=re;
          console.log(':',this.modelEdit.hoaDon.trangThai);
          this.dataSource[idx].trangThai = this.modelEdit.hoaDon.trangThai;
        }
    })
  }

}
