const db = require("../models")
const Patient = db.Patient

const patientController = {}

patientController.findAll = async(req) => {
  return await Patient.findAll()
}

patientController.create = async(req) => {
  const {firstName, lastName, phone, email, age, height, heightUom, weight, weightUom} = req.body
  try {
    patient = await Patient.create({
      firstName: firstName,
      phone: phone,
      lastName: lastName,
      email: email,
      age: age,
      height: height,
      heightUom: heightUom,
      weight: weight,
      weightUom: weightUom
    })
    return {success: true, patient: patient}
  }
  catch(err) {
    console.log(err)
    return {success: false, error: 'ERR_INTERNAL_SERVER'}
  }
}

module.exports=patientController
