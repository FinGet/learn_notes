import express from 'express';
import router from './router.js';

const app = express();

app.use(express.json());

app.use(router);

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`);
})
