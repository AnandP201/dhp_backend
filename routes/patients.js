const express = require('express')
const router = express.Router()
const patientController = require('../controllers/patient_controller')
const activityController = require('../controllers/activity_controller')
const auth = require('../middleware/auth')
const { body, validationResult } = require('express-validator')

/* Fetch all patients */
router.get('', auth, async (req, res, next)  => {
  const myRes = await patientController.findAll(req)
  if (myRes) {
    res.json(myRes)
  }
  else {
    res.status(500).json({errors: [{error: 'ERR_INTERNAL_SERVER'}]})
  }
})

/* Create a patient */
router.post('', auth, [
  body('firstName', 'ERR_FIRST_NAME_EMPTY').exists({checkNull: true, checkFalsy: true}),
  body('email', 'ERR_EMAIL_INVALID_OR_EMPTY').exists().isEmail(),
  body('phone').optional(),
  body('lastName', 'ERR_LAST_NAME_EMPTY').exists({checkNull: true, checkFalsy: true}),
  body('age', 'ERR_MISSING_AGE').exists({checkNull: true, checkFalsy: true}),
  body('height', 'ERR_MISSING_HEIGHT').exists({checkNull: true, checkFalsy: true}),
  body('heightUom', 'ERR_MISSING_HEIGHT_UOM').exists({checkNull: true, checkFalsy: true}),
  body('weight', 'ERR_MISSING_WEIGHT').exists({checkNull: true, checkFalsy: true}),
  body('weightUom', 'ERR_MISSING_WEIGHT_UOM').exists({checkNull: true, checkFalsy: true})
], async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const myRes = await patientController.create(req)
  if (myRes.success) {
    res.status(201).location(`/patients/${myRes.patient.id}`).end()
  }
  else {
    res.status(500).json({errors:[myRes.error]})
  }
})

module.exports = router
