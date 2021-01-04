/**
 * Internal dependencies
 */
import Context from './context';

function ConfigProvider( { config, children } ) {
	return <Context.Provider value={ config }>{ children }</Context.Provider>;
}

export default ConfigProvider;
