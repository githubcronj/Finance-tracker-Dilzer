import { Injectable } from '@angular/core';

@Injectable()
export class ValidationService {

    public mobilePattern = new RegExp(/^[0-9]{10,10}$/);
    public emailPattern = new RegExp(/^[a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/)
    public passwordPattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/);
    public panCardPattern = new RegExp(/^[A-Za-z]{5}\d{4}[A-Za-z]{1}/);

}
