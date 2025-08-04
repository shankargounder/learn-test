import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css']
})
export class OrganisationComponent implements OnInit {
  @ViewChild('previewSection') previewSection!: ElementRef;
  @ViewChild('shareSection') shareSection!: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }

  onGenerate() {
    this.previewSection.nativeElement.style.display = 'block';
    this.shareSection.nativeElement.style.display = 'none';
  }

  onConfirmPreview() {
    this.shareSection.nativeElement.style.display = 'block';
  }

   shareMode: 'class' | 'student' = 'class';

  classList: string[] = ['Class 11A', 'Class 11B', 'Physics Special', 'NEET Batch'];
  selectedClass: string = '';
  studentEmail: string = '';

  shareWithClass() {
    console.log('Sharing test with class:', this.selectedClass);
    // Implement API logic here
  }

  shareWithStudent() {
    console.log('Sharing test with student:', this.studentEmail);
    // Implement API logic here
  }

}
