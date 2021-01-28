
const Joi = require('joi');

module.exports = Joi.object().keys({
  imports: Joi.object().keys({
    langs: Joi.alternatives().try(
      Joi.string().regex(/^[a-z]{2}$/),
      Joi.array().items(Joi.string().regex(/^[a-z]{2}$/)).min(1),
      Joi.object().keys({
        keep: Joi.alternatives().try(
          Joi.string().regex(/^[a-z]{2}$/),
          Joi.array().items(Joi.string().regex(/^[a-z]{2}$/)).min(1)
        ),
        default: Joi.string().regex(/^[a-z]{2}$/)
      })
    )
  }).unknown(true)
}).unknown(true);
