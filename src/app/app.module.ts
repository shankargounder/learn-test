import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { StudentsComponent } from './students/students.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { AppRoutingModule } from "./app.routing.module";
import { LearnGenerateTestComponent } from './learn-generate-test/learn-generate-test.component';
import { OnlineTestComponent } from './online-test/online-test.component';
import { ResultPageComponent } from './result-page/result-page.component';
import { FormsModule } from '@angular/forms';
import { TestReviewComponent } from './test-review/test-review.component';
import { CareerGuidanceComponent } from './career-guidance/career-guidance.component';
import { HttpClientModule } from '@angular/common/http';
// import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StudentsComponent,
    OrganisationComponent,
    LearnGenerateTestComponent,
    OnlineTestComponent,
    ResultPageComponent,
    TestReviewComponent,
    CareerGuidanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
    // CommonModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
