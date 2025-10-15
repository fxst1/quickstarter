import { BasicDictConfigProvider } from "../BaseDictConfigProvider";
import { env } from 'node:process'

export class EnvConfigProvider extends BasicDictConfigProvider {
    constructor() {
        super(env);
    }
}