import { HoaDon1Service } from '../hoadon1.service';
import { Component, EventEmitter, Injector, OnInit, Output,Input } from '@angular/core'; 
import { SecondPageEditBase } from '../../../../../classes/base/second-page-edit-base';
import { MessageService } from 'primeng/api';
import { ToastServiceService } from '../../../shared/toast-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';

@Component({
  selector: 'app-hoa-don-edit',
  templateUrl: './hoa-don-edit.component.html',
  styleUrls: ['./hoa-don-edit.component.scss']
})
export class HoaDonEditComponent extends SecondPageEditBase  implements OnInit {
  [x: string]: any;
  @Output() onSaved: EventEmitter<any> = new EventEmitter<any>();
  submitted = false;
  constructor(
    protected _injector: Injector,
    private messageService: MessageService,
    private serviceToast: ToastServiceService,
    private service: HoaDon1Service
  ) {
    super(null,_injector);
  }
  modelEdit: any = {}; 
  formGroup: FormGroup;
  @Input() hoaDonId!: number;
  trangThai!: number;
  trangThaiOptions = [
    {  label: 'Chưa xác nhận' ,value: 0},
    {  label: 'Đã xác nhận' ,value: 1},
    {  label: 'Hoàn thành',value: 2 },
    {  label: 'Đã hủy',value: 3 },
  ];
  hd:any={};
  async showPopup(id: any) {
    this.isShow = true; 
    this.service.getDetailhoadon(id).then(re => {
            this.modelEdit = re as any;
            this.hoaDonId=id;
            this.hd = this.modelEdit.hoaDon;
            console.log(this.hd.trangThai)
      // this.formGroup = new FormGroup({
      //   trangThai: new FormControl('')
      // });
      // this.formGroup.patchValue({
      //   trangThai: this.hd,  // Gán giá trị trangThai từ dữ liệu nhận được
      // });
      // this.trangThaiOptions.sort((a, b) => {
      //   if (a.value === this.hd) {
      //     return -1;  
      //   } else if (b.value === this.hd) {
      //     return 1;  
      //   }
      //   return 0; 
      // });    
    });
    
    
}

closeForm() {
  this.isShow = false;
}
ngOnInit() {
  this.formGroup = new FormGroup({
    trangThai: new FormControl('')  
  });
  
}

save() {
  this.submitted = true;
  //const trangThai = this.formGroup.get('trangThai')?.value.value; 
  const trangThai=this.hd.trangThai;
  console.log("Giá trị trangThai trước khi gửi:", trangThai,this.hd); 
  const formData = new FormData();
  if(trangThai==null){
    formData.append('TrangThai', this.hd.toString())
  }else{
    formData.append('TrangThai', trangThai.toString())
    this.service.Save(this.hoaDonId, formData).subscribe(
      re=>{
        if (re.status) {
          this.serviceToast.showToastSuaThanhCong();
          this.onSaved.emit(re.data);
          
        }
      }
    );
  }
  this.isShow = false;
  

  
}
  
}

