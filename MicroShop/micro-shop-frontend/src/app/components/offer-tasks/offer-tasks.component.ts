import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-offer-tasks',
  templateUrl: './offer-tasks.component.html',
  styleUrls: ['./offer-tasks.component.scss']
})
export class OfferTasksComponent implements OnInit {

  constructor(
    private http: HttpClient,
    
    ) { }

  public offers: any[] = [];

  storeTaskString = 'Hello offer tasks';

  ngOnInit() {
    this.offers.push({
      product: "blue jeans",
      state: "in stock",
      amount: 6,
      price: 0.0,
    });
    this.offers.push({
      product: "tshirt",
      state: "in stock",
      amount: 7,
      price: 0.0,
    });

    this.storeTaskString = `number of offers ${this.offers.length}`

    this.http.get<any>(environment.baseurl + '')
    .subscribe(
      answer => this.handleQueryResponse(answer),
      error => this.storeTaskString = JSON.stringify(error, null, 3)
    );
  }

  handleQueryResponse(answer: any[]) {
    this.offers = [];
    for (const product of answer) {
      this.offers.push(product);
    }
    this.storeTaskString = `number of offers ${this.offers.length}`
  }

}
