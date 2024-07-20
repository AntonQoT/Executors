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
    constructor(private http: HttpClient) {}
    runCommand() {
        const url = 'http://localhost:8080/job/Hack-Test/build';
        const username = 'AntonTate';
        const apiToken = '11b9f8bef3292dfc7b24e09c4e375c860d';
        const headers = new HttpHeaders({
            Authorization: 'Basic ' + btoa(username + ':' + apiToken),
        });

        this.http
            .post(url, null, { headers })
            .pipe(catchError(this.handleError))
            .subscribe({
                next: (response) => {
                    console.log('Command executed successfully', response);
                },
                error: (error) => {
                    console.error('Error executing command', error);
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
