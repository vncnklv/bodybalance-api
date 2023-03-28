const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Database connected!");
}