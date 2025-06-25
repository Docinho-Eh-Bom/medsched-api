/**
 * @openapi
 * components:
 *   schemas:
 *     AdminRegister:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - role
 *       properties:
 *         firstName:
 *           type: string
 *           example: "Admin"
 *         lastName:
 *           type: string
 *           example: "teste"
 *         email:
 *           type: string
 *           format: email
 *           example: "admin@email.com"
 *         password:
 *           type: string
 *           example: "12345+A"
 *         role:
 *           type: string
 *           enum: [admin]
 *
 *     MedicRegister:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - role
 *         - medicData
 *       properties:
 *         firstName:
 *           type: string
 *           example: "Medico"
 *         lastName:
 *           type: string
 *           example: "Teste"
 *         email:
 *           type: string
 *           format: email
 *           example: "medico@email.com"
 *         password:
 *           type: string
 *           example: "12345+A"
 *         role:
 *           type: string
 *           enum: [medic]
 *         medicData:
 *           type: object
 *           required:
 *             - speciality
 *             - crm
 *           properties:
 *             speciality:
 *               type: string
 *               example: "Psiquiatria"
 *             crm:
 *               type: string
 *               example: "987654-57/RS"
 *
 *     PatientRegister:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - role
 *         - patientData
 *       properties:
 *         firstName:
 *           type: string
 *           example: "Paciente"
 *         lastName:
 *           type: string
 *           example: "Teste"
 *         email:
 *           type: string
 *           format: email
 *           example: "pacientex@email.com"
 *         password:
 *           type: string
 *           example: "12345+A"
 *         role:
 *           type: string
 *           enum: [patient]
 *         patientData:
 *           type: object
 *           required:
 *             - cpf
 *             - cellphone
 *             - birthDate
 *           properties:
 *             cpf:
 *               type: string
 *               example: "001.002.003-04"
 *             cellphone:
 *               type: string
 *               example: "51-1324-5678"
 *             birthDate:
 *               type: string
 *               format: date
 *               example: "2003-10-16"
 */
