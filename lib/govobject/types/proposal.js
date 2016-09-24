'use strict';

var GovObject = require('../govobject');
var errors = require('../../errors');
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
    this.network = "livenet";

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
    opts = opts || {};

    // check date format
    if(isNaN(this._verifyDateFormat(this.start_epoch))) {
        return new errors.GovObject.Proposal.invalidDate();
    }

    if(isNaN(this._verifyDateFormat(this.end_epoch))) {
        return new errors.GovObject.Proposal.invalidDate();
    }

    if (this.start_epoch >= this.end_epoch) {
        return new errors.GovObject.Proposal.invalidDateWindow();
    }

    var now = Math.round(new Date().getTime()/1000);
    if (this.end_epoch < now) {
        return new errors.GovObject.Proposal.invalidDateWindow();
    }

    // check address
    if (!this._verifyAddress(this.payment_address,this.network)) {
        return new errors.GovObject.Proposal.invalidAddress();
    }

    // check payment amount
    if (this._verifyPayment(this.payment_amount)) {
        return new errors.GovObject.Proposal.invalidPayment();
    }

    // check url
    if(!this._verifyUrl(this.url)) {
        return new errors.GovObject.Proposal.invalidUrl();
    }

    // check name
    if(!this._verifyName(this.name)) {
        return new errors.GovObject.Proposal.invalidName();
    }

};


module.exports = Proposal;
