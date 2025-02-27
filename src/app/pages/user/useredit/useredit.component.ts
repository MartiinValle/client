import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RolesService } from 'src/app/core/http/roles.service';
import { UserService } from 'src/app/core/http/user.service';

@Component({
  selector: 'app-useredit',
  templateUrl: './useredit.component.html',
  styleUrls: ['./useredit.component.scss']
})
export class UsereditComponent implements OnInit {

  editUser: FormGroup;
  roles: any[] = [];
  id: number;
  userData: any;

  event: EventEmitter<any> = new EventEmitter();

  constructor(
    private builder: FormBuilder, 
    private userService: UserService, 
    private rolService: RolesService,
    private bsModalRef: BsModalRef
  ) { 
    this.editUser = this.builder.group({
      Roles: new FormControl(null, []),
      NombreUsuario: new FormControl('', []),
      Contrasenna: new FormControl('', [])
    });

    this.rolService.showAll().subscribe(data => {
      Object.assign(this.roles, data);
    }, error => { console.log('Error al obtener la información.'); });

    this.userService.IdUsuario.subscribe(data => {
      this.id = data;
      if (this.id !== undefined) {
        this.userService.getUser(this.id).subscribe(data => {
          this.userData = data;
          
          if (this.editUser!=null && this.userData!=null) {
            this.editUser.controls['Roles'].setValue(this.userData.IdRol);
            this.editUser.controls['NombreUsuario'].setValue(this.userData.NombreUsuario);
            this.editUser.controls['Contrasenna'].setValue(this.userData.Contrasenna);
          }
        }, error => { console.log("Error al obtener los datos del usuario") });
      }
    });
  }

  ngOnInit(): void {
    
  }

  editarUsuario(){
    let userData = {
      'NombreUsuario': this.editUser.get('NombreUsuario').value,
      'Contrasenna': this.editUser.get('Contrasenna').value,
      'Roles': this.editUser.get('Roles').value,
    };

    console.log(userData);

    this.userService.editUser(this.id, userData).subscribe(data => {      
        this.event.emit('OK');
        this.bsModalRef.hide();      
    });
  }

  onClose() {
    this.bsModalRef.hide();
  }


}
