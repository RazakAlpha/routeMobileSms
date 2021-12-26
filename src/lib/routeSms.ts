import axios from "axios";
import { IConfig, IMessageResponse, IParam } from "../interfaces/param";

export class routeSms {
    private static params_:IParam = {protocol:'http', port: 8080, }
    private static config_: IConfig

    private static errorCodes: Map<number, string> = new Map()

    constructor(param?: IParam){

        if(param){
            routeSms.params_ = param;
            if (! routeSms.params_.path){
                routeSms.params_.path = '/bulksms/bulksms'
            }
    
            if(! routeSms.params_.host){
                throw new Error("Host is not defined");
                
            }
        }


        // set default config
        routeSms.config_ = {
            type: 0,
            dlr:0,
            source: 'sender',
        }

        // set the error codes
        routeSms.errorCodes.set(1701, 'Success, Message Submitted Successfully')
        routeSms.errorCodes.set(1702, 'Invalid URL');
        routeSms.errorCodes.set(1703, 'Invalid Username or password');
        routeSms.errorCodes.set(1704, 'Invalid type field');
        routeSms.errorCodes.set(1705, 'Invalid message');
        routeSms.errorCodes.set(1706, 'Invalid destination');
        routeSms.errorCodes.set(1707, 'Invalid source or sender');
        routeSms.errorCodes.set(1708, 'Invalid value for dlr field');
        routeSms.errorCodes.set(1709, 'User validation field');
        routeSms.errorCodes.set(1710, 'Internal Error');
        routeSms.errorCodes.set(1715, 'Response timeout');
        routeSms.errorCodes.set(1725, 'Insufficient Credit');
        routeSms.errorCodes.set(1726, 'Insufficient reseller Credit');


        return this;
    }

    
    public static set config(v : IConfig) {
        routeSms.config_ = v;
    }

    public static get engine(){
        return routeSms;
    }


    static async sendAsync(params: { Content: string, From: string, To: number[]| number, config?: IConfig}) {

        if(params.config){
            routeSms.config_ = {...params.config}
        }

        routeSms.config_.source = params.From;

        let contacts: string = ''
        if(Array.isArray(params.To) && params.To.length > 0){
            for (let index = 0; index < params.To.length; index++) {
                 contacts += String(params.To[index]) + ','
            }

            // remove the last comma ,
            contacts = contacts.substring(0, contacts.length-1);
        }else{
            contacts = String(params.To);
        }

        try{
           return  axios.post(`${routeSms.params_.protocol}://${routeSms.params_.host}${routeSms.params_.path}?username=${routeSms.params_.username}&password=${routeSms.params_.password}&type=${routeSms.config_.type}&dlr=${routeSms.config_.dlr}&destination=${contacts}&source=${routeSms.config_.source}&message=${params.Content}&url=${routeSms.config_.url}`)
           .then(results => {
               return routeSms.convertResponse(results.data)
           }).catch(err => {
               console.log(err)
           })
        }catch(err){
            console.error(err)
        }
        
    }

    static sendSync(params: { Content: string, From: string, To: number[]| number, config?: IConfig}) {

        if(params.config){
            this.config_ = {...params.config}
        }

        routeSms.config_.source = params.From;

        let contacts: string = ''
        if(Array.isArray(params.To) && params.To.length > 0){
            for (let index = 0; index < params.To.length; index++) {
                 contacts += String(params.To[index]) + ','
            }

            // remove the last comma ,
            contacts = contacts.substring(0, contacts.length-1);
        }else{
            contacts = String(params.To);
        }

    
        return axios.post(`${routeSms.params_.protocol}://${routeSms.params_.host}${routeSms.params_.path}?username=${routeSms.params_.username}&password=${routeSms.params_.password}&type=${routeSms.config_.type}&dlr=${routeSms.config_.dlr}&destination=${contacts}&source=${routeSms.config_.source}&message=${params.Content}&url=${routeSms.config_.url}`)
        .then((response) => { 
            const  res = routeSms.convertResponse(response.data);
            // console.log(response.data, res)
            return res;
        }).catch(function(err){
            console.error(err);
            return err
        })
  
        
    }


    static convertResponse(value: string) {
        const responses = value.split(',');
        const converted: IMessageResponse[] =[];

        return responses.map(response => {
            const parts = response.split('|');
            return {status: parts[0] =='1701' ? 'successful': 'failed', code:parts[0],message: routeSms.errorCodes.get(Number(parts[0])), destination: parts[1], id: parts[2] }
        })
    }
    
}