import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss'
})
export class MaintenanceComponent implements OnInit, OnDestroy {
  showImage = false;
  private _timer: any;

  ngOnInit(): void {
    // delay image appearance to avoid brief flashes during navigation
    this._timer = setTimeout(() => {
      this.showImage = true;
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

}
