import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'ng-bootstrap-ext';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss']
})
export class EditOfferComponent implements OnInit {

  validNames: string[] = ['jeans', 'tshirt'];

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3100/query/products')
    .subscribe(
      answer => this.handleQueryResponse(answer),
      error => this.debugOut = JSON.stringify(error, null, 3)
    );
  }

  handleQueryResponse(answer: any[]) {
    this.validNames = [];
    for (const elem of answer) {
      this.validNames.push(elem.product);
    }
    this.debugOut = `valid names: ${this.validNames}`
  }

  
  validPrice: number = 0

  formGroup = new FormGroup({
    productName: new FormControl('', [Validators.required, this.productNameValidator()]),
    productPrice: new FormControl(''),
  });

  productNameValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = this.validNames.indexOf(control.value) < 0;
      return forbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }

  productNameError(control: AbstractControl) {
    const forbidden = this.validNames.indexOf(control.value) < 0;
    return forbidden ? {forbiddenName: {value: control.value}} : null;
  }

  productPriceValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = this.validPrice >= control.value;
      return forbidden ? {forbiddenPrice: {value: control.value}} : null;
    }
  }

  debugOut = 'Hello edit offer';

  submitOffer() {
    this.debugOut = `Your input is ${this.formGroup.get('productName')?.value}`;
    const params =  {
      product: this.formGroup.get('productName')?.value,
      price: Number(this.formGroup.get('productPrice')?.value),
    }
    this.http.post<any>('http://localhost:3100/cmd/setPrice', params).subscribe(
      () => {
        this.toastService.success('Edit Offer', 'Price has been stored successfully !!!');
        this.router.navigate(['offer-tasks']);
      },
      (error) => {
        this.toastService.error('Edit Offer', `Problem: ${JSON.stringify(error, null, 3)}`);
      }
    )
  }

}
