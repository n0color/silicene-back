import buildApp from './index.js';
import { config } from 'dotenv';

config();

const PORT = process.env.PORT || 3000;
const app = buildApp();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
