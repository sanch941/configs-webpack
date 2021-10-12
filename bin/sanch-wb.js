#!/usr/bin/env node
require('dotenv').config();

const arg = require('arg');
const { cli } = require('../src/cli');

const parseArguments = (rawArgs) => {
    try {
        const args = arg(
            {
                '--gendll': Boolean,
                '-g': '--gendll'
            },
            {
                argv: rawArgs.slice(2)
            }
        );
        return {
            gendll: args['--gendll'] || false
        };
    } catch (err) {
        err.message && console.log(err.message);
    }
};

const options = parseArguments(process.argv);
cli(options);
