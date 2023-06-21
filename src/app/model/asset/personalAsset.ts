import { Asset } from './asset';
import { PersonalAssetSubtypeTypeUtils } from '../enum/asset/personal-sub-type.enum';
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";


@JsonObject
export class PersonalAsset extends Asset {

    constructor() {
        super()
        this.kind = String(AssetType.PersonalAssets)
    }

    subTypesOptions(){
        return PersonalAssetSubtypeTypeUtils.getAllAssetSubType()
    }
}