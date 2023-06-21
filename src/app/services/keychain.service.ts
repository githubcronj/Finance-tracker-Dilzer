import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { UserType } from '../model/enum/user-type.enum';
import { User } from '../model/user';
import { Client } from '../model/client';
import { Admin } from '../model/admin';

@Injectable()
export class KeychainService {

  token: string
  userType: string
  userId: string

  jwtHelper = new JwtHelper()
  public loggedInUser: any

  constructor() {
    let token = localStorage.getItem('loggedInUserToken')
    if (token != undefined) {

      let payload = this.jwtHelper.decodeToken(token).payload
      this.userType = payload.userType
      this.token = token
      this.userId = payload.userId

    } else {
      this.clear()
    }
  }

  isLoggedIn() {

    if (this.token != undefined) {
      return true
    } else {
      return false
    }

  }


  isLoggedInAsClient() {

    if (this.token != undefined) {

      if (this.userType == String(UserType.Client)) {
        return true
      } else {
        return false
      }

    } else {
      return false
    }

  }

  isLoggedInAsAdmin() {

    if (this.token != undefined) {

      if (this.userType == String(UserType.Admin)) {
        return true
      } else {
        return false
      }

    } else {
      return false
    }

  }



  save(token: string) {

    if (token != undefined) {

      localStorage.setItem('loggedInUserToken', token)
      const payload = this.jwtHelper.decodeToken(token).payload
      this.userType = payload.userType
      this.token = token
      this.userId = payload.userId

    } else {
      this.clear()
    }
  }

  clear() {
    localStorage.removeItem('loggedInUserToken')
    this.token = undefined
    this.userType = undefined
    this.loggedInUser = null

  }


}