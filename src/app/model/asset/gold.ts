import { Asset } from './asset';
import { GoldAssetSubTypeUtils } from '../enum/asset/gold-sub-type.enum';
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class Gold extends Asset {

    constructor() {
        super()
        this.kind = String(AssetType.Gold)
    }

    subTypesOptions(){
        return GoldAssetSubTypeUtils.getAllAssetSubType()
    }
}