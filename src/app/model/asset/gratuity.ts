import { Asset } from './asset';
import { GratuityAssetSubTypeUtils } from '../enum/asset/gratuity-sub-type.enum';
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class Gratuity extends Asset {

    constructor() {
        super()
        this.kind = String(AssetType.Gratuity)
    }

    subTypesOptions(){
        return GratuityAssetSubTypeUtils.getAllAssetSubType()
    }
}