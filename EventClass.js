const multiChannelSep = /(?:,|\s)+/g;
const channelSep = /:+/g;

class EventClass {
    constructor(){
        this._channels = {};
    }

    _getChannels(channelString){
        return channelString.trim().split(multiChannelSep);
    }

    _getNameSpaces(channel){
        let namespaces = [];
        let splittedChannels = channel.trim().split(channelSep);

        for (var i = splittedChannels.length; i >= 1; i--) {
            namespaces.push(splittedChannels.slice(0, i).join(":"))
        }

        return namespaces;
    }

    trigger(event, data){
        let channels = this._getChannels(event);

        for (let channel of channels){
            let namespaces = this._getNameSpaces(channel);
            for (let namespace of namespaces){
                if(!this._channels[namespace]){
                    continue;
                }

                for(let callback of this._channels[namespace]){
                    callback.call(this, data);
                }
            }
        }
    }

    on(event, callback){
        let channels = this._getChannels(event);

        for (let channel of channels){
            if(!this._channels[channel]){
                this._channels[channel] = [];
            }

            this._channels[channel].push(callback);
        }
    }

    off(event, callback){
        let channels = this._getChannels(event);

        for (let channel of channels){
            if(!this._channels[channel]){
                return;
            }

            let index = this._channels[channel].indexOf(callback);

            if(index > -1){
                this._channels[channel].splice(index, 1);
            }
        }
    }

    once(event, callback){
        function offCallback(){
            this.off(event, callback);
            this.off(event, offCallback);
        }

        this.on(event, callback);
        this.on(event, offCallback);
    }
}

export default EventClass;