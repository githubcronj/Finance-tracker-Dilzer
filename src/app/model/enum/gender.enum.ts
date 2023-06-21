
export enum Gender {
    Male = 0,
    Female = 1
}

export class GenderUtils {
    public static getGenderText(assests) {
        switch (assests) {
            case Gender.Male: return 'Male';
            case Gender.Female: return 'Female';

        }
    }

    public static getAllGender() {
        const options = [
            {
                key: Gender.Male,
                value: this.getGenderText(Gender.Male)
            },
            {
                key: Gender.Female,
                value: this.getGenderText(Gender.Female)
            }
        ];
        return options;
    }
}