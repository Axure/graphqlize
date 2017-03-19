import {Model, Field, getRegisteredProperties} from '../../src';

@Model
export class Person {

  @Field
  idd: string;

  @Field
  spouse: Person;

  @Field
  man: number;

  @Field
  static dude: Person;

  @Field
  method() {

  }
}
