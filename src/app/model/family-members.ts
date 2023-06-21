import { Name } from './value-objects/name';
import { RelationshipType, RelationshipTypeUtils } from './enum/relationship_type.enum';
import { JsonObject, JsonProperty } from './parsers/json-convert-decorators';
import { DatePipe } from '@angular/common';
import { HealthHistory } from './value-objects/healthHistory';

@JsonObject
export class FamilyMembers {

    @JsonProperty('_id', String) _id: string = undefined;
    @JsonProperty('name', Name) name: Name = new Name();
    @JsonProperty('relationship', Number) relationship: number = undefined;
    @JsonProperty('dob', Date) dob: Date = undefined;
    @JsonProperty('healthHistory', HealthHistory) healthHistory: HealthHistory = new HealthHistory();
    @JsonProperty('lifeExpectancy', Number) lifeExpectancy: number = undefined;
    

    displayRelationShip() {
        return RelationshipTypeUtils.getRelationshipTypeText(this.relationship);
    }

    displayDOB() {
        if (this.dob != null) {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(this.dob, 'dd/MM/yyyy');
        }
    }
}
