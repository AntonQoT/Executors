import { Component } from '@angular/core';
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
        BasicFormComponent,
    ],
    templateUrl: './basic-elements.component.html',
    styleUrl: './basic-elements.component.scss',
})
export class BasicElementsComponent {
    constructor(private http: HttpClient, private jenkinsService: JenkinsService) {}

    runPipelineMobile(): void {
        this.jenkinsService.triggerPipelineMobile().subscribe({
            next: (response: any) => {
                console.log('Mobile Pipeline triggered successfully', response);
            },
            error: (error: any) => {
                console.error('Error triggering Mobile pipeline', error);
            },
        });
    }

    runPipelineWeb(): void {
        this.jenkinsService.triggerPipelineWeb().subscribe({
            next: (response: any) => {
                console.log('Web Pipeline triggered successfully', response);
            },
            error: (error: any) => {
                console.error('Error triggering Web pipeline', error);
            },
        });
    }

    runPipelineApi(): void {
        this.jenkinsService.triggerPipelineApi().subscribe({
            next: (response: any) => {
                console.log('API Pipeline triggered successfully', response);
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
