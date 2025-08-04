import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-learn-generate-test',
  templateUrl: './learn-generate-test.component.html',
  styleUrls: ['./learn-generate-test.component.css']
})
export class LearnGenerateTestComponent implements OnInit {
  isLoading:boolean =false;
  query = '';
  reply = '';
  questions = [];
  testId:any;
  selectedFile: File | null = null;
  extractedText: string = '';
  constructor(private http: HttpClient, private _apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  askAI() {
    if (!this.query) return;
    this.isLoading = true;
    this.reply = '...';

    this._apiService.sendQuery(this.query).subscribe(res => {
      console.log(res.reply);
      this.reply = res.reply;
      this.isLoading = false;
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  generateTest(value:any) {
    this.isLoading=true;
    if(value == 'content') {
      let obj = {
        content : this.reply
      }
      this.http.post<any>('/generateTestFromTest', obj).subscribe((res)=>{
        this.questions = res;
        console.log(this.questions);
        let testObj = {
          title: this.query,
          questions: res?.questions
        }
        this.http.post<any>('/createTests', testObj).subscribe((res)=>{
          this.testId = res._id;
          this.isLoading=false;
          const modalElement = document.getElementById('startTestModal');
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          }
        })
      })
    } else if(value == 'image') {
      if (!this.selectedFile) return;

      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.http.post<any>('/upload-image', formData).subscribe({
        next: (res:any) => {
          //this.extractedText = res.questions;
          this.questions = res.questions;
          let testObj = {
            title: this.query,
            questions: res?.questions
          }
          this.http.post<any>('/createTests', testObj).subscribe((res)=>{
            this.testId = res._id;
            this.isLoading=false;
            const modalElement = document.getElementById('startTestModal');
            if (modalElement) {
              const modal = new bootstrap.Modal(modalElement);
              modal.show();
            }
          })
        },
        error: (err:any) => {
          this.isLoading=false;
          alert(`Upload failed: ${err}`)
          console.error('Upload failed:', err);
        },
      });

    } else if(value == 'file') {
      if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<any>('/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress && event.total) {
      } else if (event.type === HttpEventType.Response) {
        console.log(event.body.questions)
        this.questions = event.body.questions;
        
        let testObj = {
          title: this.query,
          questions: event.body.questions
        }
        this.http.post<any>('/createTests', testObj).subscribe((res)=>{
          this.testId = res._id;
          this.isLoading = false;
          const modalElement = document.getElementById('startTestModal');
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          }
        })
      }
    });
    }
    
  }

  onStartTest() {
    // this.router.navigate(['/online-test?id=', this.testId]);
    const modalElement = document.getElementById('startTestModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.hide();
    }
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(el => el.remove());

    // Remove modal-open class from body
    document.body.classList.remove('modal-open');

    // Optionally remove inline styles
    document.body.style.removeProperty('overflow');
    this.router.navigate(['/online-test'], { queryParams: { id: this.testId } });
  }
}
