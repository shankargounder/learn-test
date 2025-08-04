import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { StudentsComponent } from "./students/students.component";
import { OrganisationComponent } from "./organisation/organisation.component";
import { LearnGenerateTestComponent } from "./learn-generate-test/learn-generate-test.component";
import { OnlineTestComponent } from "./online-test/online-test.component";
import { ResultPageComponent } from "./result-page/result-page.component";
import { TestReviewComponent } from "./test-review/test-review.component";
import { CareerGuidanceComponent } from "./career-guidance/career-guidance.component";

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'student', component: StudentsComponent },
    { path: 'organisation', component: OrganisationComponent },
    { path: 'student-learn-test', component: LearnGenerateTestComponent },
    { path: 'online-test', component: OnlineTestComponent },
    { path: 'result-page', component: ResultPageComponent },
    { path: 'test-review', component: TestReviewComponent },
    { path: 'career-guidance', component: CareerGuidanceComponent },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}