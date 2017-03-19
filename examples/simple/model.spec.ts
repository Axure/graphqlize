import {Person} from './model';
import * as util from 'util';
import 'reflect-metadata';
import {Field, getRegisteredProperties, Model} from '../../src';

describe('The reflect metadata API we rely on', function () {
    it('should work fine', function () {
        expect(1).toBe(1);
    })
});

describe('The decorated class', function () {
    it('should work as expected', function () {
        console.info('typeof Person is', typeof Person);

        const NewPerson = Model(Person);

        const person = new NewPerson();
        person.persist();

        const names = Object.getOwnPropertyNames(Person);
        const protoNames = Object.getOwnPropertyNames(Person.prototype);

        console.info('inspect Person\'s property names', names);
        console.info('inspect Person.prototype\s property name', protoNames);

        console.log('inspect Person', util.inspect(Person));
        console.log('inspect Person.prototype', util.inspect(Person.prototype));


        const result1 = Reflect.getMetadataKeys(Person, "property");
        const result2 = Reflect.getMetadataKeys(Person, "method");
        const result3 = Reflect.getMetadataKeys(Person);

        const result10 = Reflect.getMetadataKeys(Person.prototype, "property");
        const result20 = Reflect.getMetadataKeys(Person.prototype, "method");
        const result205 = Reflect.getMetadataKeys(Person.prototype, "spouse");
        const result30 = Reflect.getMetadataKeys(Person.prototype);

        const result11 = getRegisteredProperties(Person.prototype);

        console.log('metadata keys for Person with key "property" are', util.inspect(result1));
        console.log('metadata keys for Person with key "method" are', util.inspect(result2));
        console.log('metadata keys for Person are', util.inspect(result3));

        console.log('metadata keys for Person.prototype with key "property" are', util.inspect(result10));
        console.log('metadata keys for Person.prototype with key "method" are', util.inspect(result20));
        console.log('metadata keys for Person.prototype with key "spouse" are', util.inspect(result205));
        console.log('metadata keys for Person.prototype are', util.inspect(result30));

        console.log(util.inspect(result11));

        console.log(util.inspect(Reflect));
        console.log(util.inspect(Reflect.decorate));

        console.log(util.inspect(Object.getOwnPropertyNames(Person)));
        console.log(util.inspect(Object.getOwnPropertyNames(Person.prototype)));


        const result101 = Reflect.getMetadata('design:type', Person.prototype, 'spouse');
        const result102 = Reflect.getMetadata(Field, Person.prototype, 'spouse');
        console.log('`Field` of spouse of Person.prototype is', result101);
        console.log('`Field` of spouse of Person.prototype is', result102);
        expect(1).toBe(1)
    })
});