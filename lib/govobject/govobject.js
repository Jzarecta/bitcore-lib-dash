'use strict';

var _ = require('lodash');
var $ = require('../util/preconditions');
var buffer = require('buffer');
var compare = Buffer.compare || require('buffer-compare');

var errors = require('../errors');
var BufferUtil = require('../util/buffer');
var JSUtil = require('../util/js');
var BufferReader = require('../encoding/bufferreader');
var BufferWriter = require('../encoding/bufferwriter');

/**
 * Represents a generic Governance Object
 *
 * @param serialized
 * @returns {*}
 * @constructor
 */
function GovObject(serialized) {
    if (!(this instanceof GovObject)) {
        return new GovObject(serialized);
    }

    if (serialized) {
        if (serialized instanceof GovObject) {
            return GovObject.shallowCopy(serialized);
        } else if (JSUtil.isHexa(serialized)) {
            this.fromString(serialized);
        } else if (BufferUtil.isBuffer(serialized)) {
            this.fromBuffer(serialized);
        } else if (_.isObject(serialized)) {
            this.fromObject(serialized);
        } else {
            throw new errors.InvalidArgument('Must provide an object or string to deserialize a transaction');
        }
    } else {
        this._newGovObject();
    }
}

/**
 * dataHex will output GovObject 'data-hex' value, should be overriden by specific object type
 *
 */
GovObject.prototype.dataHex = function() {

    return null;
};

/**
 * GovObject instantiation method, should be overriden by specific GovObject type
 *
 * @private
 */
GovObject.prototype._newGovObject = function() {

    return null;
};

/**
 * GovObject instantation method from JSON object, should be overridden by specific GovObject type
 *
 * @param arg
 */
GovObject.prototype.fromObject = function fromObject(arg) {

};

/**
 * GovObject instantiation method from hex string
 *
 * @param string
 */
GovObject.prototype.fromString = function(string) {
    this.fromBuffer(new buffer.Buffer(string, 'hex'));
};

/**
 * Retrieve a hexa string that can be used with dashd's CLI interface
 * (decoderawtransaction, sendrawtransaction)
 *
 * @param {Object} opts allows to skip certain tests. {@see Transaction#serialize}
 * @return {string}
 */
GovObject.prototype.checkedSerialize = function(opts) {
    var serializationError = this.getSerializationError(opts);
    if (serializationError) {
        serializationError.message += ' Use uncheckedSerialize if you wish to skip security checks.';
        throw serializationError;
    }
    return this.uncheckedSerialize();
};

GovObject.prototype.serialize = function(unsafe) {
    if (true === unsafe || unsafe && unsafe.disableAll) {
        return this.uncheckedSerialize();
    } else {
        return this.checkedSerialize(unsafe);
    }
};

GovObject.prototype.uncheckedSerialize = GovObject.prototype.toString = function() {
    return this.toBuffer().toString('hex');
};

GovObject.prototype.inspect = function() {
    return '<GovObject: ' + this.uncheckedSerialize() + '>';
};

GovObject.prototype.toBuffer = function() {
    var writer = new BufferWriter();
    return this.toBufferWriter(writer).toBuffer();
};

GovObject.prototype.toBufferWriter = function(writer) {
    console.log(this.dataHex());
    writer.write(new Buffer(this.dataHex()));
    return writer;
};

GovObject.prototype.fromBuffer = function(buffer) {
    var reader = new BufferReader(buffer);
    return this.fromBufferReader(reader);
};

GovObject.prototype.fromBufferReader = function(reader) {
    $.checkArgument(!reader.finished(), 'No data received');
    this.data = reader.read();
    return this;
};

GovObject.shallowCopy = function(GovObject) {
    var copy = new GovObject(GovObject.toBuffer());
    return copy;
};

GovObject.prototype._toASCII = function(string) {
    var escapable = /[\\\"\x00-\x1f\x7f-\uffff]/g,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };

    escapable.lastIndex = 0;
    return escapable.test(string) ?
    '"' + string.replace(escapable, function (a) {
        var c = meta[a];
        return typeof c === 'string' ? c :
        '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' :
    '"' + string + '"';
};


module.exports = GovObject;
