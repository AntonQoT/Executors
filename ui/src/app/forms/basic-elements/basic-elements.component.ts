import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { BasicFormComponent } from './basic-form/basic-form.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { catchError, throwError } from 'rxjs';
import { JenkinsService } from './jenkins';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-basic-elements',
    standalone: true,
    imports: [
        RouterLink,
        MatCardModule,
        MatButton,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        BasicFormComponent,
    ],
    templateUrl: './basic-elements.component.html',
    styleUrl: './basic-elements.component.scss',
})
export class BasicElementsComponent implements OnInit {
    buildNumbers: { [key: string]: number } = {
        mobile: 2,
        web: 26,
        api: 2,
    };

    constructor(private http: HttpClient, private jenkinsService: JenkinsService) {}

    ngOnInit(): void {
        this.loadBuildNumbers();
    }

    loadBuildNumbers(): void {
        const storedBuildNumbers = localStorage.getItem('buildNumbers');
        if (storedBuildNumbers) {
            this.buildNumbers = JSON.parse(storedBuildNumbers);
        }
    }

    saveBuildNumbers(): void {
        localStorage.setItem('buildNumbers', JSON.stringify(this.buildNumbers));
    }

    incrementBuildNumber(type: string): void {
        this.buildNumbers[type]++;
        this.saveBuildNumbers();
    }

    runPipelineMobile(): void {
        this.incrementBuildNumber('mobile');
        this.jenkinsService.triggerPipelineMobile().subscribe({
            next: (response: any) => {
                console.log('Mobile Pipeline triggered successfully', response);
                const buildNumber = this.buildNumbers['mobile'];
                const url = `http://localhost:8080/view/all/job/mobile-Tests/${buildNumber}/allure/`;
                window.open(url, '_blank');
            },
            error: (error: any) => {
                console.error('Error triggering Mobile pipeline', error);
            },
        });
    }

    runPipelineWeb(): void {
        this.incrementBuildNumber('web');
        this.jenkinsService.triggerPipelineWeb().subscribe({
            next: (response: any) => {
                console.log('Web Pipeline triggered successfully', response);
                const buildNumber = this.buildNumbers['web'];
                const url = `http://localhost:8080/view/all/job/Web-Tests/${buildNumber}/allure/`;
                window.open(url, '_blank');
            },
            error: (error: any) => {
                console.error('Error triggering Web pipeline', error);
            },
        });
    }

    runPipelineApi(): void {
        this.incrementBuildNumber('api');
        this.jenkinsService.triggerPipelineApi().subscribe({
            next: (response: any) => {
                console.log('API Pipeline triggered successfully', response);
                const buildNumber = this.buildNumbers['api'];
                const url = `http://localhost:8080/view/all/job/Web-Api/${buildNumber}/allure/`;
                window.open(url, '_blank');
            },
            error: (error: any) => {
                console.error('Error triggering API pipeline', error);
            },
        });
    }

    private handleError(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }
}
