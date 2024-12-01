import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { SecondPageIndexBase } from '../../../../classes/base/second-page-index-base';
import { ToastServiceService } from '../../shared/toast-service.service';
import { User1Service } from './user1.service';
@Component({
  selector: 'app-asp-net-users',
  templateUrl: './asp-net-users.component.html',
  styleUrls: ['./asp-net-users.component.scss']
})
export class AspNetUsersComponent  extends SecondPageIndexBase implements OnInit, AfterViewInit { 
  dataSource: any = [];
  searchModel: any = {
    key: '',
  };
  pageSize = 10;
  pageIndex = 0;
 
  constructor(
    protected _injector: Injector,
    private service:User1Service,
    private router : Router,
    private http: HttpClient, 
    private toastService: ToastServiceService
  ) 
    {
      super(_injector);
    }  
    async ngOnInit() { 
      this.cols = [
        { field: 'id', header: 'Mã', visible: true, width: '40%', sort: true },
        { field: 'firstName', header: 'First name', visible: true, width: '20%', sort: true },
        { field: 'lastName', header: 'Last name', visible: true, width: '20%', sort: true },
        { field: 'email', header: 'Tài khoản', visible: true, width: '20%', sort: true },
        { field: 'sdt', header: 'Số điện thoại', visible: true, width: '20%', sort: true },
        { field: 'diaChi', header: 'Địa chỉ', visible: true, width: '20%', sort: true },
        { field: 'quyen', header: 'Quyền', visible: true, width: '20%', sort: true },
      ];
      await this.getData();
      }
  ngAfterViewInit(): void { 
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
}
 