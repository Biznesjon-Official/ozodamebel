const mongoose = require('mongoose');

// MongoDB ga ulanish
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/furniture_credit', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function checkDatabase() {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('Database collections:');
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`- ${collection.name}: ${count} documents`);
    }
    
    // Contracts collection ni alohida tekshirish
    const contractsCount = await db.collection('contracts').countDocuments();
    console.log(`\nContracts collection: ${contractsCount} documents`);
    
    if (contractsCount > 0) {
      const contracts = await db.collection('contracts').find({}).limit(5).toArray();
      console.log('\nBirinchi 5 ta shartnoma:');
      contracts.forEach((contract, index) => {
        console.log(`${index + 1}. ID: ${contract._id}, Status: ${contract.status}`);
        if (contract.financial) {
          console.log(`   Monthly Payment: ${contract.financial.monthlyPayment}`);
        }
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Xatolik:', error);
    process.exit(1);
  }
}

checkDatabase();