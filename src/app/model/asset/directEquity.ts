import { Asset } from './asset';
import { DirectEquityAssetSubTypeUtils } from '../enum/asset/directequity-sub-type.enum';
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class DirectEquity extends Asset {

    constructor() {
        super()
        this.kind = String(AssetType.DirectEquity)
    }
    
    subTypesOptions(){
        return DirectEquityAssetSubTypeUtils.getAllAssetSubType()
    }

}