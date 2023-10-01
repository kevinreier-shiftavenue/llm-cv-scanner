import {Router, Request, Response} from 'express'
const router = Router();

/* GET root page. */
router.get('/', function(req, res, next) {
  res.send('LLM CV Evaluation Backend')
});

export default router;
