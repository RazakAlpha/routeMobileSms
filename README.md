
# RouteMobileSms

RouteMobilleSms is a light weight module for sending sms and checking account balance using 
route mobile's api. It's nodejs wrapper for Route Mobile Bulk Http API Specification.
You will need an official account inorder to use this.





# Installation
```javascript
npm install routemoiblesms --save
```
## Usage/Examples

```javascript
import {routeSms} from 'routeMobileSms'

// INITIALISE 
const conf = {
    host:'rslr.connectbind.com', 
    username:'nety-dntc', 
    password: '@Alpha12', 
    protocol: 'http', 
    port: 8080
    }
const smsEngine = new routeSms(conf);
smsEngine.sendSync({...})
smsEngine.sendAsync({...}).then(...).catch(...);



// SETTING CONFIGURATION GLOBALLY
smsEngine.conf = {type: 0, dlr: 0, source: 'Sender', url: ''}

// SYNCHRONOUSE MESSAGING
smsEngine.sendSync({From: 'Sender', To: 'destination' | ['destinations'], Content: 'message here'});

// SENDING WITH CONFIG
smsEngine.sendSync({From: 'Sender', To: 'destination' | ['destinations'], Content: 'message here', 
                    conf: {type: number, dlr: number, url: string}
});

// ASYNCHRONOUSE MESSAGING
await smsEngine.sendAsync({From: 'Sender', To: 'destination' | ['destinations'], Content: 'message here'})
.then(response=> {
    // Handle response here
      console.log(response)
    //[{status:'successful|Failed', code:'errocode', message:'status details', destination:'233241865786', id: 'messageId'}]
    }).catch(err => {
      console.log(err)
    });
;

// SENDING WITH CONFIG
await smsEngine.sendAsync({From: 'Sender', To: 'destination' | ['destinations'], Content: 'message here', 
                    conf: {type: number, dlr: number, url: string}
}).then(response=> {
    // Handle response here
      console.log(response)
    //[{status:'successful|Failed', code:'errocode', message:'status details', destination:'233241865786', id: 'messageId'}]
    }).catch(err => {
      console.log(err)
    });



```


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Authors

- [@RazakAlpha](https://www.github.com/RazakAlpha)

