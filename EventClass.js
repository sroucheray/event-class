const multiChannelSep = /(?:,|\s)+/g;
const channelSep = /:+/g;
const channelsSymbol = Symbol("channels");

class EventClass {
    constructor(){
        this[channelsSymbol] = {};
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
                if(!this[channelsSymbol][namespace]){
                    continue;
                }

                for(let callback of this[channelsSymbol][namespace]){
                    callback.call(this, data);
                }
            }
        }
    }

    on(event, callback){
        let channels = this._getChannels(event);

        for (let channel of channels){
            if(!this[channelsSymbol][channel]){
                this[channelsSymbol][channel] = [];
            }

            this[channelsSymbol][channel].push(callback);
        }
    }

    off(event, callback){
        let channels = this._getChannels(event);

        for (let channel of channels){
            if(!this[channelsSymbol][channel]){
                return;
            }

            let index = this[channelsSymbol][channel].indexOf(callback);

            if(index > -1){
                this[channelsSymbol][channel].splice(index, 1);
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