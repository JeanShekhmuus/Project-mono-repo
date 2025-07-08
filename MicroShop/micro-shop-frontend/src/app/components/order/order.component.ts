import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'ng-bootstrap-ext';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  public debugOut = 'Hello order';

  public product = 'no product'

  public formGroup = new FormGroup({
    order: new FormControl('', [Validators.required]),
    product: new FormControl('', [Validators.required]),
    customer: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.product = params['product']
      this.formGroup.get('order')?.setValue('o_' + new Date().toISOString())
      this.formGroup.get('product')?.setValue(this.product)
    });
  }

  submitOffer() {
    this.debugOut = `Your name is ${this.formGroup.get('customer')?.value}`;
    const params = {
      order: this.formGroup.get('order')?.value,
      product: this.formGroup.get('product')?.value,
      customer: this.formGroup.get('customer')?.value,
      address: this.formGroup.get('address')?.value,
    }
    this.http.post<any>('http://localhost:3100/cmd/placeOrder', params).subscribe(
      () => {
        this.toastService.success('Order', 'order submitted successfully !!!');
        this.router.navigate(['home', this.formGroup.get('customer')?.value]);
      },
      (error) => {
        this.toastService.error('Error Offer', `Problem: ${JSON.stringify(error, null, 3)}`);
      }
    );
  }

}
