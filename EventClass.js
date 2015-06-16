const multiChannelSep = /\s+/g;
const channelSep = /:+/g;

class EventClass {
    constructor(){
        this._channels = {};
    }

    getChannels(channelString){
        return channelString.trim().split(multiChannelSep);
    }

    splitChannel(channel){
        return channel.trim().split(channelSep);
    }

    iterateChannel(channel, channelCallback, callbackCallback){
        let channels = this.getChannels(channel);

        for (let channel of channels){
            let channelSplit = this.splitChannel(channel);
            let lastChan = this._channels;

            for (let ch of channelSplit){
                let result = channelCallback.call(this, lastChan, ch);
                if(!result){
                    break
                }

                lastChan = lastChan[ch];
            }

            callbackCallback.call(this, lastChan);
        }
    }

    trigger(channel, data){
        this.iterateChannel(
            channel,
            (channelLeaf, ch)=>{
                if(channelLeaf[ch]){
                    return true;
                }

            },
            (channelLeaf)=>{
                if(!channelLeaf.callbacks){
                    return;
                }

                for (let callback of channelLeaf.callbacks){
                    callback.call(this, data);
                }
            }
        );
    }

    on(channel, callback){
        this.iterateChannel(
            channel,
            (channelLeaf, ch)=>{
                if(!channelLeaf[ch]){
                    channelLeaf[ch]= {};
                }

                return true;
            },
            (channelLeaf)=>{
                if(!channelLeaf.callbacks){
                    channelLeaf.callbacks = [];
                }

                channelLeaf.callbacks.push(callback);
            }
        );
    }

    off(channel, callback){
        if(!channel){
            this._channels = {};

            return;
        }

        this.iterateChannel(
            channel,
            (channelLeaf, ch)=>{
                if(channelLeaf[ch]){
                    return true;
                }

            },
            (channelLeaf)=>{
                if(!channelLeaf.callbacks){
                    return;
                }

                if(!callback){
                    channelLeaf.callbacks = [];

                    return;
                }

                let index = channelLeaf.callbacks.indexOf(callback);
                    console.log(channelLeaf.callbacks,callback)
                if(index > -1){
                    console.log(channelLeaf.callbacks)
                    channelLeaf.callbacks.splice(index, 1);
                    console.log(channelLeaf.callbacks)
                }
            }
        );
    }

    once(channel, callback){
        this.one(channel, function onceCallback(data){
            callbacks.call(this, data);
            this.off(channel, onceCallback);
        }.bind(this));
    }
}

export default EventClass;