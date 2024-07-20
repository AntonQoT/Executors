import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { AuthService } from '../auth.service';
import { MyProfileService } from '../../my-profile/my-profile.service';

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [
        RouterLink,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        NgIf,
    ],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
    // isToggled
    isToggled = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public themeService: CustomizerSettingsService,
        private authService: AuthService,
        private myProfileService: MyProfileService
    ) {
        this.authForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
        this.themeService.isToggled$.subscribe((isToggled) => {
            this.isToggled = isToggled;
        });
    }

    // Password Hide
    hide = true;

    // Form
    authForm: FormGroup;
    async onSubmit() {
        if (this.authForm.valid) {
            try {
                const { name, email, password } = this.authForm.value;
                const result = await this.authService.signUpWithEmailAndPassword(email, password).toPromise();

                if (result?.user) {
                    await this.myProfileService.createMyProfile(result.user.uid, {
                        myID: result.user.uid,
                        isActive: true,
                        isSuspended: false,
                        firstName: name,
                        lastName: '',
                        mpNumber: '',
                        photoURL: '',
                        cvUrl: '',
                        certificationUrl: '',
                        gender: '',
                        email: email,
                        country: '',
                        initials: '',
                        language: '',
                        physicalAddress1: '',
                        physicalAddress2: '',
                        physicalSuburb: '',
                        physicalAddressCode: '',
                        regionName: '',
                        hcpType: 'intern', // Or 'practice', depending on your requirements
                        discipline: '',
                        subRegionName: '',
                        cellNumber: '',
                        phoneNumber: '',
                        title: '',
                        town: '',
                        market: '',
                        governmentOfficial: '',
                        healthCareProfessional: true,
                        agreetoTermsOfUse: false,
                        acceptConcent: false,
                        acceptPrivacy: false,
                        acceptPopi: false,
                        role: 'intern',
                        isVerified: false,
                    });

                    await this.authService.sendVerificationMail();

                    this.router.navigate(['authentication/verify-email']);
                }
            } catch (error) {
                console.error('SignUp failed', error);
                // Handle error (e.g., display error message to user)
            }
        } else {
            console.log('Form is invalid. Please check the fields.');
        }
    }

    // Dark Mode
    toggleTheme() {
        this.themeService.toggleTheme();
    }

    // Card Border
    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    // RTL Mode
    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }
}
