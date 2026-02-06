// MongoDB initialization script
db = db.getSiblingDB('furniture_crm');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'email', 'password', 'fullName', 'role'],
      properties: {
        username: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 30
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        role: {
          enum: ['admin', 'operator', 'collector', 'auditor']
        }
      }
    }
  }
});

db.createCollection('customers');
db.createCollection('guarantors');
db.createCollection('contracts');
db.createCollection('payments');
db.createCollection('notifications');
db.createCollection('auditlogs');

// Create indexes for better performance
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

db.customers.createIndex({ phone: 1 }, { unique: true });
db.customers.createIndex({ passport: 1 }, { unique: true });
db.customers.createIndex({ pinfl: 1 }, { unique: true });
db.customers.createIndex({ fullName: 'text' });

db.guarantors.createIndex({ phone: 1 });
db.guarantors.createIndex({ passport: 1 }, { unique: true });
db.guarantors.createIndex({ fullName: 'text' });

db.contracts.createIndex({ contractNumber: 1 }, { unique: true });
db.contracts.createIndex({ customer: 1 });
db.contracts.createIndex({ guarantor: 1 });
db.contracts.createIndex({ status: 1 });
db.contracts.createIndex({ 'financial.nextPaymentDate': 1 });

db.payments.createIndex({ contract: 1 });
db.payments.createIndex({ paymentDate: 1 });
db.payments.createIndex({ status: 1 });

db.notifications.createIndex({ recipient: 1 });
db.notifications.createIndex({ scheduledDate: 1 });
db.notifications.createIndex({ status: 1 });

db.auditlogs.createIndex({ user: 1 });
db.auditlogs.createIndex({ timestamp: 1 });
db.auditlogs.createIndex({ resourceType: 1 });

print('Database initialized successfully!');