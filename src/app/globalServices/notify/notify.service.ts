import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
//import { Notyf } from 'notyf';
@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor() { }

  toast(msg:any,status:any,toast=true,time=1500){
    
    if(status == 1){
      status = "success";
    }else if(status == 2){
      status = "warning";
    }else{
      status = "error";
    }
    
    if(toast){    
      //this.notyf.error(msg);

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: time,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      Toast.fire({
        icon:status,
        title: msg,
      });
    }else{
      Swal.fire({
        title:msg,
        icon:status,
        timer:time
      });
    }
  }
}
