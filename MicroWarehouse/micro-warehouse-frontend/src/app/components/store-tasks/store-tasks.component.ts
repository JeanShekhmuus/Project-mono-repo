import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-store-tasks',
  templateUrl: './store-tasks.component.html',
  styleUrls: ['./store-tasks.component.scss']
})
export class StoreTasksComponent implements OnInit {

  constructor(private http: HttpClient) { }

  public palettes: any[] = [];

  storeTaskString = 'Hello Students';

  ngOnInit() {
    this.http.get<any>(environment.baseurl + 'query/palettes')
      .subscribe(
        answer => this.handleQueryResponse(answer),
        error => this.storeTaskString = JSON.stringify(error, null, 3)
      )
  }

  handleQueryResponse(answer: any) {
    console.log('there is some data')
    for (const e of answer.result) {
      this.palettes.push(e.payload);
    }
    this.storeTaskString = `/query/palettes response contains ${this.palettes.length} palettes`
    console.log(this.storeTaskString)
  }

  /*answer : any = {};

  async ngOnInit() {
    this.answer = await this.http
      .get<any>('http://localhost:3000/query/palettes')
      .toPromise();
    console.log('there is some data')
    for (const e of this.answer.result) {
      this.palettes.push(e.payload);
    }
    //this.storeTaskString = JSON.stringify(this.answer, null, 3)
    console.log(this.storeTaskString)
  }*/

}
