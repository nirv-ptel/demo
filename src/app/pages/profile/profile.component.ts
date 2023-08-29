import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/@models/users';
import { UserService } from 'src/app/@services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  users: User[] = [];
  userForm: FormGroup;
  selectedImage: File | null = null;

  constructor(private fb: FormBuilder,
    private _userService: UserService
  ) {
    this.userForm = this.fb.group({
      id:[null],
      name: ['', Validators.required],
      email: [null],
      password: [null],
      mobileNo: [null],
      photo: [''] // Image input control
    });
  }

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData() {
    this._userService.getAllUser().subscribe((data) => {
      this.users = data;
      console.warn(this.users);
    });
  }

  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  onSubmit() {
    const id = this.userForm.get('id')?.value;
    if(id !== null) {
      this.updateUser(id, this.userForm.value);
    } else {
      this.submitUser();
    }

  }
  submitUser() {
    if (this.selectedImage) {
      this._userService.createUser(this.userForm.value, this.selectedImage).subscribe((data) => {
        console.warn(data);
        this.userForm.reset();      
        this.fetchUserData();
      });
    } else {
      this._userService.createUser(this.userForm.value).subscribe((data) => {
        console.warn(data);
        this.userForm.reset();      
        this.fetchUserData();
      });
    }
  }

  deleteUser(id: number) {
    this._userService.deleteUser(id).subscribe(data => {
      this.fetchUserData();
    })
  }

  updateUser(id: number, user: User) {
    if (this.selectedImage) { 
      this._userService.updateUser(id, user, this.selectedImage).subscribe(data => {
        this.fetchUserData();
      })
    } else {
      this._userService.updateUser(id, user).subscribe(data => {
        this.fetchUserData();
      })
    }
    this.userForm.reset();
  }

  update(id: number) {
    this._userService.getByIdUser(id).subscribe(data => {
      console.warn(data);
      this.userForm.get('id')?.setValue(data.id);
      this.userForm.get('name')?.setValue(data.name);
      this.userForm.get('email')?.setValue(data.email);
      this.userForm.get('mobileNo')?.setValue(data.mobileNo);
      this.userForm.get('password')?.setValue(data.password);

    })
  }

}
