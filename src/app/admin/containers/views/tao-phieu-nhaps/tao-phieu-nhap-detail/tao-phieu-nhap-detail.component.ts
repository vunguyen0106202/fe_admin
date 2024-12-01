import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { TaoPhieuNhapService } from '../tao-phieu-nhap.service';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { TaoPhieuNhap1Service } from '../tao-phieu-nhap1.service';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-tao-phieu-nhap-detail',
  templateUrl: './tao-phieu-nhap-detail.component.html',
  styleUrls: ['./tao-phieu-nhap-detail.component.scss']
})
export class TaoPhieuNhapDetailComponent extends SecondPageEditBase  implements OnInit {
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    private serviceToast: ToastServiceService,
    private service: TaoPhieuNhap1Service
  ) {
    super(null,_injector);
  }
  formGroup: FormGroup;
  ngOnInit() {
    this.formGroup = new FormGroup({
    });
    
  }
  id:any
  
  modelEdit: any = {};
  async showPopup(id: any) {
    console.log("aaaa",id)
    this.isShow = true; 
    this.service.getDetail(id).then(re => {
            this.modelEdit = re as any;
    });
    
    
}
  closeForm() {
    this.isShow = false;
  }
}
