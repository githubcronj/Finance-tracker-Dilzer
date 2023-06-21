import { Injectable } from '@angular/core';

@Injectable()
export class ResourcesService {

    assetPath = "assets/";
    logo = this.assetPath + "logo.png";
    headerLogo = this.assetPath + "header-logo.png";
    userIcon = this.assetPath + "user-icon.png";
    invitePlannerIcon = this.assetPath + "add.png";
    addIcon = this.assetPath + "add-icon.png";
    editIcon = this.assetPath + "edit-icon.png";
    deleteIcon = this.assetPath + "delete-icon.png";
    downloadIcon = this.assetPath + "download.png";
    attachmentIcon = this.assetPath + "attachment.png";
    saveIcon = this.assetPath + "save-icon.png";
    cancelIcon = this.assetPath + "cancel-icon.png";
    infoIcon = this.assetPath + "info.png";
    assetIconPath = this.assetPath + "asset-icons/";
    liabilityIconPath = this.assetPath + "liability-icons/";
    goalIconPath = this.assetPath + "goals-icon/";
    incomeIconPath = this.assetPath + "income-icons/";
    expenseIconPath = this.assetPath + "expense-icons/";

}
