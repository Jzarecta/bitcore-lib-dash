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
        payment_address: this.payment_address,
        payment_amount: this.payment_amount,
        proposal_name: this._toASCII(this.proposal_name),
        start_epoch: this.start_epoch,
        type: this.type,
        url: this.url
    };

    return '[["'+this._govOp+'", '+JSON.stringify(_govObj)+']]';
};

Proposal.prototype._newGovObject = function() {
    this.end_epoch = "";
    this.payment_address = "";
    this.payment_amount = "";
    this.proposal_name = "";
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
