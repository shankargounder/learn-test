import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.css']
})
export class ResultPageComponent implements OnInit {
  testId:any;
  totalQuestion:any;
  attempt=0;
  wrong=0;
  correct=0;
  performance=0;
  notAttempt=0;
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(el => el.remove());

    // Remove modal-open class from body
    document.body.classList.remove('modal-open');

    // Optionally remove inline styles
    document.body.style.removeProperty('overflow');
    this.route.queryParams.subscribe(params => {
      this.testId = params['id'];
      if (this.testId) {
        this.fetchTestDetails();
      }
    });
  }

  fetchTestDetails() {
    const obj = { id: this.testId };
    this.http.post<any>('/getSubmittedTestDetailsBasedOnId', obj).subscribe((res)=>{
      console.log(res);
      this.totalQuestion = res.questions.length;
      let response = res.questions;
      response.forEach((val:any)=>{
        if(val.answer === val.selectAnswer) {
          this.correct++
        } else if(val.selectAnswer === '' || val.selectAnswer === undefined) {
          this.notAttempt++;
        }else if(val.answer !== val.selectAnswer) {
          this.wrong++
        }
      })
      this.attempt = this.totalQuestion - this.notAttempt;
      this.performance = Math.round((this.correct/this.totalQuestion)*100);
    })
  }

}

