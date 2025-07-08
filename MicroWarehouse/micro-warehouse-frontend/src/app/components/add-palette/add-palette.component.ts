import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-palette',
  templateUrl: './add-palette.component.html',
  styleUrls: ['./add-palette.component.scss']
})
export class AddPaletteComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  barcode = ''

  product = ''

  amount = ''

  location = ''

  ngOnInit(): void {
  }

  async addPalette() {
    const newPalette = {
      barcode: this.barcode,
      product: this.product,
      amount: this.amount,
      location: this.location
    }

    const newCmd = {
      opCode: 'storePalette',
      parameters: newPalette,
    }

    this.http.post<any>(environment.baseurl + 'cmd', newCmd).subscribe(
      () => this.router.navigate(['store-tasks'])
    )

  }

}
