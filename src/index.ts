import * as util from 'util';
import 'reflect-metadata';
import GlobalSequelize = require("sequelize");
import Sequelize = GlobalSequelize.Sequelize;
import DataTypes = GlobalSequelize.DataTypes;
import DataTypeAbstract = GlobalSequelize.DataTypeAbstract;
import sequelize = require("sequelize");


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
  console.log('===Property Decorator===');
  const properties = ClassProperties.get(target);

  Reflect.defineMetadata(propertyKey, Reflect.getMetadata("design:type", target, propertyKey), target, propertyKey);
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
  console.log('`keys` are', keys);
  console.log('===Ends Property Decorator===\n');
};

/**
 *
 * @param target
 * @returns {any}
 */
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
 *  An interface of the class constructor
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
 * @tparm R The class
 * @tparm T The class prototype
 * @param target
 * @returns {GraphqlizeModelConstructor<T>&R}
 * @constructor
 */
export const Model = <R, T>(target: ClassConstructor<T> & R): GraphqlizeModelConstructor<T> & R => {
  console.log('===Model Decorator===');
  console.log('Decorating', target, 'with Model');
  // Reflect.defineMetadata('haha', 'hehe', target);
  ModelRepository.set(target, 1);
  const result = target as any as (GraphqlizeModelConstructor<T> & R);
  result.prototype.persist = () => {
    // do something.
    console.info('I\'m doing it');
  };
  console.log('===End Model Decorator===\n');
  return result;
};

export class Repository {

  modelRepository: Map<any, any>;
  classProperties: Map<any, any>;
  sequelize: Sequelize;

  /**
   *
   */
  constructor(sequelizeInstance: Sequelize) {
    this.sequelize = sequelizeInstance;
    this.modelRepository = ModelRepository;
    this.classProperties = ClassProperties;

    for (const [clazz, nothing] of this.modelRepository.entries()) {
      console.log('kv in repo:', clazz, nothing);
      console.log(this.getDecoratedFields(clazz));
      console.log(this.getPrototypeDecoratedFields(clazz));
      const Options: {
        [key: string]: DataTypeAbstract
      } = {

      };
      this.getPrototypeDecoratedFields(clazz).forEach((propertyKey) => {
        const type = Reflect.getMetadata("design:type", clazz.prototype, propertyKey);
        console.log('type of key', propertyKey, 'is', type);
        Options[propertyKey] = GlobalSequelize.STRING;
      });

      /* Create the models */
      const name = clazz.prototype.constructor.name;
      console.log('name is', name);
      console.log('options are', Options);
      const model = this.sequelize.define(name, Options);
      this.sequelize.sync();
    }

  }

  /**
   * Get decorated static fields (Property of the constructor) within a class.
   * @param clazz
   * @returns {any}
   */
  private getDecoratedFields<T>(clazz: ClassConstructor<T>) {
    const properties = this.classProperties.get(clazz);
    return properties;
  }

  /**
   * Get decorated fields (Property of the prototype of the constructor) within a class.
   * @param clazz
   * @returns {any}
   */
  private getPrototypeDecoratedFields<T>(clazz: ClassConstructor<T>): Array<string> {
    const properties = this.classProperties.get(clazz.prototype);
    return properties;
  }
}