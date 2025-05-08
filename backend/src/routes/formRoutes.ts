import express from 'express';
import { saveForm, testRoute, getSubmissions } from '../controllers/formController';

const router = express.Router();

router.get('/', testRoute);
router.post('/save-form', saveForm);
router.get('/submissions', getSubmissions);

export default router;
