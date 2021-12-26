import axios from "axios";
import { IConfig, IMessageResponse, IParam } from "../interfaces/param";

export class routeSms {
    private params_:IParam = {protocol:'http', port: 8080, }
    private config_: IConfig

    private errorCodes: Map<number, string> = new Map()

    constructor(param: IParam){

        this.params_ = param;
        if (!this.params_.path){
            this.params_.path = '/bulksms/bulksms'
        }

        if(!this.params_.host){
            throw new Error("Host is not defined");
            
        }

        // set default config
        this.config_ = {
            type: 0,
            dlr:0,
            source: 'sender',
        }

        // set the error codes
        this.errorCodes.set(1701, 'Success, Message Submitted Successfully')
        this.errorCodes.set(1702, 'Invalid URL');
        this.errorCodes.set(1703, 'Invalid Username or password');
        this.errorCodes.set(1704, 'Invalid type field');
        this.errorCodes.set(1705, 'Invalid message');
        this.errorCodes.set(1706, 'Invalid destination');
        this.errorCodes.set(1707, 'Invalid source or sender');
        this.errorCodes.set(1708, 'Invalid value for dlr field');
        this.errorCodes.set(1709, 'User validation field');
        this.errorCodes.set(1710, 'Internal Error');
        this.errorCodes.set(1715, 'Response timeout');
        this.errorCodes.set(1725, 'Insufficient Credit');
        this.errorCodes.set(1726, 'Insufficient reseller Credit');
    }

    
    public set config(v : IConfig) {
        this.config_ = v;
    }


    async sendAsync(params: { Content: string, From: string, To: number[]| number, config?: IConfig}) {

        if(params.config){
            this.config = {...params.config}
        }

        this.config_.source = params.From;

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
           return  axios.post(`${this.params_.protocol}://${this.params_.host}${this.params_.path}?username=${this.params_.username}&password=${this.params_.password}&type=${this.config_.type}&dlr=${this.config_.dlr}&destination=${contacts}&source=${this.config_.source}&message=${params.Content}&url=${this.config_.url}`)
           .then(results => {
               return this.convertResponse(results.data)
           }).catch(err => {
               console.log(err)
           })
        }catch(err){
            console.error(err)
        }
        
    }

    sendSync(params: { Content: string, From: string, To: number[]| number, config?: IConfig}) {

        if(params.config){
            this.config = {...params.config}
        }

        this.config_.source = params.From;

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

    
        return axios.post(`${this.params_.protocol}://${this.params_.host}${this.params_.path}?username=${this.params_.username}&password=${this.params_.password}&type=${this.config_.type}&dlr=${this.config_.dlr}&destination=${contacts}&source=${this.config_.source}&message=${params.Content}&url=${this.config_.url}`)
        .then((response) => { 
            const  res = this.convertResponse(response.data);
            // console.log(response.data, res)
            return res;
        }).catch(function(err){
            console.error(err);
            return err
        })
  
        
    }


    convertResponse(value: string) {
        const responses = value.split(',');
        const converted: IMessageResponse[] =[];

        return responses.map(response => {
            const parts = response.split('|');
            return {status: parts[0] =='1701' ? 'successful': 'failed', code:parts[0],message: this.errorCodes.get(Number(parts[0])), destination: parts[1], id: parts[2] }
        })
    }
    
}