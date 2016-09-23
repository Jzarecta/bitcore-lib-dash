'use strict';

var GovObject = require('../govobject');
var inherits = require('util').inherits;

/**
 * Represents 'proposal' Governance Object
 * 
 * @constructor
 */
function Proposal() {
    this._govOp = 'proposal';
    GovObject.call(this);
}

inherits(Proposal,GovObject);

Proposal.prototype.dataHex = function() {
    var _govObj = {
        end_epoch: this.end_epoch,
        name: this.name,
        payment_address: this.payment_address,
        payment_amount: this.payment_amount,
        start_epoch: this.start_epoch,
        type: this.type,
        url: this.url
    };


    // screwy data shims 'til we can fix this on dashd
    var inner = [this._govOp, _govObj];
    var outer = [ inner ];

    return JSON.stringify(outer);
};

Proposal.prototype._newGovObject = function() {
    this.end_epoch = "";
    this.name = "";
    this.payment_address = "";
    this.payment_amount = "";
    this.start_epoch = "";
    this.type = "";
    this.url = "";
};

Proposal.prototype.fromObject = function fromObject(arg) {

    // TODO

};

GovObject.prototype.getSerializationError = function(opts) {

    // TODO

};


module.exports = Proposal;
