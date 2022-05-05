process.env.PORT = process.env.PORT || 3000
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb+srv://Pedro1622:uoZZc4LqnOIECmwB@cluster0.rhaba.mongodb.net/PedroEsparzaDB?retryWrites=true&w=majority'
}else {
    urlDB = 'mongodb+srv://Pedro1622:uoZZc4LqnOIECmwB@cluster0.rhaba.mongodb.net/PedroEsparzaDB?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB;

process.env.SEED = process.env.SEED ||'firma-secreta'
process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || '8h'