export class MaterialDialogPaddingRemover {

    constructor() { }


    didRemovePaddingForMaterialDialog() {
        const containerHolder = <HTMLElement>document.querySelector('.mat-dialog-container');
        containerHolder.style.cssText = 'padding: 0px !important';
        return containerHolder;
    }

}