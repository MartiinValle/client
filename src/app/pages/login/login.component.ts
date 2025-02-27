import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/http/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form:FormGroup;
  mensajeError: string;
  constructor(
    private router:Router,
    private formBuilder:FormBuilder, 
    private userService: AuthService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init(){
    this.form = this.formBuilder.group({
      NombreUsuario:['',[Validators.required]],
      Contrasenna:['',[Validators.required]]
    })
  }

  onSubmit(){
    if(this.form.invalid){
      return Object.values(this.form.controls).forEach(control=>{
        control.markAllAsTouched();
      })
    }
    this.userService.login(this.form.value).subscribe( data => {     
      this.router.navigate(['/Assets']);     
    }, (error)=>{
      this.mensajeError = error;
    });
  }


  get Username():AbstractControl{return this.form.get('NombreUsuario');}
  get Password():AbstractControl{return this.form.get('Contrasenna');}


}
