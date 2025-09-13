import express from 'express';

const app = express();
const PORT = 5001; // Different port to avoid conflicts

app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ status: 'Test server is working!', time: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Test server running on http://localhost:${PORT}/test`);
  console.log('Press Ctrl+C to stop the server\n');
});
