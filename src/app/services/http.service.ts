import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, Request, RequestMethod, URLSearchParams } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import { KeychainService } from './keychain.service';

@Injectable()
export class HttpService {

    constructor(private http: Http, private router: Router, private keychainService: KeychainService) { }

    async request(method: RequestMethod, path: String, body: any, responseType = null) {

        try {

            const headers = new Headers();
            const token = this.keychainService.token
            if (token) {
                headers.append('Authorization', token);
            }

            const url: string = environment.apiUrl + path;
            const request = new Request({
                url: url,
                method: method,
                headers: headers,
                body: body,
                responseType: responseType
            })

            const response = await this.http.request(request).toPromise()

            if (response.headers.get("content-type") != "application/json; charset=utf-8") {
                return response
            } else {
                return response.json();
            }

        } catch (error) {

            try {

                const token = this.keychainService.token;
                if (token) {
                    if (error.status === 401) {
                        this.keychainService.clear()
                        this.router.navigate(["/login"])
                    }
                }
                const errorJson = error.json();
                if (errorJson.message) {
                    error.message = errorJson.message
                }
                return Promise.reject(error);
            } catch (e) {
                return Promise.reject(Error('Something went wrong. Please try again.'));
            }

        }
    }
}
