function Kosmo() {
    var _ = { // "Private" API
        kosmoCatalog: "KOSMO_CATALOG",
        setParams: (paramsObject, flatParamsSet) => {
            _.clearParams();
            flatParamsSet = flatParamsSet || {};
            var props = Object.keys(paramsObject);
            var toRecurse = [];
            for ( var i = 0; i < props.length; i++ ) {
                var propName = props[i];
                var propValue = paramsObject[propName];
                if ( typeof propValue === "object" ) {
                    toRecurse.push(propValue);
                }
                else {
                    flatParamsSet[propName] = propValue;
                }
            }
            for ( i = 0; i < toRecurse.length; i++ ) {
                _.setParams(toRecurse[i],flatParamsSet);
            }
            var flatProps = Object.keys(flatParamsSet)
            for ( i = 0; i < flatProps.length; i++ ) {
                propName = flatProps[i];
                propValue = flatParamsSet[propName];
                pm.globals.set(propName, propValue);
            }
            pm.globals.set(_.kosmoCatalog, JSON.stringify(flatProps))
        },
        clearParams: () => {
            var serializedCatalog = pm.globals.get(_.kosmoCatalog);
            if (serializedCatalog) {
                var kosmoVarNames = JSON.parse(serializedCatalog)
                for ( var i = 0; i < kosmoVarNames.length; i++ ) {
                    pm.globals.unset(kosmoVarNames[i])
                }
                pm.globals.unset(_.kosmoCatalog)
            }
        }
    }
    
    var api = { // Public API
        clearParams: () => {
            _.clearParams()
        },
        setParamsByObject: (localParamsObject) => {
            _.setParams(localParamsObject)
        }
    }

    return api;
}
