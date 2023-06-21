export enum RecreationExpenseSubType {
    HealthClubFees = 0,
    Hobbies = 1,
    MoviesAndSportsEvents = 2,
    TravelAndVacation = 3,
    BooksAndMagazines = 4,
    Other = 5
}

export class RecreationExpenseSubTypeUtils {
    public static getRecreationExpenseSubTypeText(expense) {
        switch (expense) {
            case RecreationExpenseSubType.HealthClubFees: return 'Health Club Fees';
            case RecreationExpenseSubType.Hobbies: return 'Hobbies';
            case RecreationExpenseSubType.MoviesAndSportsEvents: return 'Movies and Sports Events';
            case RecreationExpenseSubType.TravelAndVacation: return 'Travel and Vacation';
            case RecreationExpenseSubType.BooksAndMagazines: return 'Books and Magazines';
            case RecreationExpenseSubType.Other: return 'Recreation and Entertainment Other';
        }
    }

    public static getAllRecreationExpenseSubType() {
        const options = [
            {
                key: RecreationExpenseSubType.HealthClubFees,
                value: this.getRecreationExpenseSubTypeText(RecreationExpenseSubType.HealthClubFees)
            },
            {
                key: RecreationExpenseSubType.Hobbies,
                value: this.getRecreationExpenseSubTypeText(RecreationExpenseSubType.Hobbies)
            },
            {
                key: RecreationExpenseSubType.MoviesAndSportsEvents,
                value: this.getRecreationExpenseSubTypeText(RecreationExpenseSubType.MoviesAndSportsEvents)
            },
            {
                key: RecreationExpenseSubType.TravelAndVacation,
                value: this.getRecreationExpenseSubTypeText(RecreationExpenseSubType.TravelAndVacation)
            },
            {
                key: RecreationExpenseSubType.BooksAndMagazines,
                value: this.getRecreationExpenseSubTypeText(RecreationExpenseSubType.BooksAndMagazines)
            },
            {
                key: RecreationExpenseSubType.Other,
                value: this.getRecreationExpenseSubTypeText(RecreationExpenseSubType.Other)
            }
        ];
        return options;
    }
}
