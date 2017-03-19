import * as util from 'util';
import 'reflect-metadata';
import {isNullOrUndefined} from "util";
import 'es6-shim';

// export class Model {
//
// }

/**
 *
 */
class Graphqlize {
    constructor() { // TODO: dependency injection.

    }
}

const ClassProperties = new Map<ClassConstructor<any>, Array<string | symbol>>();

/**
 *
 * @param target
 * @param propertyKey
 * @constructor
 */
export const Field: PropertyDecorator = <T>(target: ClassConstructor<T>, propertyKey: string | symbol) => {
    const properties = ClassProperties.get(target);

    Reflect.defineMetadata(propertyKey, Reflect.getMetadata("design:type", target, propertyKey), target);
    console.log('registering', target, 'with key', propertyKey);

    if (properties) {
        properties.push(propertyKey);
        ClassProperties.set(target, properties);
    } else {
        ClassProperties.set(target, [propertyKey]);
    }

    const type = Reflect.getMetadata("design:type", target, propertyKey);
    console.info('`target` is', target);
    console.info('`propertyKey` is', propertyKey);
    console.info('`type` is', type);
    console.info('type of `type` is', typeof type);

    const keys = Reflect.getMetadataKeys(target);
    console.log('`keys` are', keys)
};

export function getRegisteredProperties(target: any): Array<string | symbol> | null {
    console.log('global storage is', ClassProperties);
    console.log('target is', target);
    const properties = ClassProperties.get(target);
    if (!properties) {
        return null;
    }
    return properties
}

export interface GraphqlizeModelInterface {
    persist(): void;
}

export interface GraphqlizeModelConstructor<T> {
    new(...args: any[]): GraphqlizeModelInterface & T;
}

/**
 *
 */
export interface ClassConstructor<T> extends Function {
    /**
     * Creates a new function.
     * @param args A list of arguments the function accepts.
     */
    new (...args: any[]): T;
    // (...args: any[]): T;
    readonly prototype: T; // TODO: understand this.
}

const ModelRepository = new Map<any, any>();

/**
 *
 * @param target
 * @returns {GraphqlizeModelConstructor<T>}
 * @constructor
 */
export const Model = <T>(target: ClassConstructor<T>): GraphqlizeModelConstructor<T> => {
    Reflect.defineMetadata('haha', 'hehe', target);
    ModelRepository.set(target, target);
    const result = target as any as (GraphqlizeModelConstructor<T>);
    result.prototype.persist = () => {
        // do something.
        console.info('I\'m doing it');
    };
    return result;
};
