import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-review',
  templateUrl: './test-review.component.html',
  styleUrls: ['./test-review.component.css']
})
export class TestReviewComponent implements OnInit {
  reviewQuestions = [
    {
      text: 'What is the capital of France?',
      options: ['Berlin', 'Paris', 'Rome', 'Madrid'],
      correctAnswer: 'Paris',
      selectedAnswer: 'Rome',
      isCorrect: false
    },
    {
      text: '2 + 2 = ?',
      options: ['3', '4', '5', '6'],
      correctAnswer: '4',
      selectedAnswer: '4',
      isCorrect: true
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
