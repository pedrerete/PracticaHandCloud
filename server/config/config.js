process.env.PORT = process.env.PORT || 3000
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = "mongodb://localhost:27017/InventarioEsparza"
}else {
    urlDB = "mongodb://localhost:27017/InventarioEsparza"
}

process.env.URLDB = urlDB;

process.env.SEED = process.env.SEED ||'firma-secreta'
process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || '8h'