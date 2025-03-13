const app = require("./src/app");  // Import the Express app
const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
