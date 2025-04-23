require('dotenv').config();

function validateMongoURI(uri) {
    if (!uri) {
        console.error('❌ Error: MONGO_URI is not defined');
        return false;
    }

    const mongoURIPattern = /^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)(\?.*)?$/;
    const match = uri.match(mongoURIPattern);

    if (!match) {
        console.error('❌ Error: Invalid MongoDB URI format');
        console.log('\nExpected format:');
        console.log('mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database?retryWrites=true&w=majority');
        console.log('\nMake sure:');
        console.log('1. You\'re using mongodb+srv:// (not mongodb://)');
        console.log('2. Username and password are properly encoded');
        console.log('3. Database name is specified after the hostname');
        return false;
    }

    const [, username, password, host, database] = match;

    console.log('\n✅ MongoDB URI Format Validation:');
    console.log('- Protocol: mongodb+srv://');
    console.log(`- Username: ${username}`);
    console.log(`- Password: ${'*'.repeat(password.length)}`);
    console.log(`- Host: ${host}`);
    console.log(`- Database: ${database}`);
    
    return true;
}

const uri = process.env.MONGO_URI;
console.log('Validating MongoDB URI...');
validateMongoURI(uri);
