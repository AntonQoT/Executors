import { Injectable, NgZone, OnDestroy } from '@angular/core';
import {
    Auth,
    User,
    authState,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, Subscription, from, throwError } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { MyProfile } from '../my-profile/my-profile.model';
import { MyProfileService } from '../my-profile/my-profile.service';
import { ErrorService } from '../common/error.service';
import { environment } from '../../environments/environment';
import { FirebaseError } from 'firebase/app';

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    myProfile$: Observable<MyProfile>;
    subscriptions: Subscription[] = [];
    currentUser$: Observable<User | null>;
    private currentUser: User | null = null;
    private redirectPath: string;
    collection = 'users';

    constructor(
        private router: Router,
        private auth: Auth,
        private firestore: Firestore,
        private myProfileService: MyProfileService,
        public ngZone: NgZone,
        private errorService: ErrorService
    ) {
        this.currentUser$ = authState(this.auth);
    }

    authListener() {
        this.subscriptions.push(
            this.currentUser$.subscribe(
                (user) => {
                    if (user) {
                        this.currentUser = user;
                        this.myProfile$ = from(
                            getDoc(doc(this.firestore, `${this.collection}/${this.currentUser.uid}`))
                        ).pipe(
                            map((docSnap) => docSnap.data() as MyProfile),
                            filter((profile) => !!profile)
                        );
                    } else {
                        this.handleSignOut();
                    }
                },
                (error) => {
                    console.error('authListener error:', error);
                }
            )
        );
    }

    async isEmailVerified(): Promise<boolean> {
        const currentUser = this.auth.currentUser;
        return currentUser?.emailVerified ?? false;
    }

    signInWithEmailAndPassword(email: string, password: string, redirectPath: string = '/dashboard') {
        return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
            catchError((error: FirebaseError) => {
                let errorMessage: string;
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'No account found with this email address.';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Incorrect password. Please try again.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address format.';
                        break;
                    case 'auth/user-disabled':
                        errorMessage = 'This account has been disabled. Please contact support.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many unsuccessful login attempts. Please try again later.';
                        break;
                    case 'auth/invalid-credential':
                        errorMessage = 'Invalid Sign In credentials provided. Please try again.';
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = 'Network error. Please check your internet connection and try again.';
                        break;
                    default:
                        errorMessage = 'An error occurred during sign in. Please try again.';
                }
                this.errorService.handleError(errorMessage);
                return throwError(() => new Error(errorMessage));
            }),
            tap(async (result) => {
                this.currentUser = result.user;
                if (await this.isEmailVerified()) {
                    this.router.navigate([redirectPath]);
                } else {
                    this.sendVerificationMail();
                }
            })
        );
    }

    // signInWithEmailAndPassword2(email: string, password: string, redirectPath: string = '/dashboard') {
    //     return signInWithEmailAndPassword(this.auth, email, password)
    //         .then(async (result) => {
    //             this.currentUser = result.user;
    //             if (await this.isEmailVerified()) {
    //                 this.router.navigate([redirectPath]);
    //             } else {
    //                 this.sendVerificationMail();
    //             }
    //         })
    //         .catch((error: FirebaseError) => {
    //             let errorMessage: string;

    //             switch (error.code) {
    //                 case 'auth/user-not-found':
    //                     errorMessage = 'No account found with this email address.';
    //                     break;
    //                 case 'auth/wrong-password':
    //                     errorMessage = 'Incorrect password. Please try again.';
    //                     break;
    //                 case 'auth/invalid-email':
    //                     errorMessage = 'Invalid email address format.';
    //                     break;
    //                 case 'auth/user-disabled':
    //                     errorMessage = 'This account has been disabled. Please contact support.';
    //                     break;
    //                 case 'auth/too-many-requests':
    //                     errorMessage = 'Too many unsuccessful login attempts. Please try again later.';
    //                     break;
    //                 case 'auth/invalid-credential':
    //                     errorMessage = 'Invalid Sign In credentials provided. Please try again.';
    //                     break;
    //                 case 'auth/network-request-failed':
    //                     errorMessage = 'Network error. Please check your internet connection and try again.';
    //                     break;
    //                 default:
    //                     errorMessage = 'An error occurred during sign in. Please try again.';
    //             }
    //             this.errorService.handleError(errorMessage);

    //             // Optionally, you can log the error details for debugging (not visible to users)
    //             // if (!environment.production) {
    //             //     console.error('Firebase Auth Error:', error.code, error.message);
    //             // }
    //         });
    // }

    sendVerificationMail() {
        const user = this.auth.currentUser;
        if (user) {
            return sendEmailVerification(user)
                .then(() => {
                    this.router.navigate(['/sessions/verify-email']);
                })
                .catch((error) => {
                    this.errorService.handleError('Failed to send verification email');
                });
        } else {
            this.errorService.handleError('No user is currently signed in.');
            return Promise.reject('No user is currently signed in.');
        }
    }

    sendPasswordResetEmail(email: string) {
        return sendPasswordResetEmail(this.auth, email)
            .then(() => {
                // Optionally, notify the user that the email was sent
            })
            .catch((error) => {
                this.errorService.handleError('Failed to send password reset email');
            });
    }

    signUpWithEmailAndPassword(email: string, password: string): Observable<{ user: User }> {
        return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
            map((result) => ({ user: result.user })),
            catchError((error) => {
                this.errorService.handleError('SignUp error: ' + error.message);
                return throwError(() => new Error('SignUp failed'));
            })
        );
    }

    signOut() {
        return this.auth
            .signOut()
            .then(() => {
                this.handleSignOut();
            })
            .catch((error) => {
                this.errorService.handleError('SignOut error');
            });
    }

    private handleSignOut() {
        this.currentUser = null;
        this.router.navigate(['sessions/signin']);
    }

    setRedirectPath(path: string) {
        this.redirectPath = path;
    }

    getRedirectPath(): string {
        return this.redirectPath || '/dashboard';
    }

    ngOnDestroy() {
        this.subscriptions.forEach((s) => s.unsubscribe());
    }
}
