import Router from 'express';

const router = Router();

router.get('/', (req, res) => {
  return res.json({ message: 'Hello, world!' });
})

router.post('/', (req, res) => {
  const { name } = req.body;
  return res.json({ message: `Hello, ${name}!` });
})

export default router;