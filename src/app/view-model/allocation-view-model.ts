import { Asset } from '../model/asset/asset';
import { Goal } from '../model/goal/goal';
import { Allocation } from '../model/goal/allocation';



export class AllocationViewModel {

    model: Allocation;

    constructor(model) {
        this.model = model;
    }

}
