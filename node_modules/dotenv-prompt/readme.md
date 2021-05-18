# dotenv-prompt

Read envs from console input and save to .env file.

## Usage

```
var dotenv = require('dotenv-prompt');
dotenv.create(['PORT', 'HOST'], function(error) {
  
});
```

## API

### create(data, options, callback)

Prompt envs and save to .env file.

### get(data, options, callback)

Prompt envs.

### save(data)

Save envs to .env file.
