const { app } = require('@azure/functions');
require('./functions/updateAndNotify');


app.setup({
    enableHttpStream: true,
});
