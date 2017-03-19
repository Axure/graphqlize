import {Repository} from '../../src/index';
import './model'; // This is important. Otherwise useless import would be removed.

import * as Sequelize from 'sequelize';
const sequelize = new Sequelize('sequelize_test', 'sequelize', 'test');

const repository = new Repository(sequelize);



