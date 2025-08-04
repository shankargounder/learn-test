import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
declare var bootstrap: any;

interface Question {
  question: string;
  options: string[];
  selectAnswer?: string;
  status?: string;
}

@Component({
  selector: 'app-online-test',
  templateUrl: './online-test.component.html',
  styleUrls: ['./online-test.component.css']
})
export class OnlineTestComponent implements OnInit {
  testId!: string;
  questions: Question[] = [];
  currentIndex = 0;
  isLoading = true;
  timeLeft: number = 0; // 15 minutes in seconds
  formattedTime: string = '';
  submittedTestId:any;

  private timerInterval: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
        this.fetchTestDetails(this.testId);
      }
    });
    this.startTimer();
  }

  startTimer() {
    this.updateFormattedTime(); // show initial time
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateFormattedTime();
      } else {
        clearInterval(this.timerInterval);
        this.submitTestOnTimeout();
      }
    }, 1000);
  }

  updateFormattedTime() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.formattedTime = `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  submitTestOnTimeout() {
    alert('⏳ Time is up! Submitting your test.');
    this.router.navigate(['/result-page']);
  }

  fetchTestDetails(testId: string) {
    const obj = { id: testId };
    this.http.post<any>('/getTestDetailsBasedOnId', obj)
      .subscribe({
        next: res => {
          this.questions = res.questions || [];
          this.isLoading = false;
          this.timeLeft = this.questions.length * 60;
        },
        error: err => {
          console.error('Failed to load questions:', err);
          this.isLoading = false;
        }
      });
  }

  get currentQuestion(): Question | undefined {
    return this.questions[this.currentIndex];
  }

  selectOption(option: string): void {
    if (this.currentQuestion) {
      this.currentQuestion.selectAnswer = option;
    }
    console.log(this.currentQuestion);
  }

  nextQuestion(): void {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  prevQuestion(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  clearAnswer(): void {
    if (this.currentQuestion) {
      this.currentQuestion.selectAnswer = '';
    }
  }

  markForReview(): void {
    if (this.currentQuestion) {
      this.currentQuestion.status = 'marked';
    }
  }

  isAttempted(index: number): boolean {
    return !!this.questions[index]?.selectAnswer;
  }

  isMarked(index: number): boolean {
    return this.questions[index]?.status === 'marked';
  }

  goToQuestion(index: number): void {
    this.currentIndex = index;
  }

  submitTest() {
    const modalElement = document.getElementById('startTestModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(el => el.remove());

    // Remove modal-open class from body
    document.body.classList.remove('modal-open');

    // Optionally remove inline styles
    document.body.style.removeProperty('overflow');
  }

  onEndTest() {
    let testObj = {
      testId: this.testId,
      questions: this.questions
    }
    this.http.post<any>('/submitTests', testObj).subscribe((res)=>{
      this.submittedTestId = res._id;
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(el => el.remove());

      // Remove modal-open class from body
      document.body.classList.remove('modal-open');

      // Optionally remove inline styles
      document.body.style.removeProperty('overflow');
      this.router.navigate(['/result-page'], { queryParams: { id: this.submittedTestId } });
    })
  }

}