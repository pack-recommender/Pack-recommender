import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../shared/services/language.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
declare const AOS: any;

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit, AfterViewInit {
  contactForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  constructor(
    public langService: LanguageService,
    private fb: FormBuilder,
    private http: HttpClient,
    private translate: TranslateService
  ) {

  }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      message: ['']
    });
  }

  ngAfterViewInit(): void {
    AOS.init({ duration: 800 });

    const header = document.querySelector('.navbar') as HTMLElement;
    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      if (scrollPos >= headerHeight) {
        header.classList.add('scrolled', 'shadow-sm');
      } else {
        header.classList.remove('scrolled', 'shadow-sm');
      }
    });
  }


  sendMessage(): void {
    if (this.contactForm.invalid) return;

    this.http.post('/.netlify/functions/send-email', this.contactForm.value).subscribe({
      next: () => {
        this.successMessage = this.translate.instant('contact.success');
        this.errorMessage = '';
        this.contactForm.reset();
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = this.translate.instant('contact.error');
      }
    });
  }
}
