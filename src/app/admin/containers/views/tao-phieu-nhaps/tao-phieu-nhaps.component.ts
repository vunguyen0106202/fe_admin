import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Data, Router } from '@angular/router';
import { ToastServiceService } from '../../shared/toast-service.service';
import * as signalR from '@microsoft/signalr';
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { TaoPhieuNhap1Service } from './tao-phieu-nhap1.service';
import { DiscountService } from '../discout-codes/discount.service';
import { TaoPhieuNhapDetailComponent } from './tao-phieu-nhap-detail/tao-phieu-nhap-detail.component';
import { TaoPhieuNhapComponent } from './tao-phieu-nhap/tao-phieu-nhap.component';

@Component({
  selector: 'app-tao-phieu-nhaps',
  templateUrl: './tao-phieu-nhaps.component.html',
  styleUrls: ['./tao-phieu-nhaps.component.scss']
})
export class TaoPhieuNhapsComponent extends SecondPageIndexBase implements OnInit,AfterViewInit {
  @ViewChild(TaoPhieuNhapDetailComponent) _TaoPhieuNhapDetailComponent: TaoPhieuNhapDetailComponent;
  @ViewChild(TaoPhieuNhapComponent) _TaoPhieuNhapComponent: TaoPhieuNhapComponent;
  dataSource: any = [];
  searchModel: any = {
    key: '',
  };
  pageSize = 10;
  pageIndex = 0;
  
  constructor(
    protected _injector: Injector,
    public service: TaoPhieuNhap1Service,
    public router: Router,
    public http: HttpClient,
    public serviceToast: ToastServiceService) 
    {
      super(_injector);
    }

  displayedColumns: string[] = [ 'soChungTu', 'ngayTao', 'ghiChu', 'tongTien','tenNhaCungCap','nguoiLapPhieu','actions'];
  async ngOnInit() {

    this.cols = [
      { field: 'soChungTu', header: 'Số Chứng Từ', visible: true, width: '20%', sort: false },
      { field: 'tenNhaCungCap', header: 'Tên Nhà Cung Cấp', visible: true, width: '20%', sort: true }, 
      { field: 'nguoiLapPhieu', header: 'Người Lập Phiếu', visible: true, width: '20%', sort: true }, 
      { field: 'ghiChu', header: 'Ghi Chú', visible: true, width: '20%', sort: true },
      { field: 'ngayTao', header: 'Ngày Tạo', visible: true, width: '20%', sort: true },
      { field: 'tongTien', header: 'Tổng Tiền', visible: true, width: '20%', sort: false },
    ];

  await this.getData();
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

    
  onSort(event) {
    this.sortField = event.field;
    this.getData();
  }

  ngAfterViewInit() {
    console.log("TaoPhieuNhapDetailComponent đã khởi tạo");
  }
  modelEdit: any = {};
  onCloseForm(item: any) {
    console.log(item);
    this.dataSource.push(item);
  }
  clickDelete(id: number) {
    if (confirm('Bạn có chắc chắn xóa bản ghi này không?')) {
      this.service.delete(id).then(
        res => {
          if (res.status) {
            const data = this.dataSource.filter(p => p.id !== id);
            this.dataSource = data;
            this.serviceToast.showToastXoaThanhCong();
          } else {
            this.serviceToast.showToastXoaThatBai();
          }
        },
        err => {
          this.serviceToast.showToastXoaThatBai();
        }
      );
    }
  }
  onEdit(id:any){
    this._TaoPhieuNhapDetailComponent.showPopup(id);
  }
  exportGeneratePdf() {
    window.open("https://localhost:44302/api/GeneratePdf/allorder", "_blank");
  }
  onAdd(){
    this._TaoPhieuNhapComponent.showPopup();
  }

}












// import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
// import { MatPaginator } from "@angular/material/paginator";
// import { MatSort } from "@angular/material/sort";
// import { PhieuNhap, TaoPhieuNhapService } from "./tao-phieu-nhap.service";
// import * as signalR from "@microsoft/signalr";
// import { Router } from "@angular/router";
// import { HttpClient } from "@angular/common/http";
// import { MatDialog } from "@angular/material/dialog";
// import { ToastServiceService } from "../../shared/toast-service.service";
// import { TaoPhieuNhapComponent } from "./tao-phieu-nhap/tao-phieu-nhap.component";
// @Component({
//   selector: "app-tao-phieu-nhaps",
//   templateUrl: "./tao-phieu-nhaps.component.html",
//   styleUrls: ["./tao-phieu-nhaps.component.scss"],
// })
// export class TaoPhieuNhapsComponent implements OnInit, AfterViewInit {
//   @ViewChild(MatSort) sort: MatSort;
//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   constructor(
//     public service: TaoPhieuNhapService,
//     public router: Router,
//     public http: HttpClient,
//     public dialog: MatDialog,
//     public serviceToast: ToastServiceService
//   ) {}
//   displayedColumns: string[] = [
//     "id",
//     "soChungTu",
//     "tenNhaCungCap",
//     "ngayTao",
//     "tongTien",
//     "nguoiLapPhieu",
//     "actions",
//   ];
//   ngOnInit(): void {
//     this.service.getAllPhieuNhaps();
//     const connection = new signalR.HubConnectionBuilder()
//       .configureLogging(signalR.LogLevel.Information)
//       .withUrl("https://localhost:44302/notify")
//       .build();
//     connection
//       .start()
//       .then(function () {
//         console.log("SignalR Connected!");
//       })
//       .catch(function (err) {
//         return console.error(err.toString());
//       });
//     connection.on("BroadcastMessage", () => {
//       this.service.getAllPhieuNhaps();
//     });
//   }
//   doFilter = (value: string) => {
//     this.service.dataSource.filter = value.trim().toLocaleLowerCase();
//   };
//   ngAfterViewInit(): void {
//     this.service.dataSource.sort = this.sort;
//     this.service.dataSource.paginator = this.paginator;
//   }
//   addphieu() {
//     this.service.phieunhap = new PhieuNhap();
//     this.router.navigate(["admin/taophieunhap/them"]);
//   }
//   exportGeneratePdf() {
//     window.open("https://localhost:44302/api/GeneratePdf/allphieunhap", "_blank");
//   }
//   populateForm(id: any) {
//     this.service.idphieunhap = id;
//     this.router.navigate(["admin/taophieunhap/detail/" + id]);
//   }
//   clickDelete(id) {
//     if (confirm("Bạn có chắc chắn xóa bản ghi này không ??")) {
//       this.service.delete(id).subscribe(
//         (res) => {
//           this.serviceToast.showToastXoaThanhCong();
//           this.service.getAllPhieuNhaps();
//         },
//         (err) => {
//           this.serviceToast.showToastXoaThatBai();
//         }
//       );
//     }
//   }
// }
