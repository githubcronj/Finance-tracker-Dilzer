export enum RelationshipType {
    Spouse = 0,
    Son = 1,
    Daughter = 2,
    Mother = 3,
    Father = 4,
    FatherInLaw = 5,
    MotherInLaw = 6
}

export class RelationshipTypeUtils {
    public static getRelationshipTypeText(assests) {
        switch (assests) {
            case RelationshipType.Spouse: return 'Spouse';
            case RelationshipType.Son: return 'Son';
            case RelationshipType.Daughter: return 'Daughter';
            case RelationshipType.Mother: return 'Mother';
            case RelationshipType.Father: return 'Father';
            case RelationshipType.FatherInLaw: return 'Father In Law';
            case RelationshipType.MotherInLaw: return 'Mother In Law';
        }
    }

    public static getAllRelationshipTypes() {
        const options = [
            {
                key: RelationshipType.Spouse,
                value: this.getRelationshipTypeText(RelationshipType.Spouse)
            },
            {
                key: RelationshipType.Son,
                value: this.getRelationshipTypeText(RelationshipType.Son)
            },
            {
                key: RelationshipType.Daughter,
                value: this.getRelationshipTypeText(RelationshipType.Daughter)
            },
            {
                key: RelationshipType.Mother,
                value: this.getRelationshipTypeText(RelationshipType.Mother)
            },
            {
                key: RelationshipType.Father,
                value: this.getRelationshipTypeText(RelationshipType.Father)
            },
            {
                key: RelationshipType.FatherInLaw,
                value: this.getRelationshipTypeText(RelationshipType.FatherInLaw)
            },
            {
                key: RelationshipType.MotherInLaw,
                value: this.getRelationshipTypeText(RelationshipType.MotherInLaw)
            }
        ];
        return options;
    }
}