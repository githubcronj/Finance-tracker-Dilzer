import { Injectable } from '@angular/core';

export class FormatterService {

    constructor() {

    }
    currencyFormatter(amount) {

        return amount.toLocaleString('en-IN')

    }
}
