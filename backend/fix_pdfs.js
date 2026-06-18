const mongoose = require("mongoose");
const Startup = require("./src/models/Startup");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected to MongoDB.");
  const startups = await Startup.find({ pitchDeck: { $exists: true, $ne: "" } });
  
  let count = 0;
  for (let startup of startups) {
    if (!startup.pitchDeck.endsWith(".pdf")) {
      startup.pitchDeck = startup.pitchDeck + ".pdf";
      await startup.save();
      count++;
      console.log(`Updated startup: ${startup.title}`);
    }
  }
  
  console.log(`Successfully fixed ${count} old startups!`);
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
