export enum ClientType {
    Individual = 0,
    Company = 1,
    Trust = 2,
    Association = 3,
}

export class ClientTypeUtils {
    public static getClientTypeText(assests) {
        switch (assests) {
            case ClientType.Individual: return 'Individual';
            case ClientType.Company: return 'Company';
            case ClientType.Trust: return 'Trust';
            case ClientType.Association: return 'Association';
        }
    }

    public static getAllClientType() {
        const options = [
            {
                key: ClientType.Individual,
                value: this.getClientTypeText(ClientType.Individual)
            },
            {
                key: ClientType.Company,
                value: this.getClientTypeText(ClientType.Company)
            },
            {
                key: ClientType.Trust,
                value: this.getClientTypeText(ClientType.Trust)
            },
            {
                key: ClientType.Association,
                value: this.getClientTypeText(ClientType.Association)
            }
        ];
        return options;
    }
}
