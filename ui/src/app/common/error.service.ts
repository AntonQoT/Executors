import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    // private errorMessageSubject = new Subject<string>();
    // errorMessage$ = this.errorMessageSubject.asObservable();

    constructor(private snackBar: MatSnackBar) {
        // this.errorMessage$.subscribe((message) => {
        //     this.showError(message);
        // });
    }

    // showError(message: string) {
    //     this.snackBar.open(message, 'X', {
    //         duration: 5000,
    //         horizontalPosition: 'center',
    //         verticalPosition: 'bottom',
    //         panelClass: ['error-snackbar'],
    //     });
    // }

    handleError(message: string) {
        // this.errorMessageSubject.next(errorMessage);
        this.snackBar.open(message, 'X', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'],
        });
    }
}
