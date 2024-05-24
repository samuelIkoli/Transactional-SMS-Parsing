import express from 'express'
const router = express.Router()

import { parse_message } from '../controllers/parse'
import { parse } from 'path'

router.post('/parse', parse_message)

module.exports = router