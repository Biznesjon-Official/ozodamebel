const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/furniture_crm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('✅ Connected to MongoDB');
  
  try {
    const Customer = require('./models/Customer');
    
    // Find customers with profile images
    const customers = await Customer.find({ 
      profileImages: { $exists: true, $ne: [] } 
    }).limit(5);
    
    console.log(`📊 Found ${customers.length} customers with images:`);
    
    customers.forEach((customer, index) => {
      console.log(`\n${index + 1}. Customer: ${customer.fullName}`);
      console.log(`   Phone: ${customer.phone}`);
      console.log(`   Profile Images:`, customer.profileImages);
    });
    
    if (customers.length === 0) {
      console.log('❌ No customers with profile images found');
    }
    
  } catch (error) {
    console.error('❌ Error checking customers:', error);
  }
  
  process.exit(0);
}).catch(error => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});
