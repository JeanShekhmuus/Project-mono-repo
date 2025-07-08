import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pick-tasks',
  templateUrl: './pick-tasks.component.html',
  styleUrls: ['./pick-tasks.component.scss']
})
export class PickTasksComponent implements OnInit {

  constructor(private http: HttpClient) { }

  public offers: any[] = [];

  pickTaskString = 'Hello';

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/query/pick-tasks')
      .subscribe(
        answer => this.handleQueryResponse(answer),
        error => this.pickTaskString = JSON.stringify(error, null, 3)
      )
  }

  handleQueryResponse(answer: any[]) {
    this.offers = [];
    for (const product of answer) {
      if (product.price > 0) {
        this.offers.push(product);
      }
    }
    this.pickTaskString = `number of offers ${this.offers.length}`
  }

}
