require('./config/config');
require('colors');
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }))

app.use('/api', require('./routes/index'))

app.listen(process.env.PORT, () => {
    console.log('[NODE]'.green, 'esta corriendo en el puerto:'.red, (process.env.PORT).yellow);
})
