import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class JenkinsService {
    private jenkinsUrl = 'http://localhost:8080/job/Execution Lab/build';
    private username = 'AntonTate';
    private apiToken = '11b9f8bef3292dfc7b24e09c4e375c860d';

    constructor(private http: HttpClient) {}

    triggerPipeline(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: 'Basic ' + btoa(this.username + ':' + this.apiToken),
            'Content-Type': 'application/json',
        });

        return this.http
            .post(this.jenkinsUrl, null, { headers, withCredentials: true })
            .pipe(catchError(this.handleError));
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
