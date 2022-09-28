const service = require('../../../service/setting/user.service');
const userTransformer = require('../../transformer/setting/user.transformer');

const log4js = require('../../../../config/log4js');
const log = log4js.getLogger('user.controller.js');

/**
 * Display a listing of the resource
 *
 * @param {*} req
 * @param {Object} res
 */
exports.getAll = async (req, res) => {
  const { page, size, query, status } = req.query;
  service
    .getAll(page, size, query, status)
    .then((doc) => res.send(doc))
    .catch((err) => catchError(res, err, log));
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.create = async (req, res) =>{
const countByEmail = await service.count( 'email', req.body.email)
        .then((count) => { return count; })
        .catch(() => { return null; })

    if (countByEmail && countByEmail != 0) {
        res.status(500).send({ status: 500, error: {name: 'E-mail already exists.'}})
        return;
    }
  service
    .create(req.body)
    .then(async (doc) => response.successWithData(res, new userTransformer(doc)))
    .catch((err) => catchError(res, err, log));
  }
/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.show = async (req, res) =>
  service
    .show(req.params.id)
    .then((doc) => response.successWithData(res, new userTransformer(doc)))
    .catch((err) => catchError(res, err, log));

/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.edit = async (req, res) => {
  const findByEmail = await service.find( 'email', req.body.email)
        .then((doc) => { return doc; })
        .catch(() => { return null; })

    if ((findByEmail != null ) && (findByEmail ? findByEmail.id  != parseInt(req.params.id) : null)) {
        res.status(500).send({ status: 500, error: {name: 'E-mail already exists.'}})
        return;
    }
  service
    .update(req.params.id, req.body)
    .then((doc) => response.successWithBoolean(res, doc))
    .catch((err) => catchError(res, err, log));
};
/**
 *  Remove the specified resource from storage.
 *
 * @param {id} req
 * @param {String} res
 */
exports.delete = async (req, res) =>
  service
    .delete(req.params.id)
    .then((doc) => response.successWithBoolean(res, doc))
    .catch((err) => catchError(res, err, log));

/**
 *
 * @param {query} req
 * @param {object} res
 */
exports.search = async (req, res) => {
  service
    .search(req.query.query, req.query.except, req.query.status)
    .then((data) => response.successWithData(res, data))
    .catch((err) => catchError(res, err, log));
};
